import { Allergy } from "@/types/allergy";
import { Ingredient } from "@/types/ingredient";
import { MiniRestaurant } from "@/types/restaurant";

export type CreateDish = {
  name: string;
  price: number;
  restaurantId: number;
  image?: string;
  description: string;
  allergyIds: number[];
  ingredientIds: number[];
};

export type RealDish = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  restaurantId: number;
};

export type Dish = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  restaurant: MiniRestaurant;
  allergies: Allergy[];
  ingredients: Ingredient[];
};

export type MiniDish = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  restaurant: string;
  restaurantId: number;
  allergies: string[];
  ingredients: string[];
};

export type UpdateDish = {
  id: number;
  name: string;
  price: number;
  restaurantId: number;
  image?: string;
  description: string;
  allergyIds: number[];
  ingredientIds: number[];
};
