// UI\src\app\app.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { PrismData } from "./components/auth_component/login/login_interfaces.ts/prismData";
import { Injectable, signal, computed } from "@angular/core";
import { Observable, of, throwError, EMPTY } from "rxjs";
import { User } from "./components/auth_component/login/login_interfaces.ts/User";
import { AuthResponse } from "./components/auth_component/login/login_interfaces.ts/AuthResponse";
import { tap, catchError, finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "./shared/services/error-handler.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly tokenKey = "auth_token";
  private isAuthenticating = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    console.log("AuthService: Creating headers with token");
    return new HttpHeaders({
      "Authorization": `Bearer ${token || ""}`,
      "Content-Type": "application/json"
    });
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const expirationDate = new Date(tokenData.exp * 1000);
      const isExpired = expirationDate < new Date();

      if (isExpired) {
        console.log("AuthService: Token is expired");
        this.clearToken();
      }

      return isExpired;
    } catch {
      this.clearToken();
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(["/auth/login"]);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  public handleUserLoging(credentials: { email: string; password: string }, endpoint: string): Observable<AuthResponse> {
    if (this.isAuthenticating()) {
      return EMPTY;
    }

    this.isAuthenticating.set(true);

    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      tap(response => {
        if (response?.token) {
          console.log("AuthService: Saving new token");
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => {
        this.isAuthenticating.set(false);
      })
    );
  }

  public handlerUserRegister(userCredentials: PrismData, endpoint: string): Observable<PrismData> {
    return this.http.post<PrismData>(endpoint, {
      ...userCredentials
    });
  }

  public handlerChangePassword(userCredentials: PrismData, endpoint: string): Observable<PrismData> {
    return this.http.post<PrismData>(endpoint, {
      ...userCredentials
    });
  }

  public verifyPassword(currentPassword: string): Observable<boolean> {
    return of(currentPassword === "correct_password");
  }

  public getCurrentUser(): User {
    const token = this.getToken();

    if (!token) {
      return {
        id: "",
        loginUsername: "",
        isAdmin: false,
        isEmployee: false
      };
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));

      return {
        id: tokenPayload.userId || "2bd8729c-997d-4adb-a19e-9392bc42c7d8",
        loginUsername: tokenPayload.username || tokenPayload.email,
        isAdmin: tokenPayload.isAdmin || false,
        isEmployee: tokenPayload.isEmployee || false
      };
    } catch (error) {
      alert("Error decoding user token");
      return {
        id: "",
        loginUsername: "",
        isAdmin: false,
        isEmployee: false
      };
    }
  }
}
