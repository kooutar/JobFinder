import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000/users';

  private httpClient: HttpClient;

  // Vérifie si on est côté navigateur
  private isBrowser = typeof window !== 'undefined';

  // Initialisation sûre de loggedInSubject
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('authToken');
  }

  register(user: { name: string; email: string; password: string ; favorites: any[] ; applications: any[] }): Observable<any> {
    return this.httpClient.post<any>(this.API_URL, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient
      .get<any>(`${this.API_URL}?email=${credentials.email}&password=${credentials.password}`)
      .pipe(
        tap((response: any) => {
          if (this.isBrowser) {
            localStorage.setItem('authToken', response.token);
            this.setCurrentUser(response.user); // stocke les infos utilisateur
          }
          this.loggedInSubject.next(true);
        })
      );
  }

  checkUserExists(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.API_URL}/exists?email=${email}`);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.loggedInSubject.next(false);
  }

  setCurrentUser(user: any): void {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getCurrentUser(): any {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Met à jour les infos de l'utilisateur (nom, email, mot de passe optionnel).
   * Met à jour le currentUser en localStorage après succès.
   */
  updateUser(
    id: string | number,
    data: { name?: string; email?: string; password?: string }
  ): Observable<any> {
    return this.httpClient.patch<any>(`${this.API_URL}/${id}`, data).pipe(
      tap((updatedUser) => {
        if (this.isBrowser) {
          const current = this.getCurrentUser();
          if (current && String(current.id) === String(id)) {
            const { password: _p, ...safe } = updatedUser;
            this.setCurrentUser({ ...current, ...safe });
          }
        }
      })
    );
  }
}
