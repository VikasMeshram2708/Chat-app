import express from "express";
import dotenv from 'dotenv'
dotenv.config();

const app = express();
import cors from "cors";

// middlewares
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// routes
app.use("/", (req, res) => {
  res.json({
    message: "hello,world",
  });
});

export default app;
