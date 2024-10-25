// UI\src\app\components\main_page_component\main-page\Interfaces\Products.ts
export interface Products {
  id: number;
  picture: string;
  color: string;
  size: number;
  sex: "male" | "female";
  manufacturer: string;
  model: string;
  name: string;
  category: string;
  price: number;
}
