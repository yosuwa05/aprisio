import crypto from "crypto";
import Elysia from "elysia";

export const paymentController = new Elysia({
  prefix: "/payment",
  detail: {
    tags: ["Payment"],
    description: "Handles payment related operations",
  },
}).get("/generateHash", async ({ body }) => {
  try {
    let productInfo = "iPhone";
    let firstName = "Ashish";
    let email = "test@gmail.com";
    const key = "h8qrYY";

    const uniqueId =
      `TXN${crypto.randomBytes(6).toString("hex")}` + Date.now().toString();

    let hashString =
      key +
      "|" +
      uniqueId +
      "|" +
      "1" +
      "|" +
      productInfo +
      "|" +
      firstName +
      "|" +
      email +
      "|||||||||||" +
      "JhIAxVvq8UxCJv1K9vufvMFmBaRXUp97";
    let surl = "https://web.xopay.in";
    let furl = "https://web.xopay.in";

    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    return { hash, key, uniqueId };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
});
