import admin from "firebase-admin";
import { readFileSync } from "node:fs";

let cred = JSON.parse(readFileSync("service-account.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
  });
}

export const db = admin.firestore();
