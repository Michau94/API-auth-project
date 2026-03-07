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
  },
  properties: {
    id: { type: "string", minLength: 1 },
  },
  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      status: { type: "string", enum: [...taskStatusEnum] },
      priority: { type: "string", enum: [...taskPriorityEnum] },
    },
  },
};
