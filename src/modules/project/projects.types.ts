export type CreateProjectBody = {
  name: string;
  description?: string;
};

export type UpdateProjectBody = Partial<CreateProjectBody>;

export type AddMemberBody = {
  email: string;
  role: "ADMIN" | "MEMBER";
};

export type ProjectParams = {
  id: string;
};
