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
  response: {
    201: {
      type: "object",
      properties: {
        email: { type: "string" },
        name: { type: "string" },
      },
    },
    409: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
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
      password: { type: "string", minLength: 8 },
    },
  },
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      required: ["accessToken"],
      properties: {
        accessToken: { type: "string" },
      },
    },
    401: {
      type: "object",
      required: ["message"],
      properties: {
        message: { type: "string" },
      },
    },
  },
};
