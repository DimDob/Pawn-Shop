// UI\src\app\shared-services\search.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SearchService {
  // Behavior subject for the current search term
  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();

  // Behavior subject for the current selected category
  private selectedCategorySubject = new BehaviorSubject<string>("");
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  // Behavior subject for the current selected sort option
  private sortOptionSubject = new BehaviorSubject<string>("");
  sortOption$ = this.sortOptionSubject.asObservable();

  // Method to set the search term
  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  // Method to set the selected category
  setSelectedCategory(category: string) {
    console.log("SearchService: Setting category to:", category);
    this.selectedCategorySubject.next(category);
  }

  // Method to set the selected sort option
  setSortOption(option: string) {
    this.sortOptionSubject.next(option);
  }

  // Add method to get current category
  getCurrentCategory(): string {
    return this.selectedCategorySubject.getValue();
  }

  // Add method to get current search term
  getCurrentSearchTerm(): string {
    return this.searchTermSubject.getValue();
  }
}
