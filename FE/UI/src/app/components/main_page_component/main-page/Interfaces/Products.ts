// UI\src\app\components\main_page_component\main-page\Interfaces\Products.ts
import { Category } from "../enums/Category";
export interface Products {
  id: number;
  picture: string;
  color?: string;
  size?: number;
  sex?: "male" | "female";
  manufacturer?: string;
  model?: string;
  name: string;
  category: string;
  price: number;
  ownerId?: number;
}

// export interface Products {
//   id: string;
//   picture: string;
//   color?: string;
//   size?: number;
//   sex?: "male" | "female" | "unisex";
//   manufacturer?: string;
//   model?: string;
//   name: string;
//   category: Category;
//   price: number;
//   quantityInStock?: number;
//   isRunOutOfStock?: boolean;
//   ownerId?: string;
// }
