import { app } from "./app";
const start = async () => {
  try {
  } catch (e) {
    throw new Error();
  }

  app.listen(3003, () => {
    console.log("Show Service started on 3003!!");
  });
};
start();
