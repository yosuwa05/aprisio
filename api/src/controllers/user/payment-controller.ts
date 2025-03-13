import { UserModel } from "@/models";
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
  async ({ body, store }) => {
    try {
      const userId = (store as StoreType)["id"];

      const user = await UserModel.findById(userId);

      if (!user) {
        return { error: "User not found" };
      }

      const { productInfo, amount } = body;

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
          name="surl"
          value="https://wenoxo.com/"
        />
        <input
          type="hidden"
          name="furl"
          value="http://localhost:3001/failed"
        />
        <input type="hidden" name="hash" value="${hash}" />

        <Button type="submit">Pay Now</Button>
      </form>
      `;

      return { formHtml };
    } catch (error) {
      console.error(error);
      return { error: "An error occurred" };
    }
  },
  {
    body: t.Object({
      productInfo: t.String(),
      amount: t.Number(),
    }),
  }
);
