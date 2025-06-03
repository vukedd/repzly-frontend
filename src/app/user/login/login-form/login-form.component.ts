// login-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
// *** Make sure AbstractControl is imported if you use getters ***
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { JwtService } from '../../../auth/jwt/jwt.service';
import { Router } from '@angular/router';
import { FocusTrapModule } from 'primeng/focustrap';
import { AutoFocusModule } from 'primeng/autofocus';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule, // Needed for *ngIf
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    TooltipModule,
    FocusTrapModule,
    AutoFocusModule,
    MessageModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  // State for the top-level inline message (API errors, general validation fail)
  showMessage: boolean = false;
  messageSeverity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' = 'error';
  messageText: string = '';
  loading: boolean = false;

  submitted: boolean = false; // Flag to track if submit was attempted

  constructor(
    private jwtService: JwtService,
    private router: Router,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  // Getters for easier access in the template
  get username(): AbstractControl | null { return this.loginForm.get('username'); }
  get password(): AbstractControl | null { return this.loginForm.get('password'); }


  ngOnInit() {
    // Hide messages when user starts typing again
    this.loginForm.valueChanges.subscribe(() => {
      if (this.showMessage || this.submitted) {
        this.hideMessages(); // Clear general message and submitted flag
      }
    });
  }

  hideMessages() {
    this.showMessage = false;
    this.submitted = false; // Allow new validation attempt
  }


  changeToRegisterMode() {
    this.ref.close({ modeChangedTo: 'register' });
  }

  private handleLoginError(statusCode: number) {
    let detail = "An error occurred, please try later!";
    switch (statusCode) {
      case 401:
        detail = "The credentials you have entered are invalid!";
        break;
      case 403:
        detail = "Before you continue, please verify your account!";
        break;
    }
    this.messageSeverity = 'error';
    this.messageText = detail;
    this.showMessage = true;
  }

  onMessageClose() {
    this.showMessage = false; // Allow closing the top message
  }

  sendLoginRequest() {
    this.submitted = true; // Mark as submitted attempt
    this.showMessage = false; // Hide previous top-level messages

    if (this.loginForm.invalid) {
      // Show general validation failed message at the top
      this.messageSeverity = 'error';
      this.messageText = 'Validation Failed. Please check the fields below.';
      this.showMessage = true;
      // Per-field messages will appear automatically due to submitted=true and invalid state
      return; // Stop processing
    }
    this.loading=true;


    // --- Form is valid, proceed with API call ---
    this.jwtService.sendLoginRequest({
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? ''
    }).subscribe({
      next: (response) => {
        this.hideMessages(); // Clear messages on success
        this.jwtService.setTokens({ accessToken: response.token, refreshToken: response.refreshTokenId, username: response.username });
        this.router.navigate(['/dashboard']);
        this.ref.close({ loginSuccess: 200 });
        this.loading=false;
      },
      error: (error) => {
        this.handleLoginError(error.status); // Show API error in the top message
        this.loading=false;
        // Keep submitted = true, but API error is now shown
      }
    });
  }
}