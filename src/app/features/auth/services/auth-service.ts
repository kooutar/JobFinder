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

  register(user: { name: string; email: string; password: string }):Observable<string> {
    return this.httpClient.post<string>(this.API_URL, user);
  }
  checkUserExists(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.API_URL}/exists?email=${email}`);
  }

  
}
