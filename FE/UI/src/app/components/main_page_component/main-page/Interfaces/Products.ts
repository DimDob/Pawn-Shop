// UI\src\app\components\main_page_component\main-page\Interfaces\Products.ts
export interface Products {
  id: number; // Добавено ID
  picture: string;
  color: string;
  size: number;
  sex: "male" | "female";
  manufacturer: string;
  model: string;
  name: string; // Добавено име
  category: string;
  price: number; // Добавена цена
}
