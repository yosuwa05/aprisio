import { customAlphabet } from "nanoid";
import { PasetoUtil } from "./paseto";

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const validateToken = async (token: string) => {
  const payload = await PasetoUtil.decodePaseto(token);

  if (!payload) {
    throw new Error("Unauthorized");
  }

  return payload.payload;
};

export const generateEventId = () => {
  const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    10
  );
  return `EVT-${nanoid()}`;
};

export const generateTicketPrefix = () => {
  const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    6
  );
  return `TK-${nanoid()}`;
};
