// UI\src\app\components\auth_component\change-password\change-password.service.ts
import { Injectable } from "@angular/core";
import { AuthService } from "../../../app.service";
import { HttpClient } from "@angular/common/http";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ChangePasswordService extends AuthService {
  private changePasswordEndpoint: string = "http://localhost:8080/auth/change-password";

  constructor(http: HttpClient, private authService: AuthService) {
    super(http);
  }

  public changePassword(prismDetails: PrismData, userId: string | null): Subscription {
    return this.authService.handlerChangePassword({ ...prismDetails }, `${this.changePasswordEndpoint}/${userId}`).subscribe();
  }
}
