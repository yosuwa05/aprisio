import cors from "@elysiajs/cors";
import { cron } from "@elysiajs/cron";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { baseRouter } from "./controllers";

import { EventModel } from "./models";
import { AdminEventModel } from "./models/admin-events.model";

const app = new Elysia();


app.ws("/api/ws", {
  open: (ws) => {
    console.log("WebSocket connection opened");

  },
  message: (ws, message) => {
    console.log("Message received:", message);
  },
});


app.listen({
  idleTimeout: 200,
});

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

      // ===  User Events ===
      const events = await EventModel.find({ isEventEnded: false });
      for (let event of events) {
        if (new Date() > new Date(event.date)) {
          await EventModel.updateOne(
            { _id: event._id },
            { $set: { isEventEnded: true } }
          );
        }
      }

      // ===  Admin Events ===
      const adminEvents = await AdminEventModel.find({ isEventEnded: false });
      for (const adminEvent of adminEvents) {
        if (new Date() > new Date(adminEvent.enddatetime || adminEvent.datetime)) {
          await AdminEventModel.updateOne(
            { _id: adminEvent._id },
            { $set: { isEventEnded: true } }
          );
          console.log(`Admin Event marked as ended: ${adminEvent._id}`);
        }
      }

    },
  })
);



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
