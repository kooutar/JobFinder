import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';
import { SharedModule } from '../../../shared/shared/shared-module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  private userId: string | number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', [Validators.minLength(8)]),
      confirmPassword: new FormControl(''),
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userId = user.id;
    this.profileForm.patchValue({
      name: user.name ?? '',
      email: user.email ?? '',
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['email']) return 'Adresse email invalide';
    return 'Valeur invalide';
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const newPassword = this.profileForm.get('newPassword')?.value;
    const confirmPassword = this.profileForm.get('confirmPassword')?.value;
    if (newPassword && newPassword !== confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!this.profileForm.valid) {
      this.errorMessage.set('Veuillez corriger les champs.');
      return;
    }

    if (!this.userId) return;

    this.isLoading.set(true);
    const payload: { name?: string; email?: string; password?: string } = {
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value,
    };
    if (newPassword) payload.password = newPassword;

    this.authService.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Profil mis à jour.');
        this.profileForm.patchValue({ newPassword: '', confirmPassword: '' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Erreur lors de la mise à jour.'
        );
      },
    });
  }
}
