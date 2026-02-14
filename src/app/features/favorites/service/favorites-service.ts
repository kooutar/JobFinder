import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private api = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUserFavorites(userId: number) {
    return this.http.get<any>(`${this.api}/${userId}`);
  }

  updateUserFavorites(userId: number, favorites: number[]) {
    return this.http.patch(`${this.api}/${userId}`, {
      favorites
    });
  }
}

