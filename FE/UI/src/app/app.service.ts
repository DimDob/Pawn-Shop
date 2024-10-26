// UI\src\app\app.service.ts
import { HttpClient } from "@angular/common/http";
import { PrismData } from "./components/auth_component/login/login_interfaces.ts/prismData";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "./components/auth_component/login/login_interfaces.ts/User";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  currentUser: User;
  constructor(private http: HttpClient) {
    this.currentUser = { id: 1, loginUsername: "testUser" };
  }

  handleUserLoging(userCredentials: PrismData, endpoint: string): Observable<PrismData> {
    return this.http.post<PrismData>(endpoint, {
      ...userCredentials
    });
  }

  handlerUserRegister(userCredentials: PrismData, endpoint: string): Observable<PrismData> {
    return this.http.post<PrismData>(endpoint, {
      ...userCredentials
    });
  }

  handlerChangePassword(userCredentials: PrismData, endpoint: string): Observable<PrismData> {
    return this.http.post<PrismData>(endpoint, {
      ...userCredentials
    });
  }
  verifyPassword(currentPassword: string): Observable<boolean> {
    // Simulate checking the password
    return of(currentPassword === "correct_password"); // Replace with actual password verification logic
  }
}
