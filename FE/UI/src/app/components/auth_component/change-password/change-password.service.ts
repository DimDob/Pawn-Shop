// UI\src\app\components\auth_component\change-password\change-password.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "../../../../environments/environment.prod";
import { NotificationService } from "../../../shared/services/notification.service";

@Injectable({
  providedIn: "root"
})
export class ChangePasswordService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Observable<any> {
    console.log("ChangePasswordService: Changing password");

    return this.http.put(
      `${environment.host}/my-account/change-password`,
      passwordData,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`
        }),
        responseType: "text"
      }
    ).pipe(
      tap(response => {
        console.log("ChangePasswordService: Password changed successfully");
      }),
      catchError(error => {
        if (error.status === 200) {
          console.log("ChangePasswordService: Password changed successfully (with parsing error)");
          return of("Success");
        }
        console.error("ChangePasswordService: Error changing password", error);
        return throwError(() => error);
      })
    );
  }
}
