// UI\src\app\components\footer_component\footer\footer.component.ts
import { Component, OnInit } from "@angular/core";
import { faPhone, faEnvelope, faInfoCircle, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { SearchService } from "../../../shared/services/search.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  // FontAwesome icons
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faInfoCircle = faInfoCircle;
  faMapMarkerAlt = faMapMarkerAlt;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faLinkedin = faLinkedin;

  // Classes for icons
  iconColors = "text-white";

  footerClasses: { [key: string]: boolean } = {};

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.footerClasses = {
      "footer-visible": true
    };
  }

  // Function for sorting
  sortBy(sortOption: string) {
    this.searchService.setSortOption(sortOption);
  }

  // Function for filtering by category
  filterByCategory(category: string) {
    this.searchService.setSelectedCategory(category);
  }
}
