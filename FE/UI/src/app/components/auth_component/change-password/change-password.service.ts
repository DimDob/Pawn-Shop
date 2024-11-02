// UI\src\app\components\auth_component\change-password\change-password.service.ts
import { Injectable } from "@angular/core";
import { AuthService } from "../../../app.service";
import { HttpClient } from "@angular/common/http";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import { Subscription } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "../../../shared/services/error-handler.service";

@Injectable({
  providedIn: "root"
})
export class ChangePasswordService extends AuthService {
  private host = environment.host;
  private changePasswordEndpoint: string = `${this.host}/auth/change-password`;

  constructor(http: HttpClient, router: Router, private errorHandlerService: ErrorHandlerService, private authService: AuthService) {
    super(http, router, errorHandlerService);
  }

  public changePassword(prismDetails: PrismData, userId: string | null): Subscription {
    return this.authService.handlerChangePassword({ ...prismDetails }, `${this.changePasswordEndpoint}/${userId}`).subscribe({
      next: () => {
        alert("Password changed successfully");
      },
      error: error => {
        alert("Failed to change password");
      }
    });
  }
}
