import { Allergy } from "./allergy";
import { Ingredient } from "./ingredient";

export type User = {
  id: number;
  fullName: string;
  email: string;
  allergies: Allergy[];
  role: string;
  ingredients: Ingredient[];
};
