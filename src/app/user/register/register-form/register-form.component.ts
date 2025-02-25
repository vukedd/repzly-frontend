import { Component} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterModule} from '@angular/router';
import { RegisterService } from '../register-service/register.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, RouterModule, TooltipModule],
  templateUrl: 'register-form.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,20}$")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,20}$")]),
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{5,15}$")]),
    password: new FormControl('',
      [Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"), Validators.required]
    )
    //Minimum eight characters, at least one letter and one number

  });

  constructor(private registerService: RegisterService) {}

  sendRegisterRequest(): void {
    this.registerService.registerUser({
      firstName: this.registerForm.value.firstName ?? '',
      lastName: this.registerForm.value.lastName ?? '',
      email: this.registerForm.value.email ?? '',
      username: this.registerForm.value.username ?? '',
      password: this.registerForm.value.password ?? ''
    }).subscribe(response => {
      console.log(response);
    });
  }
}
