import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { baseRouter } from "./controllers";

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
