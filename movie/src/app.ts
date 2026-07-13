import {
  currentUserMiddleware,
  errorHandlerMiddleware,
} from "@adarsh-tickets/shared";
import express from "express";
import {
  movieCreateRoute,
  movieDeleteRoute,
  movieGetRoute,
  movieListRoute,
  movieUpdateRoute,
} from "./routes";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(currentUserMiddleware);
app.use(movieCreateRoute);
app.use(movieGetRoute);
app.use(movieListRoute);
app.use(movieUpdateRoute);
app.use(movieDeleteRoute);

app.use(errorHandlerMiddleware);

export { app };
