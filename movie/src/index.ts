import { app } from "./app";
const start = async () => {
  try {
  } catch (e) {
    throw new Error();
  }

  app.listen(3001, () => {
    console.log("Movie Service started on 3001!");
  });
};
start();
