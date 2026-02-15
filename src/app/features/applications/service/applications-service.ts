import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private apiUrl = 'http://localhost:3000/users'; // JSON Server endpoint

  constructor(private http: HttpClient) {}

  /**
   * Récupère les candidatures d'un utilisateur
   */
  getUserApplications(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Met à jour les candidatures d'un utilisateur
   */
  updateUserApplications(userId: number, applications: number[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, {
      applications
    });
  }
}
