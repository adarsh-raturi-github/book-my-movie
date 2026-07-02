import { app } from "./app";
const start = async () => {
  try {
  } catch (e) {
    throw new Error();
  }

  app.listen(3002, () => {
    console.log("Theater Service started on 3002!!");
  });
};
start();
