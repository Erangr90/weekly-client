export type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  allergyIds: number[];
};

export type LoginForm = {
  email: string;
  password: string;
};
