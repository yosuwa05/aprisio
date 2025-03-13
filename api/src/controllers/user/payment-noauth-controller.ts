import { AdminEventModel } from "@/models/admin-events.model";
import { PaymentModel } from "@/models/payment-model";
import { TicketModel } from "@/models/ticket-tracking";
import axios from "axios";
import Elysia, { t } from "elysia";

const generateTicketNumbers = (
  prefix: string,
  count: number,
  lastSoldTicketNumber: number
) => {
  let tickets = [];
  for (let i = 1; i <= count; i++) {
    let ticketNumber = String(lastSoldTicketNumber + i).padStart(5, "0");
    tickets.push(`${prefix}${ticketNumber}`);
  }
  return tickets;
};

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
    async ({ query, set, redirect }) => {
      try {
        const { hash, status, txnId } = query;

        const paymentEntry = await PaymentModel.findOne({
          _id: txnId,
        });

        if (!paymentEntry) {
          set.status = 403;
          return { ok: false, message: "Unprocessable Entity" };
        }

        const key = process.env.PAYU_KEY || "";

        const event = await AdminEventModel.findById(paymentEntry.eventId);

        if (!event) {
          set.status = 403;
          return { ok: false, message: "Event not found" };
        }

        if (status === "failed") {
          paymentEntry.status = "Failed";
          paymentEntry.pgResponse = "{}";
          paymentEntry.message = "Payment Failed!";

          await paymentEntry.save();

          return redirect("https://aprisio.com/feed", 307);
        } else if (status === "success") {
          const encodedParams = new URLSearchParams();
          encodedParams.set("key", key);
          encodedParams.set("command", "verify_payment");
          encodedParams.set("var1", paymentEntry.txnId);
          encodedParams.set("hash", hash);

          const options = {
            method: "POST",
            url: "https://info.payu.in/merchant/postservice.php?form=2",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            data: encodedParams,
          };

          axios
            .request(options)
            .then(async (res) => {
              if (res.data.status == 0) {
                paymentEntry.status = "Failed";
                paymentEntry.pgResponse = "{}";
                paymentEntry.message = "Payment Failed! Suspect fraud";

                await paymentEntry.save();

                return { ok: false, message: "Not a valid payment! Go Away!" };
              } else {
                paymentEntry.status = "Success";
                paymentEntry.pgResponse = JSON.stringify(res.data);
                paymentEntry.message = "Payment Successful";

                let count = paymentEntry.ticketCount;
                let prefix = event.ticketPrefix;
                let lastSoldTicketNumber = event.lastSoldTicketNumber;

                const tickets = generateTicketNumbers(
                  prefix,
                  count,
                  lastSoldTicketNumber
                );

                paymentEntry.tickets = tickets;

                const tickettrack = new TicketModel({
                  userId: paymentEntry.userId,
                  amount: paymentEntry.amount,
                  eventId: paymentEntry.eventId,
                  gst: 0,
                  paymentTrack: paymentEntry._id,
                  ticketPrice: paymentEntry.amount,
                  tickets: tickets,
                });

                await tickettrack.save();
                await paymentEntry.save();

                return { ok: true, message: "Payment Successful" };
              }
            })
            .catch((err) => console.error(err));
        }

        await paymentEntry.save();

        return redirect("http://localhost:3001/feed");
      } catch (error) {
        console.error(error);
        return { error: error };
      }
    },
    {
      query: t.Object({
        status: t.String(),
        hash: t.String(),
        txnId: t.Any(),
      }),
    }
  );
