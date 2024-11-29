// UI/src/app/shared/services/error-handler.service.ts

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handleError(error: HttpErrorResponse) {
    if (error.status === 500) {
      this.router.navigate(["/server-error"]);
      alert("Internal Server Error occurred");
      return throwError(() => "Internal Server Error");
    }

    if (error.status === 0) {
      this.router.navigate(["/server-error"]);
      alert("Backend service is not available");
      return throwError(() => "Backend is not available");
    }

    return throwError(() => error);
  }
}
