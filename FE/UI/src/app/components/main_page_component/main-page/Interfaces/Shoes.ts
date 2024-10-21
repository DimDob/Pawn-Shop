// UI\src\app\components\main_page_component\main-page\Interfaces\Shoes.ts
export interface Shoes {
  id: number; // Добавено ID
  picture: string;
  color: string;
  size: number;
  sex: "male" | "female";
  manufacturer: string;
  model: string;
  category: string;
  price: number; // Добавена цена
}
