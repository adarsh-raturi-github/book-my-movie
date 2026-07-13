import {
  currentUserMiddleware,
  errorHandlerMiddleware,
} from "@adarsh-tickets/shared";
import express from "express";
import {
  showCreateRouter,
  showDeleteRouter,
  showGetRouter,
  showListRouter,
  showUpdateRouter,
} from "./routes/shows";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);
app.use(showCreateRouter);
app.use(showUpdateRouter);
app.use(showDeleteRouter);
app.use(showGetRouter);
app.use(showListRouter);
app.use(errorHandlerMiddleware);

export { app };
