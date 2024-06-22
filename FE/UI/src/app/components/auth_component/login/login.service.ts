import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  private apiUrl: string = 'http://localhost:8080/users';

}
