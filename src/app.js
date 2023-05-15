import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routers from "./routers/index.router.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(routers);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
