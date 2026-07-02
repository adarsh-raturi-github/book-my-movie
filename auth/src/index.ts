import express from "express";
import {
  currentUserMiddleware,
  errorHandlerMiddleware,
} from "@adarsh-tickets/shared";
import { signupRouter } from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);
app.use(signupRouter);
app.use(errorHandlerMiddleware);
const start = async () => {
  try {
  } catch (e) {
    throw new Error();
  }

  app.listen(3000, () => {
    console.log("Auth Service started on 3000!");
  });
};

start();
