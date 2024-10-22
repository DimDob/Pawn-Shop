// UI\src\app\components\footer_component\footer\footer.component.ts
import { Component } from "@angular/core";
import { faPhone, faEnvelope, faInfoCircle, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { SearchService } from "../../../services/search.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent {
  // FontAwesome икони
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faInfoCircle = faInfoCircle;
  faMapMarkerAlt = faMapMarkerAlt;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faLinkedin = faLinkedin;

  // Класове за иконите
  iconColors = "text-white";

  constructor(private searchService: SearchService) {}

  // Функция за сортиране
  sortBy(sortOption: string) {
    this.searchService.setSortOption(sortOption);
  }

  // Функция за филтриране по категория
  filterByCategory(category: string) {
    this.searchService.setSelectedCategory(category);
  }

  // Логика за класовете на футъра
  get footerClasses() {
    return {
      "footer-visible": true // Може да добавите логика, ако е необходимо
    };
  }
}
