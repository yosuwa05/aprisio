import admin from "firebase-admin";
import { readFileSync } from "node:fs";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(readFileSync("service-account.json", "utf-8"))
    ),
  });
}

export const db = admin.firestore();
