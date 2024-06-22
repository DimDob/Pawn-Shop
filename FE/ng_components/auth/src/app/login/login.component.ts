import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PrismData } from './login_interfaces.ts/prismData';
import prismDetailsTemplate from './templates/prismDetails.template';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnInit {
  public prismDetails: PrismData

  prism: HTMLElement; 

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.prism = this.elementRef.nativeElement.querySelector(".rec-prism"); 
  }

  ngOnInit(): void {
  this.prismDetails = prismDetailsTemplate
  }

  showSignup(): void {
    if (this.prism) {
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
      this.prism.style.transform = "translateZ(-100px) rotateY(-180deg)";
    }
  }

  showSubscribe(): void {
    if (this.prism) {
      this.prism.style.transform = "translateZ(-100px) rotateX(-90deg)";
    }
  }

  showContactUs(): void {
    if (this.prism) {
      this.prism.style.transform = "translateZ(-100px) rotateY(90deg)";
    }
  }

  showThankYou(): void {
    if (this.prism) {
      this.prism.style.transform = "translateZ(-100px) rotateX(90deg)";
    }
  }

}
