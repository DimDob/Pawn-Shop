import { Injectable } from '@angular/core';
import { UserCredentials } from './login_interfaces.ts/user_credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  private apiUrl: string = 'http://localhost:8080/users';

  public emptyUserCredentials:UserCredentials = {
    username: "",
    password: ""
  }
}
