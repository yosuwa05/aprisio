import admin from "firebase-admin";
import { readFileSync } from "node:fs";

let cred = JSON.parse(readFileSync("service-account.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
  });
}

// console.log("Firestore SDK Type:", admin.app().options.credential);

export const db = admin.firestore();
// const testDoc = await db
//   .collection("test")
//   .doc("EC2-Test")
//   .set({ msg: "Hello from EC2" });
// console.log("Write Success ✅", testDoc);
