import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../data/user-profile.service';
import { UserProfile } from '../../../shared/models/user-profile.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  userId = 'user-123'; // Mock: normalmente viria do contexto de autenticação

  profile$!: any;
  error$!: any;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService
  ) {
    this.profile$ = this.userProfileService.profile$;
    this.error$ = this.userProfileService.error$;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Inicializa o formulário reativo
   */
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', Validators.maxLength(500)],
      foto: ['', Validators.required]
    });
  }

  /**
   * Carrega o perfil do usuário
   */
  loadProfile(): void {
    this.isLoading = true;
    this.userProfileService.getProfile(this.userId).subscribe({
      next: (response) => {
        if (response.data) {
          this.profileForm.patchValue(response.data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Salva as alterações do perfil
   */
  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.userProfileService.clearError();

    this.userProfileService.updateProfile(
      this.userId,
      this.profileForm.value
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message || 'Perfil atualizado com sucesso!';
          // Limpar mensagem após 3 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Erro ao salvar perfil:', error);
        this.isSaving = false;
      }
    });
  }

  /**
   * Reseta o formulário aos valores originais
   */
  resetForm(): void {
    const currentProfile = this.userProfileService.getCurrentProfile();
    if (currentProfile) {
      this.profileForm.reset(currentProfile);
    }
  }

  /**
   * Verifica se um campo tem erro
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }
}
