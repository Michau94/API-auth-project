export type createUserInput = {
  name: string;
  email: string;
  password: string;
};

export type loginUserInput = {
  email: string;
  password: string;
};

export interface AuthenticatedUser {
  id: string;
  email: string;
}
