// UI\src\app\app.component.ts

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}
}
