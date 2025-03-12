import cors from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { baseRouter } from "./controllers";
import { EventModel } from "./models";

const app = new Elysia();

app.use(cors());

const URL = process.env.DB_URL;

try {
  await mongoose.connect(URL as string, {
    dbName: "aprisio",
    maxConnecting: 10,
  });

  console.log("Connected to Database");
} catch (e) {
  console.log(e);
}

app.use(
  logger({
    level: "info",
  })
);

app.use(
  cron({
    name: "heartbeat",
    pattern: "0 0 * * *",
    async run() {
      console.log("cron running");
      const events = await EventModel.find({ isEventEnded: false });
      for (let event of events) {
        if (new Date() > new Date(event.date)) {
          await EventModel.updateOne(
            { _id: event._id },
            { $set: { isEventEnded: true } }
          );
        }
      }
    },
  })
);

// let res = await sendNotification(
//   "dzImjSr_jftAg4qEWaLDrN:APA91bEUvHZpNmxLVOIMtxhY52eJ7iXsvGwu_l2djMTUy4jWwuzIOeawdnU8S5Q1KBABnI7EtfxEKkNBqfS42ERVF-B7K_CdJaUFHyLUOjkVp4DGoOSeKLQ",
//   "brooo",
//   "brooo"
// );

// console.log(res);

app.use(
  swagger({
    path: "/api/docs",
    exclude: ["/docs", "/docs/json"],
    theme: "dark",
    documentation: {
      servers: [
        {
          url: "/",
        },
      ],
      info: {
        title: "Aprisio API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            scheme: "bearer",
            type: "http",
            bearerFormat: "JWT",
          },
        },
      },
    },
  })
);

app.onError(({ code, error }) => {
  if (code === "VALIDATION") {
    return {
      status: 400,
      body: error.all,
    };
  }
});

app.use(baseRouter);

export { app };
