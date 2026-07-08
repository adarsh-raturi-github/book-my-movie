import fs from "fs";
import { schemaRegistry } from "./schema-registry";

export async function registerSchema(subject: string, path: string) {
  const schema = fs.readFileSync(path, "utf8");

  return schemaRegistry.register(subject, {
    schema,
    schemaType: "AVRO",
  });
}

// call it using
// await registerSchema(
//   "order-events-value",
//   "src/schemas/order.avsc"
// );
