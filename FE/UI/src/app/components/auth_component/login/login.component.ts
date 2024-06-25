import { Component, ElementRef, AfterViewInit, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PrismData } from './login_interfaces.ts/prismData';
import prismDetailsTemplate from './templates/prismDetails.template';
import { User } from './login_interfaces.ts/User';
import userTemplate from './templates/user.template';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnInit {


  @Output() userCheck: EventEmitter<User> = new EventEmitter<User>()

  @Output() userCredentials: EventEmitter<PrismData> = new EventEmitter<PrismData>()

  public prismDetails: PrismData

  public user: User;

  prism: HTMLElement;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.prism = this.elementRef.nativeElement.querySelector(".rec-prism");
  }

  ngOnInit(): void {
  this.prismDetails = {...prismDetailsTemplate}
  this.user = {...userTemplate}
  }

  userLoging() {
    this.userCredentials.emit(this.prismDetails)
  }

  onUserCheck() {
    this.userCheck.emit(this.user)
  }

  checkIfUserIsAdmin() {
    if (this.prismDetails.administratorEmail === 'admin') { //Here it will be replaced with actual email, which we will check in the DB
      this.user.isAdmin = true

    }  else {
      this.user.isAdmin = false

    }
  }
  showSignup(): void {
    if (this.prism) {
      // This better be done in ngOnChanges()
      this.prismDetails.forgotPassword = false
      this.prism.style.transform = "translateZ(-100px) rotateY(-90deg)";
    }
  }

  showLogin(): void {
    if (this.prism) {
      this.prism.style.transform = "translateZ(-100px)";

    }
  }

  showForgotPassword(): void {
    if (this.prism) {
      this.prismDetails.forgotPassword = true;
      this.prism.style.transform = "translateZ(-100px) rotateY(-180deg)";
       
    }
  }

  showCreateEmployeeAccount(): void {
    if (this.prism) {
      this.prismDetails.forgotPassword = false
      this.prism.style.transform = "translateZ(-100px) rotateX(-90deg)";


    }
  }

  showContactUs(): void {
    if (this.prism) {
      this.prismDetails.forgotPassword = false
      this.prism.style.transform = "translateZ(-100px) rotateY(90deg)";


    }
  }

  showThankYou(): void {
    if (this.prism) {
      this.prism.style.transform = "translateZ(-100px) rotateX(90deg)";

    }
  }


  clearUserDetails() {
    this.prismDetails = {
      ...prismDetailsTemplate,
    }
  }

}
