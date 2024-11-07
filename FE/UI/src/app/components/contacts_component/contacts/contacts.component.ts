// UI\src\app\components\contacts_component\contacts\contacts.component.ts
import { Component } from "@angular/core";
import { 
  faEnvelope,
  faPhone,
  faLocationDot
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"]
})
export class ContactsComponent {
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
}
