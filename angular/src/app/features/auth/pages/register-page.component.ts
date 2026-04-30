import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly systemOnline = signal(true);

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  });

  protected get emailControl() {
    return this.registerForm.controls.email;
  }

  protected get senhaControl() {
    return this.registerForm.controls.senha;
  }

  protected get showEmailFormatError(): boolean {
    return this.emailControl.touched && this.emailControl.hasError('email');
  }

  protected get showPasswordLengthError(): boolean {
    return this.senhaControl.touched && this.senhaControl.hasError('minlength');
  }

  protected submit(): void {
    const raw = this.registerForm.getRawValue();

    if (this.registerForm.invalid || this.isSubmitting()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (raw.senha !== raw.confirmarSenha) {
      this.errorMessage.set('As senhas informadas nao conferem.');
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    this.authService
      .register({
        email: raw.email,
        senha: raw.senha,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set('Cadastro realizado. Redirecionando para login...');
          setTimeout(() => {
            void this.router.navigateByUrl('/login');
          }, 900);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.systemOnline.set(error.status !== 0);
          this.errorMessage.set(
            error.error?.message ??
              (error.status === 0
                ? 'Falha ao conectar com a API operacional.'
                : 'Nao foi possivel cadastrar o usuario.'),
          );
        },
      });
  }

  protected goToLogin(): void {
    void this.router.navigateByUrl('/login');
  }
}
