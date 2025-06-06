// register-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// *** Make sure AbstractControl is imported if you use getters ***
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RegisterService } from '../register-service/register.service';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule, // Needed for *ngIf
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    TooltipModule,
    MessageModule
  ],
  templateUrl: 'register-form.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {

  registerForm = new FormGroup({
    // Using more specific error keys for patterns where possible
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,20}$")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,20}$")]),
    email: new FormControl('', [Validators.required, Validators.email]), // Use email validator
    username: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{5,15}$")]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")])
  });

  // State for the top-level inline message (API errors, general validation fail)
  showMessage: boolean = false;
  messageSeverity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' = 'error';
  messageText: string = '';

  submitted: boolean = false; // Flag to track if submit was attempted
  isSubmitting: boolean = false;

  constructor(
    private registerService: RegisterService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  // Getters for easier access in the template
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }


  ngOnInit() {
    // Hide messages when user starts typing again
    this.registerForm.valueChanges.subscribe(() => {
      if (this.showMessage || this.submitted) {
        this.hideMessages(); // Clear general message and submitted flag
      }
    });
  }

  hideMessages() {
    this.showMessage = false;
    this.submitted = false; // Allow new validation attempt
  }

  changeToLoginMode() {
    this.ref.close({ modeChangedTo: 'login' });
  }

  onMessageClose() {
    this.showMessage = false; // Allow closing the top message
  }

  // Helper to get specific error message based on control and error type
  getErrorMessage(control: AbstractControl | null, controlName: string): string {
    if (!control || !control.errors || !this.submitted) {
      return ''; // No error or not submitted yet
    }

    if (control.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required.`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid e-mail address.';
    }
    if (control.hasError('pattern')) {
      // Provide specific messages based on the control/pattern
      switch (controlName) {
        case 'firstName':
        case 'lastName':
          return 'Name must contain only letters, hyphens, apostrophes (2-20 chars).';
        case 'username':
          return 'Username must contain letters/numbers (5-15 chars).';
        case 'password':
          return 'Password must have minimum 8 chars, at least one letter and one number.';
        default:
          return 'Invalid format.';
      }
    }
    // Add more specific checks if needed (e.g., minlength, maxlength)
    return 'Invalid value.'; // Generic fallback
  }


  sendRegisterRequest(): void {
    this.submitted = true; // Mark as submitted attempt
    this.showMessage = false; // Hide previous top-level messages

    if (this.registerForm.invalid) {
      // Show general validation failed message at the top
      this.messageSeverity = 'error';
      this.messageText = 'Validation Failed. Please check the fields below.';
      this.showMessage = true;
      // Per-field messages will appear automatically
      return; // Stop processing
    }
    this.isSubmitting=true;

    // --- Form is valid, proceed with API call ---
    this.registerService.registerUser({
      firstName: this.registerForm.value.firstName ?? '',
      lastName: this.registerForm.value.lastName ?? '',
      email: this.registerForm.value.email ?? '',
      username: this.registerForm.value.username ?? '',
      password: this.registerForm.value.password ?? ''
    }).subscribe({
      next: (response) => {
        this.hideMessages(); // Clear messages on success
        this.registerForm.reset();
        this.ref.close({ registerSuccess: response.message });
        this.isSubmitting=false;
      },
      error: (error) => {
        const errorMessage = error.error?.message || "An unknown registration error occurred.";
        // Show API error in the top message
        this.messageSeverity = 'error';
        this.messageText = errorMessage;
        this.showMessage = true;
        this.isSubmitting=false;
        // Keep submitted = true, but API error is now shown
      }
    });
  }
}