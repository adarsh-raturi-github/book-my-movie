import { NotFoundError } from "@adarsh-tickets/shared";
import { app } from "./app";
const start = async () => {
  try {
    if (!process.env.SERVICE_NAME) {
      throw new NotFoundError();
    }
  } catch (e) {
    throw new Error();
  }

  app.listen(3003, () => {
    console.log("Show Service started on 3003!!");
  });
};
start();
