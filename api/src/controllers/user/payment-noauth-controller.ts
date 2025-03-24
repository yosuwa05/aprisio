import { sendEmail } from "@/lib/mail";
import { AdminEventModel } from "@/models/admin-events.model";
import { PaymentModel } from "@/models/payment-model";
import { TicketModel } from "@/models/ticket-tracking";
import axios from "axios";
import crypto from "crypto";
import Elysia, { t } from "elysia";
import { formatDateForPDF } from "./events/events-controller";

export const paymentNoAuthController = new Elysia({
  prefix: "/paymentz",
  detail: {
    tags: ["Payment - No Auth"],
    description: "Handles payment related operations for no auth environments",
  },
})
  .get(
    "/tumma",
    async ({ query }) => {
      try {
        const { txnId } = query;

        const paymentEntry = await PaymentModel.findOne({
          _id: txnId,
        });

        const key = process.env.PAYU_KEY || "";

        if (!paymentEntry) {
          return { ok: false, message: "Unprocessable Entity" };
        }

        const encodedParams = new URLSearchParams();
        encodedParams.set("key", key);
        encodedParams.set("command", "verify_payment");
        encodedParams.set("var1", paymentEntry.txnId);
        encodedParams.set("hash", paymentEntry.hash);

        const options = {
          method: "POST",
          url: "https://info.payu.in/merchant/postservice.php?form=2",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          data: encodedParams,
        };

        let res = await axios.request(options);
        console.log(res.data);
      } catch (error) {
        console.error(error);
        return { error: error };
      }
    },
    {
      query: t.Object({
        txnId: t.Any(),
      }),
    }
  )
  .get(
    "/",
    async ({ query, set }) => {
      const { status, txnId } = query;
      try {
        const paymentEntry = await PaymentModel.findOne({
          _id: txnId,
        });

        if (!paymentEntry) {
          set.status = 403;
          return { ok: false, message: "Unprocessable Entity" };
        }

        const existingTicket = await TicketModel.findOne({
          txnId: paymentEntry.txnId,
        });

        if (existingTicket) {
          return { ok: false, message: "Ticket already sold" };
        }

        const key = process.env.PAYU_KEY || "";
        const salt = process.env.PAYU_SALT || "";

        const event = await AdminEventModel.findById(paymentEntry.eventId);

        if (!event) {
          set.status = 403;
          return { ok: false, message: "Event not found" };
        }

        if (status == "failed") {
          paymentEntry.status = "Failed";
          paymentEntry.pgResponse = "{}";
          paymentEntry.message = "Payment Failed!";

          await paymentEntry.save();

          return { ok: false, message: "Payment Failed!" };
        }

        if (status == "success") {
          let hashString =
            key +
            "|" +
            "verify_payment" +
            "|" +
            paymentEntry.txnId +
            "|" +
            salt;

          const hash = crypto
            .createHash("sha512")
            .update(hashString)
            .digest("hex");

          const encodedParams = new URLSearchParams();
          encodedParams.set("key", key);
          encodedParams.set("command", "verify_payment");
          encodedParams.set("var1", paymentEntry.txnId || "");
          encodedParams.set("hash", hash);

          const options = {
            method: "POST",
            url: "https://info.payu.in/merchant/postservice.php?form=2",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            data: encodedParams,
          };

          const res = await axios.request(options);

          if (res.data.status == 0) {
            paymentEntry.status = "Failed";
            paymentEntry.pgResponse = "{}";
            paymentEntry.message = "Payment Failed! Suspect fraud";

            await paymentEntry.save();

            return { ok: false, message: "Not a valid payment! Go Away!" };
          }

          paymentEntry.status = "Success";
          paymentEntry.pgResponse = JSON.stringify(res.data);
          paymentEntry.message = "Payment Successful";

          let count = paymentEntry.ticketCount;
          let prefix = event.ticketPrefix;
          let lastSoldTicketNumber = event.lastSoldTicketNumber;

          let ticket = {
            ticketId:
              prefix + String(lastSoldTicketNumber + 1).padStart(5, "0"),
            ticketPdf: "",
          };

          paymentEntry.tickets = ticket;

          const tickettrack = new TicketModel({
            userId: paymentEntry.userId,
            amount: paymentEntry.amount,
            eventId: paymentEntry.eventId,
            subTotal: paymentEntry.subTotal,
            gst: paymentEntry.tax,
            txnId: paymentEntry.txnId,
            paymentTrack: paymentEntry._id,
            ticketPrice: paymentEntry.amount,
            tickets: ticket,
            ticketCount: count,
            name: paymentEntry.name,
            emailId: paymentEntry.emailId,
            mobileNumber: paymentEntry.mobileNumber
          });

          await tickettrack.save();

          event.soldTickets = event.soldTickets + count;
          event.reminingTickets = event.reminingTickets - count;
          event.lastSoldTicketNumber = lastSoldTicketNumber + count;

          await paymentEntry.save();

          await event.save();

          let content = `
  <div>
    
    <div style="text-align: center;">
    <img
          class="noise"
           style="height: 60px; width: 240px; top: 0; right: 0"
          src="https://aprisio.com/_next/static/media/logo.61120085.png"
          />
    </div>


    <p>Hi,</p>

    <p>Thanks for your purchase!</p>

    <p>Your ticket for the <strong>Aprisio experience</strong> is enclosed.</p>

    <p>You can also download your ticket from  
      <a href="https://www.aprisio.com/profile" target="_blank">
        www.aprisio.com > My Account > Experiences
      </a>.
    </p>

    <p>In case of queries, please reach out to  
      <a href="mailto:support@aprisio.com">support@aprisio.com</a>.
    </p>
    <br>
    <p><strong>Event Name:</strong> ${event.eventName}</p>

    <p><strong>Transaction ID:</strong> ${paymentEntry.txnId}</p>
    <p><strong>Ticket ID:</strong> ${ticket?.ticketId}</p>
    <p><strong>Number of Tickets:</strong> ${tickettrack?.ticketCount}</p>
    <p><strong>Date of Booking:</strong> ${formatDateForPDF(tickettrack?.createdAt)}</p>
    <br>


    <p>Regards,</p>
    <p><strong>Aprisio Team</strong></p>
  </div>
`;

          await sendEmail({
            subject: "Your ticket for Aprisio experience",
            to: paymentEntry.emailId,
            html: content,
            from: "noreply@aprisio.com",
          });

          return {
            ok: true,
            message: "Payment Successful",
            event,
            count,
            tickets: ticket,
            amount: paymentEntry.amount,
            tax: paymentEntry.tax,
            subTotal: paymentEntry.subTotal,
            transactionDate: paymentEntry.createdAt,
          };
        }

        return {
          ok: false,
        };
      } catch (error) {
        console.error(error);
        return { error: error };
      }
    },
    {
      query: t.Object({
        status: t.String(),

        txnId: t.Any(),
      }),
    }
  );
