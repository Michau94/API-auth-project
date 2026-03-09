export const taskStatusEnum = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const taskPriorityEnum = ["LOW", "MEDIUM", "HIGH"] as const;

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
      properties: {
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string" },
            priority: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            userId: { type: "string" },
          },
        },
      },
    },
    401: {
      type: "object",
      additionalProperties: false,
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const taskIdParamSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 1 },
    },
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
      properties: {
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string" },
            priority: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            userId: { type: "string" },
          },
        },
      },
    },
  },
};
