import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

export type AuthSession = {
  token: string;
  expiresIn: string;
  usuario: {
    id: number;
    email: string;
    role: 'admin' | 'user';
    permissoes?: {
      dashboard: boolean;
      insumos: boolean;
      categorias: boolean;
      movimentacoes: boolean;
    };
  };
};


type LoginPayload = {
  email: string;
  senha: string;
};

type RegisterPayload = {
  email: string;
  senha: string;
};

type RegisteredUser = {
  id: number;
  email: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'blackbox.session';
  private readonly apiBaseUrl = 'http://localhost:6060/api';

  login(payload: LoginPayload): Observable<AuthSession> {
    return this.http
      .post<AuthSession>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(tap((session) => this.saveSession(session)));
  }

  register(payload: RegisterPayload): Observable<RegisteredUser> {
    return this.http.post<RegisteredUser>(`${this.apiBaseUrl}/usuarios`, payload);
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.removeItem(this.storageKey);
  }

  getSession(): AuthSession | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const rawSession = window.localStorage.getItem(this.storageKey);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      window.localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const session = this.getSession();
    return session?.usuario.role === 'admin';
  }

  getCurrentUser() {
    return this.getSession()?.usuario ?? null;
  }

  // Verificações de permissão por feature
  canAccessCategorias(): boolean {
    return this.isAuthenticated();
  }

  canEditCategorias(): boolean {
    return this.isAdmin();
  }

  canAccessInsumos(): boolean {
    return this.isAuthenticated();
  }

  canEditInsumos(): boolean {
    return this.isAdmin();
  }

  canCreateMovimentacao(): boolean {
    return this.isAuthenticated();
  }

  canEditMovimentacao(): boolean {
    return this.isAdmin();
  }

  canViewMovimentacao(usuarioId: number): boolean {
    // Admin vê tudo, usuário comum vê apenas suas próprias movimentações
    const currentUser = this.getCurrentUser();
    return this.isAdmin() || currentUser?.id === usuarioId;
  }

  canAccessDashboard(): boolean {
    return this.isAuthenticated();
  }

  canAccessProfile(userId?: number): boolean {
    if (!this.isAuthenticated()) return false;
    const currentUser = this.getCurrentUser();
    // Admin acessa tudo, usuário comum só acessa seu próprio perfil
    return this.isAdmin() || currentUser?.id === userId;
  }

  private saveSession(session: AuthSession): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(session));
  }
}
