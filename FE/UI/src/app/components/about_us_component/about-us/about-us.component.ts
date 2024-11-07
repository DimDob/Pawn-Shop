// UI\src\app\components\about_us_component\about-us\about-us.component.ts
import { Component } from "@angular/core";
import { 
  faStore, 
  faHandshake, 
  faGem, 
  faTag 
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.scss"]
})
export class AboutUsComponent {
  faStore = faStore;
  faHandshake = faHandshake;
  faGem = faGem;
  faTag = faTag;
}
