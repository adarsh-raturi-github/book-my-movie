import express from "express";
import {
  currentUserMiddleware,
  errorHandlerMiddleware,
  initializeKafka,
} from "@adarsh-tickets/shared";
import {
  currentUserRouter,
  deleteUserRouter,
  logoutRouter,
  signInRouter,
  signupRouter,
  updateUserRouter,
} from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);
app.use(signupRouter);
app.use(currentUserRouter);
app.use(deleteUserRouter);
app.use(logoutRouter);
app.use(signInRouter);
app.use(updateUserRouter);
app.use(errorHandlerMiddleware);
const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be defined");
    }

    if (!process.env.CLIENT_ID) {
      throw new Error("CLIENT_ID must be defined");
    }

    if (!process.env.KAFKA_BROKERS) {
      throw new Error("KAFKA_BROKERS must be defined");
    }

    if (!process.env.SERVICE_NAME) {
      throw new Error("SERVICE_NAME must be defined");
    }

    if (!process.env.KAFKA_GROUP_ID) {
      throw new Error("KAFKA_GROUP_ID must be defined");
    }
  } catch (e) {
    throw new Error();
  }

  app.listen(3000, () => {
    console.log("Auth Service started on 3000!");
  });
};

start();
