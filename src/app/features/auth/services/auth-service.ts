import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000/users';
  
  private httpClient:HttpClient;

  constructor(@Inject(HttpClient) httpClient:HttpClient) {
    this.httpClient = httpClient;
  }

  register(user: { name: string; email: string; password: string }):Observable<any> {
    return this.httpClient.post<any>(this.API_URL, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.get<any>(`${this.API_URL}?email=${credentials.email}&password=${credentials.password}`);
  }

  checkUserExists(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.API_URL}/exists?email=${email}`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  setCurrentUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
