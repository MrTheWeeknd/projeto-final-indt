import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = 'http://localhost:6060/api/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  promoverParaAdmin(userId: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/promover-admin`, {});
  }

  rebaixarParaUsuario(userId: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/rebaixar-usuario`, {});
  }

  atualizarPermissoes(userId: number, permissoes: any) {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/permissoes`, { permissoes });
  }
}
