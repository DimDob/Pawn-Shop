import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrismData } from './login_interfaces.ts/prismData';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = 'http://localhost:8080/auth';

  // TODO When sending the data from the input form BE has to check whether an user is administartor or not and return to FE
  loginUser(username: string, password: string) {
    return this.http.post<PrismData>(`${this.apiUrl}/login`, { username, password });
  }

}
