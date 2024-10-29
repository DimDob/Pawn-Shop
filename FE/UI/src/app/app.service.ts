// UI\src\app\app.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { PrismData } from "./components/auth_component/login/login_interfaces.ts/prismData";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { User } from "./components/auth_component/login/login_interfaces.ts/User";
import { AuthResponse } from "./components/auth_component/login/login_interfaces.ts/AuthResponse";
import { tap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private tokenKey = "auth_token";
  currentUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = { id: 1, loginUsername: "" };
  }

  handleUserLoging(credentials: { email: string, password: string }, endpoint: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<AuthResponse>(endpoint, credentials, { headers }).pipe(
      tap(response => {
        console.log('Пълен отговор от сървъра:', response);
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          console.log('Токенът е запазен:', response.token);
        }
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.currentUser = {
            loginUsername: response.username,
            isAdmin: response.isAdmin
          };
          console.log("Токенът е запазен в localStorage");
        } else {
          console.error("Не е получен токен от сървъра");
        }
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Пълна грешка:', error);

    let errorMessage = 'Възникна грешка при заявката';

    if (error.status === 0) {
      errorMessage = 'Няма връзка със сървъра. Моля, проверете дали back-end сървърът работи.';
    } else if (error.status === 403) {
      errorMessage = 'Грешни credentials или CORS проблем';
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser = { loginUsername: "" };
  }
}
