import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrismData } from '../login/login_interfaces.ts/prismData';
import prismDetailsTemplate from '../login/templates/prismDetails.template';
import { ChangePasswordService } from './change-password.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

  public prismDetails: PrismData;

  public userId: string | null

  public subscription: Subscription

  public changePasswordSubscription: Subscription

    constructor(
    private changePasswordService: ChangePasswordService,
    private activeRoute: ActivatedRoute,
    ) {
  }

  ngOnDestroy():void {
    this.changePasswordSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.prismDetails = { ...prismDetailsTemplate }
  }

  onSubmitHandler(resetPasswordForm: NgForm): void {
    if (resetPasswordForm.invalid) {
      return
    }
    
    this.userId = this.activeRoute.snapshot.paramMap.get('userId');
    this.changePasswordSubscription = this.changePasswordService.changePassword(this.prismDetails, this.userId)
  }
}
