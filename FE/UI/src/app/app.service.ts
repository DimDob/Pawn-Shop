// UI\src\app\app.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { PrismData } from "./components/auth_component/login/login_interfaces.ts/prismData";
import { Injectable } from "@angular/core";
import { Observable, of, throwError, EMPTY, finalize } from "rxjs";
import { User } from "./components/auth_component/login/login_interfaces.ts/User";
import { AuthResponse } from "./components/auth_component/login/login_interfaces.ts/AuthResponse";
import { tap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private tokenKey = "auth_token";
  private isAuthenticating = false;

  constructor(private http: HttpClient) {}

  handleUserLoging(credentials: { email: string; password: string }, endpoint: string): Observable<AuthResponse> {
    if (this.isAuthenticating) {
      console.log("AuthService: Login already in progress");
      return EMPTY;
    }

    this.isAuthenticating = true;
    console.log("AuthService: Starting login process");

    return this.http.post<AuthResponse>(endpoint, credentials).pipe(
      tap(response => {
        console.log("AuthService: Login successful");
        if (response?.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError(error => {
        console.error("AuthService: Login error", error);
        return throwError(() => error);
      }),
      finalize(() => {
        console.log("AuthService: Login process completed");
        this.isAuthenticating = false;
      })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    console.log("AuthService: Checking login status:", !!token);
    return !!token;
  }

  logout(): void {
    console.log("AuthService: Logging out");
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Пълна грешка:", error);

    let errorMessage = "Възникна грешка при заявката";

    if (error.status === 0) {
      errorMessage = "Няма връзка със сървъра. Мо��я, проверете дали back-end сървърът работи.";
    } else if (error.status === 403) {
      errorMessage = "Грешни credentials или CORS проблем";
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Клиентска грешка: ${error.error.message}`;
    } else {
      errorMessage = `Сървърна грешка: ${error.status}. Съобщение: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
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
    return of(currentPassword === "correct_password");
  }

  getCurrentUser(): User {
    // Get the token
    const token = this.getToken();
    if (!token) {
      return {
        id: 0,
        loginUsername: "",
        isAdmin: false,
        isEmployee: false
      };
    }

    // Decode the JWT token
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: tokenPayload.id,
        loginUsername: tokenPayload.username,
        isAdmin: tokenPayload.isAdmin,
        isEmployee: tokenPayload.isEmployee
      };
    } catch (error) {
      console.error("Error decoding the token:", error);
      return {
        id: 0,
        loginUsername: "",
        isAdmin: false,
        isEmployee: false
      };
    }
  }
}
