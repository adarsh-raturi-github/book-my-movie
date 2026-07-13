import {
  currentUserMiddleware,
  errorHandlerMiddleware,
} from "@adarsh-tickets/shared";
import express from "express";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);

app.use(errorHandlerMiddleware);

export { app };
