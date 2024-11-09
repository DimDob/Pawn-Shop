import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"]
})
export class NotFoundComponent {
  faHome = faHome;
  faSearch = faSearch;

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
}
