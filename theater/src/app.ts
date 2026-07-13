import {
  currentUserMiddleware,
  errorHandlerMiddleware,
} from "@adarsh-tickets/shared";
import express from "express";
import {
  createTheaterRouter,
  deleteTheaterRouter,
  getTheaterListRouter,
  getTheaterRouter,
  screenCreateRouter,
  screenDeleteRouter,
  screengetRouter,
  screenListRouter,
  screenUpdateRouter,
  theaterUpdateRouter,
} from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);
app.use(createTheaterRouter);
app.use(deleteTheaterRouter);
app.use(getTheaterListRouter);
app.use(getTheaterRouter);
app.use(theaterUpdateRouter);
app.use(getTheaterListRouter);

app.use(screenCreateRouter);
app.use(screenDeleteRouter);
app.use(screengetRouter);
app.use(screenListRouter);
app.use(screenUpdateRouter);

app.use(errorHandlerMiddleware);

export { app };
