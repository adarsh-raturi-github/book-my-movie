import { AvroDeserializer } from "@confluentinc/schemaregistry/dist/serde/avro";
import { SerdeType } from "@confluentinc/schemaregistry/dist/serde/serde";
import { schemaRegistry } from "./schema-registry";

export const avroDeserializer = new AvroDeserializer(
  schemaRegistry,
  SerdeType.VALUE,
  {},
);
