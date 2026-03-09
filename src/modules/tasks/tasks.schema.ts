export const taskStatusEnum = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const taskPriorityEnum = ["LOW", "MEDIUM", "HIGH"] as const;

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

const taskListItemSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "title", "createdAt", "status", "priority"],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    createdAt: { type: "string" },
    status: { type: "string" },
    priority: { type: "string" },
  },
} as const;

const taskDetailSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "title",
    "createdAt",
    "updatedAt",
    "status",
    "priority",
    "userId",
  ],
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    status: { type: "string" },
    priority: { type: "string" },
    userId: { type: "string" },
  },
} as const;

export const getTasksSchema = {
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      required: ["data"],
      properties: {
        data: {
          type: "array",
          items: taskListItemSchema,
        },
      },
    },
    401: unauthorizedResponseSchema,
  },
};

export const createTaskSchema = {
  body: {
    type: "object",
    required: ["title"],
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      status: { type: "string", enum: taskStatusEnum },
      priority: { type: "string", enum: taskPriorityEnum },
    },
  },
  response: {
    201: {
      type: "object",
      additionalProperties: false,
      required: ["data"],
      properties: {
        data: taskDetailSchema,
      },
    },
    401: unauthorizedResponseSchema,
  },
};

export const getTaskByIdSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
  },
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      required: ["data"],
      properties: {
        data: taskDetailSchema,
      },
    },
    401: unauthorizedResponseSchema,
    404: notFoundResponseSchema,
  },
};

export const updateTaskSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
  },
  body: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      status: { type: "string", enum: [...taskStatusEnum] },
      priority: { type: "string", enum: [...taskPriorityEnum] },
    },
  },
  response: {
    200: {
      type: "object",
      additionalProperties: false,
      required: ["data"],
      properties: {
        data: taskDetailSchema,
      },
    },
    401: unauthorizedResponseSchema,
    404: notFoundResponseSchema,
  },
};

export const deleteTaskSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
  },
  response: {
    204: {
      type: "null",
    },
    401: unauthorizedResponseSchema,
    404: notFoundResponseSchema,
  },
};
