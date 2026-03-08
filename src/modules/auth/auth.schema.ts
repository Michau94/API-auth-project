export const createUserSchema = {
  body: {
    type: "object",
    required: ["email", "password", "name"],
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
    },
  },
};

export const loginUserSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: { type: "string", format: "email" },
      passwordHash: { type: "string", minLength: 8 },
    },
  },
};
