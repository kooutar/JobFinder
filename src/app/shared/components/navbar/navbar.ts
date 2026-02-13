import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
isLoggedIn = false;
  mobileMenuOpen = false;

  favoritesCount = 0;    // tu peux récupérer depuis ton service plus tard
  applicationsCount = 0; // idem

  constructor(private authService: AuthService) {}

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
    this.authService.logout();
  }

}
