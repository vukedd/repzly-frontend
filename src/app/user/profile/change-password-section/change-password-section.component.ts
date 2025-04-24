import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../user.service';
import { JwtService } from '../../../auth/jwt/jwt.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-change-password-section',
  imports: [FieldsetModule, ButtonModule, PasswordModule,ReactiveFormsModule, ToastModule, TooltipModule],
  providers:  [MessageService],
  templateUrl: './change-password-section.component.html',
  styleUrl: './change-password-section.component.css'
})
export class ChangePasswordSectionComponent {
  @Output() successfullPasswordChange = new EventEmitter<string>();
  emitPasswordChangedEvent(message: string) {
    this.successfullPasswordChange.emit(message);
  }

  @Output() errorOccurred = new EventEmitter<string>();
  emitPasswordChangeError(errorMessage: string) {
    this.errorOccurred.emit(errorMessage);
  }

  constructor(private messageService: MessageService, private userService: UserService, private jwtService: JwtService) {}

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('',  [Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"), Validators.required]),
    newPassword: new FormControl('',  [Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"), Validators.required]),
    confirmNewPassword: new FormControl('',  [Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"), Validators.required])
  })


  sendPasswordChangingRequest() {
    if (this.changePasswordForm.value.newPassword !== this.changePasswordForm.value.confirmNewPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "New password and confirmation password do not match."});

    } else{
      this.userService.changeUserPassword(this.jwtService.getRefreshToken()
      , this.changePasswordForm.value.oldPassword
      , this.changePasswordForm.value.newPassword).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message});
          this.changePasswordForm.reset();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message});
        }
      })
    }
  }
}
