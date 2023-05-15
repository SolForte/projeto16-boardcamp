import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routers from "./routers/index.router.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(routers);

app.listen(process.env.PORT, () =>
  console.log(`Running server on port ${process.env.PORT}.`)
);
