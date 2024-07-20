import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../app.service';
import { PrismData } from '../login/login_interfaces.ts/prismData';
import prismDetailsTemplate from '../login/templates/prismDetails.template';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  private endpoint: string = 'http://localhost:8080/auth/change-password';

  public prismDetails: PrismData;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.prismDetails = { ...prismDetailsTemplate }
  }

  onSubmitHandler(resetPasswordForm: NgForm) {
    if (resetPasswordForm.invalid) {
      return
    }
    
    this.authService.handlerChangePassword(this.prismDetails, this.endpoint);
  }
}
