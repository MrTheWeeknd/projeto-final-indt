import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { UserProfile, ProfileResponse } from '../../../shared/models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:3000/profile';
  
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Busca o perfil do usuário pelo ID
   */
  getProfile(userId: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${userId}`)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.profileSubject.next(response.data);
            this.errorSubject.next(null);
          }
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || 'Erro ao carregar o perfil';
          this.errorSubject.next(errorMessage);
          throw error;
        })
      );
  }

  /**
   * Atualiza o perfil do usuário
   */
  updateProfile(userId: string, profileData: Partial<UserProfile>): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/${userId}`, profileData)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.profileSubject.next(response.data);
            this.errorSubject.next(null);
          }
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || 'Erro ao atualizar o perfil';
          this.errorSubject.next(errorMessage);
          throw error;
        })
      );
  }

  /**
   * Retorna o perfil atual armazenado no estado
   */
  getCurrentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }

  /**
   * Limpa o erro
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
