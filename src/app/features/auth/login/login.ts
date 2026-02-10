import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      remember: new FormControl(false),
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) {
      return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['email']) return 'Invalid email address';
    return 'Invalid input';
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.loginForm.valid) {
      this.errorMessage.set('Please fill all fields correctly');
      return;
    }

    const { email, password, remember } = this.loginForm.value;

    this.isLoading.set(true);

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        // Check if user found
        if (!response || response.length === 0) {
          this.errorMessage.set('Invalid email or password');
          return;
        }

        const user = response[0];

        // Store user and token
        this.authService.setCurrentUser(user);
        if (remember) {
          localStorage.setItem('rememberMe', 'true');
        }

        this.successMessage.set('Login successful! Redirecting...');
        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Login failed. Please try again.'
        );
      },
    });
  }
}
