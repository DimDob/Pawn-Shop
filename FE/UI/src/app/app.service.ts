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
import { RegisterData } from "./components/auth_component/register/interfaces/RegisterData";

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
  private readonly refreshTokenKey = "refresh_token";
  private readonly host = "http://localhost:8080";

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
    // this.currentUserData.set(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  private setTokens(response: AuthResponse): void {
    console.log("AuthService: Setting tokens");
    localStorage.setItem(this.tokenKey, response.token);

    if (response.rememberMe) {
      console.log("AuthService: Storing refresh token for remember me");
      localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    }
  }

  handleUserLoging(credentials: any, endpoint: string): Observable<AuthResponse> {
    console.log("AuthService: Attempting login");
    return this.http.post<AuthResponse>(`${this.host}/api/auth/login`, credentials).pipe(
      tap(response => {
        console.log("AuthService: Login successful");
        this.setTokens(response);
      }),
      catchError(error => {
        console.error("AuthService: Login failed", error);
        return throwError(() => error);
      })
    );
  }

  handlerUserRegister(registerData: RegisterData, endpoint: string): Observable<any> {
    console.log("AuthService: Attempting registration", registerData);

    return this.http
      .post(endpoint, registerData, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        responseType: "text"
      })
      .pipe(
        tap(response => {
          console.log("AuthService: Registration successful", response);
        }),
        catchError(error => {
          console.error("AuthService: Registration failed", error);
          return throwError(() => error);
        })
      );
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
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!refreshToken) {
      console.log("AuthService: No refresh token available");
      return throwError(() => new Error("No refresh token available"));
    }

    return this.http
      .post<AuthResponse>(`${environment.host}/api/auth/refresh-token`, {
        refreshToken: refreshToken
      })
      .pipe(
        tap(response => {
          console.log("AuthService: Token refreshed successfully");
          this.setTokens(response);
        }),
        catchError(error => {
          console.error("AuthService: Token refresh failed", error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  confirmEmail(token: string): Observable<any> {
    console.log("AuthService: Confirming email with token", token);
    return this.http.post(`${environment.host}/api/auth/confirm-email?token=${token}`, {}, { responseType: "text" }).pipe(
      tap(response => {
        console.log("AuthService: Email confirmed successfully", response);
      }),
      catchError(error => {
        console.error("AuthService: Email confirmation failed", error);
        if (error.status === 200) {
          return of(error.error.text);
        }
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    console.log("AuthService: Requesting password reset for email", email);
    return this.http.post(`${environment.host}/api/auth/forgot-password`, { email }, { responseType: "text" }).pipe(
      tap(response => console.log("AuthService: Password reset email sent")),
      catchError(error => {
        console.error("AuthService: Error requesting password reset", error);
        return throwError(() => error);
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    console.log("AuthService: Resetting password with token");
    return this.http.post(`${environment.host}/api/auth/reset-password`, { token, newPassword }, { responseType: "text" }).pipe(
      tap(response => console.log("AuthService: Password reset successful")),
      catchError(error => {
        console.error("AuthService: Error resetting password", error);
        return throwError(() => error);
      })
    );
  }

  handleGoogleLogin(token: string): Observable<any> {
    console.log("AuthService: Sending Google login request");
    return this.http.post(`${this.host}/api/auth/google/login`, { token });
  }

  handleGoogleRegister(token: string): Observable<any> {
    console.log("AuthService: Sending Google register request");
    return this.http.post(`${this.host}/api/auth/google/register`, { token });
  }
}
