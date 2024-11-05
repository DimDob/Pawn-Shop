import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, EMPTY, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../../app.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token check for authentication endpoints
    if (request.url.includes("/auth/login") ||
        request.url.includes("/auth/register") ||
        request.url.includes("/data/expose/")) {
      console.log("AuthInterceptor: Skipping token check for auth request");
      return next.handle(request);
    }

    const token = this.authService.getToken();
    console.log("AuthInterceptor: Current token:", token);

    if (token) {
      request = request.clone({
        setHeaders: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      console.log("AuthInterceptor: Request headers:", request.headers.keys());
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.log("AuthInterceptor: 403 error, logging out");
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
