import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LoginComponent } from './components/auth_component/login/login.component';
import { User } from './components/auth_component/login/login_interfaces.ts/User';
import { PrismData } from './components/auth_component/login/login_interfaces.ts/prismData';
import { LoginService } from './components/auth_component/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  @ViewChild(LoginComponent) loginComponent: LoginComponent;

  @ViewChild('navButtons') navButtonsContainer: ElementRef;

  public isEverythingInitialized: boolean;

  constructor(private loginService: LoginService) { }

  ngAfterViewInit() {
    this.isEverythingInitialized = true;
  }

  get isForgotPassword() {
    return this.loginComponent.prismDetails.forgotPassword
  }

  public user: User;

  public prismDetails: PrismData;

  showLogin() {
    this.loginComponent.showLogin();
  }
  showForgotPassword() {
    this.loginComponent.showForgotPassword();
  }
  showCreateEmployeeAccount() {
    this.loginComponent.showCreateEmployeeAccount();
  }

  showSignup() {
    this.loginComponent.showSignup();
  }
  handleUserCheck(user: User) {
    this.user = user;
  }

  handleUserLoging(userCredentials: PrismData) {
    this.prismDetails = userCredentials;

    const { loginUsername, loginPassword } = this.prismDetails
    this.loginService.loginUser(loginUsername, loginPassword);
  }
}
