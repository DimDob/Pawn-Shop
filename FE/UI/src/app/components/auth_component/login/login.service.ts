import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  private apiUrl: string = 'http://localhost:8080/users';

  // TODO When sending the data from the input form BE has to check whether an user is administartor or not and return to FE


}
