import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { faCompass, faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"]
})
export class NotFoundComponent {
  faCompass = faCompass;
  faHome = faHome;
  faArrowLeft = faArrowLeft;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateHome() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/pawn-shop/main-page"]);
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }

  goBack() {
    window.history.back();
  }
}
