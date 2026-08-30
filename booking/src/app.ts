import {
  currentUserMiddleware,
  errorHandlerMiddleware,
} from "@adarsh-tickets/shared";
import express from "express";
import { bookingCreateRouter } from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);

app.use(bookingCreateRouter);
app.use(errorHandlerMiddleware);

export { app };
