// UI\src\app\components\auth_component\auth\auth.component.ts
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AuthComponent {
  constructor(private router: Router) {}
}
