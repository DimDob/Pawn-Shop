import { HttpClient } from "@angular/common/http";
import { PrismData } from "./components/auth_component/login/login_interfaces.ts/prismData";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) { }

  handleUserLoging(userCredentials: PrismData, endpoint: string) {

    return this.http.post<PrismData>(endpoint, {
      ...userCredentials
    })
  }

}
