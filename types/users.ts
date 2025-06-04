export type User = {
  id: number;
  fullName: string;
  email: string;
  allergyIds: number[];
  role: string;
  ingredientIds: number[];
};

export type UserIngr = {
  ingredientIds: number[];
};
