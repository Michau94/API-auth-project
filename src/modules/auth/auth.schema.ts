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
      required: ["accessToken", "user"],
      properties: {
        accessToken: { type: "string" },
        user: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    400: {
      type: "object",
      required: ["message"],
      properties: {
        message: { type: "string" },
      },
    },
  },
};
