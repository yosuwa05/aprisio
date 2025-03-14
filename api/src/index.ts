import { config } from "dotenv";
import { app } from "./setup";

const hostname = "localhost";
const port = 3000;

config();

const PORT = 3000;

app.listen({ port: PORT }, () => {
  // 5 minutes
  console.log(`Listening on http://${hostname}:${port}`);
  console.log(`Checkout the docs at http://${hostname}:${port}/api/docs`);
});
