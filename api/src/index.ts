import { config } from "dotenv";
import { app } from "./setup";

const hostname = "localhost";
const port = 4000;

config();

const PORT = 4000;

app.listen({ port: PORT }, () => {
  console.log(`Listening on http://${hostname}:${port}`);
  console.log(`Checkout the docs at http://${hostname}:${port}/api/docs`);
});
