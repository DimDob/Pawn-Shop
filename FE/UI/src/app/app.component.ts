import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoginComponent } from './components/auth_component/login/login.component';
import { User } from './components/auth_component/login/login_interfaces.ts/User';
import { PrismData } from './components/auth_component/login/login_interfaces.ts/prismData';
import { AuthService } from './app.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
})
export class AppComponent implements OnInit {

  @ViewChild(LoginComponent) loginComponent: LoginComponent;

  @ViewChild('navButtons') navButtonsContainer: ElementRef;

  public currentRoute: string;

  public user: User;

  public prismDetails: PrismData;

  private host = 'http://localhost:8080/'; // Change when we get a host

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    // Register an event when the user redirects to another page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

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
    const loginEndpoint = '/auth/login';
    this.prismDetails = userCredentials;
  
    this.authService.handleUserLoging(userCredentials, `${this.host}${loginEndpoint}`).subscribe({
      next: () => {
        // Routing will work when BE is started & running
        this.router.navigate(['/pawn-shop/main-page']);
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }
}
  