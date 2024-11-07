// UI\src\app\components\main_page_component\main-page\enums\Category.ts
export enum Category {
  ELECTRONICS = "Electronics",
  CLOTHING = "Clothing",
  JEWELRY = "Jewelry",
  ART = "Art",
  OTHER = "Other"
}

// Add helper function to get all categories
export function getAllCategories(): string[] {
  return Object.values(Category);
}
