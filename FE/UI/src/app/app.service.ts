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
import { environment } from "../environments/environment";
interface AccountUpdateData {
  currentPassword: string;
  newUsername?: string;
  newEmail?: string;
  newShopAddress?: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly tokenKey = "auth_token";
  private isAuthenticating = signal(false);
  private currentUserData = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router, private errorHandler: ErrorHandlerService) {}

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    console.log("AuthService: Creating headers with token");
    return new HttpHeaders({
      Authorization: `Bearer ${token || ""}`,
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
    console.log("AuthService: Logging out user");
    const currentToken = this.getToken();

    if (currentToken) {
      this.http
        .post(`${environment.host}/auth/logout`, {
          refreshToken: currentToken
        })
        .pipe(
          finalize(() => {
            this.clearAuthData();
            this.router.navigate(["/auth/login"]);
          })
        )
        .subscribe({
          next: () => console.log("AuthService: Logout successful"),
          error: error => console.error("AuthService: Logout error", error)
        });
    } else {
      this.clearAuthData();
      this.router.navigate(["/auth/login"]);
    }
  }

  private clearAuthData(): void {
    console.log("AuthService: Clearing auth data");
    localStorage.removeItem(this.tokenKey);
    this.currentUserData.set(null);
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

  public getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      console.log("AuthService: Token data:", tokenData);

      const user: User = {
        id: tokenData.userId, // Token-a
        loginUsername: tokenData.sub, // email от subject
        isAdmin: tokenData.isAdmin, // Token-a
        isEmployee: false
      };

      console.log("AuthService: Current user:", user);
      return user;
    } catch (error) {
      console.error("AuthService: Error parsing user data from token:", error);
      return null;
    }
  }

  updateUserAccount(data: AccountUpdateData): Observable<any> {
    console.log("AuthService: Updating user account", data);
    return this.http
      .put(`${environment.host}/my-account/update`, data, {
        headers: this.getAuthHeaders(),
        responseType: "text"
      })
      .pipe(
        tap(response => {
          console.log("AuthService: Account updated successfully", response);
        }),
        catchError(error => {
          if (error.status === 200) {
            console.log("AuthService: Account updated successfully (with empty response)");
            return of("Success");
          }
          console.error("AuthService: Error updating account", error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    console.log("AuthService: Attempting to refresh token");
    const currentToken = this.getToken();

    if (!currentToken) {
      console.log("AuthService: No token to refresh");
      return throwError(() => new Error("No token available"));
    }

    return this.http
      .post<AuthResponse>(`${environment.host}/auth/refresh-token`, {
        refreshToken: currentToken
      })
      .pipe(
        tap(response => {
          console.log("AuthService: Token refreshed successfully");
          localStorage.setItem(this.tokenKey, response.token);
        }),
        catchError(error => {
          console.error("AuthService: Token refresh failed", error);
          this.logout();
          return throwError(() => error);
        })
      );
  }
}
