export const projectMemberRoleEnum = ["ADMIN", "MEMBER"] as const;

const projectResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    ownerId: { type: "string" },
    createdAt: { type: "string" },
  },
} as const;

// error schemas

const unauthorizedResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["message"],
  properties: {
    message: { type: "string" },
  },
} as const;

const notFoundResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["message"],
  properties: {
    message: { type: "string" },
  },
} as const;

const forbiddenResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["message"],
  properties: { message: { type: "string" } },
} as const;

//schemas

export const createProjectSchema = {
  body: {
    type: "object",
    required: ["name"],
    additionalProperties: false,
    properties: {
      name: { type: "string" },
      description: { type: "string" },
    },
  },
  response: {
    201: projectResponseSchema,
    404: notFoundResponseSchema,
    403: forbiddenResponseSchema,
  },
};

export const updateProjectSchema = {
  body: {
    type: "object",
    minProperties: 1,
    additionalProperties: false,
    properties: {
      name: { type: "string" },
      description: { type: "string" },
    },
  },
  response: {
    200: projectResponseSchema,
    404: notFoundResponseSchema,
    403: forbiddenResponseSchema,
  },
};

export const addProjectMemberSchema = {
  body: {
    required: ["email", "role"],
    type: "object",
    additionalProperties: false,
    properties: {
      email: { type: "string" },
      role: { type: "string", enum: projectMemberRoleEnum },
    },
  },
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      required: ["userId", "projectId", "role", "joinedAt"],
      properties: {
        userId: { type: "string" },
        projectId: { type: "string" },
        role: { type: "string", enum: [...projectMemberRoleEnum] },
        joinedAt: { type: "string" },
      },
    },
    404: notFoundResponseSchema,
    403: forbiddenResponseSchema,
  },
};

export const getProjectsSchema = {
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: projectResponseSchema,
        },
      },
    },
    401: unauthorizedResponseSchema,
  },
};

export const getProjectByIdSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  response: {
    200: projectResponseSchema,
    401: unauthorizedResponseSchema,
    404: notFoundResponseSchema,
  },
};
