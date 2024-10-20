// UI\src\app\app.service.ts
import { HttpClient } from "@angular/common/http";
import { PrismData } from "./components/auth_component/login/login_interfaces.ts/prismData";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

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
}
