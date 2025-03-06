import { Component, Output, EventEmitter} from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { LoginService } from '../login-service/login.service';

@Component({
  selector: 'app-login-form',
  imports: [InputTextModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, TooltipModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  @Output() modeChanged = new EventEmitter<boolean>();
  
  changeToRegisterMode(value: boolean) {
    this.modeChanged.emit(value);
  }
  
  loginForm = new FormGroup ({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService) {}

  // sendLoginRequest() {
  //   this.loginService.sendLoginRequest({
  //     username: this.loginForm.value.username ?? '',
  //     password: this.loginForm.value.password ?? ''
  //   }).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  sendLoginRequest() {
    this.loginService.sendLoginRequest({
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? ''
    })
  }
}