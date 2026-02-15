import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { logout } from '../../../features/favorites/favorites.actions';
import { Store } from '@ngrx/store';
import { selectFavoritesCount } from '../../../features/favorites/favorites.selectors';
import { selectApplicationsCount } from '../../../features/applications/pages/application.selectors';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  mobileMenuOpen = false;
  favoritesCount$!: Observable<number>;
  applicationsCount$!: Observable<number>;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.favoritesCount$ = this.store.select(selectFavoritesCount);
    this.applicationsCount$ = this.store.select(selectApplicationsCount);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

 
  logout() {
    // 1️⃣ Supprime le user du localStorage et notifie les abonnés
    this.authService.logout();

    // 2️⃣ Vide le store NgRx (favoris, auth)
    this.store.dispatch(logout());

    // 3️⃣ Redirige vers la page login ou home
    this.router.navigate(['/auth/login']);
  }

}
