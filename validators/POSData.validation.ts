import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

const posDataSchema = {
  type: "object",
  required: ["id","name", "products"],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    products: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "price", "order"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          price: { type: "number", minimum: -1000, maximum: 1000 },
          order: { type: "integer" },
          tilecolor: { type: "string", nullable: true },
          imageURL: { type: "string", nullable: true }
        }
      }
    }
  },
  additionalProperties: false
};

export const validatePOSData = ajv.compile(posDataSchema);
