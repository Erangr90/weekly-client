export type CreateDish = {
  name: string;
  price: number;
  restaurantId: number;
  image?: string;
  description: string;
  allergyIds: number[];
  ingredientIds: number[];
};
