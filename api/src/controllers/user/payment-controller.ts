import { EventModel, UserModel } from "@/models";
import { AdminEventModel } from "@/models/admin-events.model";
import { PaymentModel } from "@/models/payment-model";
import { StoreType } from "@/types";
import crypto from "crypto";
import Elysia, { t } from "elysia";

export const paymentController = new Elysia({
  prefix: "/payment",
  detail: {
    tags: ["Payment"],
    description: "Handles payment related operations",
  },
}).post(
  "/generateHash",
  async ({ body, store, set }) => {
    try {
      const userId = (store as StoreType)["id"];

      const user = await UserModel.findById(userId);

      if (!user) {
        return { error: "User not found" };
      }

      const { productInfo, amount, eventId, tickets, name, emailId, mobileNumber, subTotal, tax } = body;

      const event = await AdminEventModel.findById(eventId);

      if (!event) {
        set.status = 400
        return {
          message: "Event not found"
        }
      }

      if (tickets > event.reminingTickets) {
        set.status = 400;
        return {
          message: `Only ${event.reminingTickets} ${event.reminingTickets === 1 ? "ticket" : "tickets"}  available`,
        };
      }

      const key = process.env.PAYU_KEY || "";
      const salt = process.env.PAYU_SALT || "";

      const uniqueId =
        `TXN${crypto.randomBytes(6).toString("hex")}` + Date.now().toString();

      let hashString =
        key +
        "|" +
        uniqueId +
        "|" +
        amount +
        "|" +
        productInfo +
        "|" +
        user.name +
        "|" +
        user.email +
        "|||||||||||" +
        salt;

      const hash = crypto.createHash("sha512").update(hashString).digest("hex");

      const paymentEntry = new PaymentModel({
        txnId: uniqueId,
        hash,
        status: "Started",
        userId: user._id,
        eventId: eventId,
        amount: amount,
        subTotal: subTotal,
        tax: tax,
        formString: "",
        message: "Payment started",
        pgResponse: "",
        ticketCount: tickets,
        name: name,
        emailId: emailId,
        mobileNumber: mobileNumber,
      });

      let formHtml = `
      <form
        id="payuForm"
        action="https://secure.payu.in/_payment"
        method="post"
      >
        <input type="hidden" name="key" value="${key}" />
        <input type="hidden" name="txnid" value=${uniqueId} />
        <input type="hidden" name="amount" value="${amount}" />
        <input type="hidden" name="productinfo" value="${productInfo}" />
        <input type="hidden" name="firstname" value="${user.name}" />
        <input type="hidden" name="email" value="${user.email}" />
        <input type="hidden" name="phone" value="${user.mobile}" />
        <input
          type="hidden"
          name="surl" value="https://aprisio.com/paymentz?status=success&txnId=${paymentEntry._id}"
        />
        <input
          type="hidden"
          name="furl"
          value="https://aprisio.com/paymentz?status=failed&txnId=${paymentEntry._id}"
        />
        <input type="hidden" name="hash" value="${hash}" />

        <button type="submit">Pay Now</button>
      </form>
      `;

      paymentEntry.formString = formHtml;

      await paymentEntry.save();

      return { formHtml };
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  },
  {
    body: t.Object({
      productInfo: t.String(),
      amount: t.Number(),
      subTotal: t.Number(),
      tax: t.Number(),
      eventId: t.String(),
      tickets: t.Number(),
      name: t.Optional(t.String()),
      emailId: t.Optional(t.String()),
      mobileNumber: t.Optional(t.String())
    }),
  }
);
