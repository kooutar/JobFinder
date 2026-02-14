import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { logout } from '../../../features/favorites/favorites.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule ] ,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
isLoggedIn = false;
  mobileMenuOpen = false;

  favoritesCount = 0;    // tu peux récupérer depuis ton service plus tard
  applicationsCount = 0; // idem

  constructor(private authService: AuthService, private store: Store, private router: Router) {}

  ngOnInit(): void {
    // S'abonner à l'état de connexion
    this.authService.isLoggedIn$.subscribe(status => {
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
    this.router.navigate(['/login']);
  }

}
