// UI\src\app\components\main_page_component\main-page\Interfaces\Products.ts
import { Category } from "../enums/Category";

export interface Products {
  id: string;
  picture: string;
  condition?: "new" | "like new" | "used";
  color?: string;
  size?: number;
  sex?: "male" | "female" | "none";
  manufacturer?: string;
  model?: string;
  name: string;
  category: Category;
  price: number;
  quantityInStock?: number;
  isRunOutOfStock?: boolean;
  ownerId?: string;
  pawnPercentage?: number;
  secondHandPrice?: number;
  productTypeId: string;
  createdAt: string;
  description: string;
}
