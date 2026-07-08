import { SchemaRegistryClient } from "@confluentinc/schemaregistry";
import { AvroSerializer } from "@confluentinc/schemaregistry/dist/serde/avro";
import { SerdeType } from "@confluentinc/schemaregistry/dist/serde/serde";
import { schemaRegistry } from "./schema-registry";

export const avroSerializer = new AvroSerializer(
  schemaRegistry,
  SerdeType.VALUE,
  {
    // automatically register schema no need of register otherwise use schema.loader.ts
    autoRegisterSchemas: true,
  },
);
