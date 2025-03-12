import admin from "firebase-admin";
import { readFileSync } from "node:fs";

let cred = JSON.parse(readFileSync("service-account.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
  });
}

export async function sendNotification(
  token: string,
  title: string,
  body: string,
  payload: any = {},
) {
  try {
    if (!token) throw new Error("Token not found");
    if (!title) throw new Error("Title not found");
    if (!body) throw new Error("Body not found");

    await admin.messaging().send({
      token,
      data: {
        title,
        body,
        ...payload,
      },
      notification: {
        title,
        body,
      },
    });

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

export const db = admin.firestore();
