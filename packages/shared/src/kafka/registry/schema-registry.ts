import { SchemaRegistryClient } from "@confluentinc/schemaregistry";

export const schemaRegistry = new SchemaRegistryClient({
  baseURLs: ["http://localhost:8081"],
});
