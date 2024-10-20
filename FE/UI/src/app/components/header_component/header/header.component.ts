// UI\src\app\components\header_component\header\header.component.ts

import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  // Категории за падащото меню
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Collectables", "Art"];

  // Събитие за филтриране по категория
  @Output() categorySelected = new EventEmitter<string>();

  // Изпраща избраната категория към родителския компонент
  onCategoryChange(category: string) {
    this.categorySelected.emit(category);
  }
}
