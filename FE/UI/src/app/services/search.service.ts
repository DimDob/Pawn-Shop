// UI\src\app\services\search.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SearchService {
  // Поведение за текущия търсен термин
  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();

  // Поведение за текущата избрана категория
  private selectedCategorySubject = new BehaviorSubject<string>("");
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  // Поведение за текущата избрана опция за сортиране
  private sortOptionSubject = new BehaviorSubject<string>("");
  sortOption$ = this.sortOptionSubject.asObservable();

  // Метод за задаване на търсен термин
  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  // Метод за задаване на избрана категория
  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  // Метод за задаване на избрана опция за сортиране
  setSortOption(option: string) {
    this.sortOptionSubject.next(option);
  }
}
