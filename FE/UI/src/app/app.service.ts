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
  private isAuthenticating = signal<boolean>(false);
  public isAuthenticated = computed(() => !!this.getToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  public handleUserLoging(credentials: { email: string; password: string }, endpoint: string): Observable<AuthResponse> {
    if (this.isAuthenticating()) {
      return EMPTY;
    }

    this.isAuthenticating.set(true);

    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => {
        this.isAuthenticating.set(false);
      })
    );
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    });
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
