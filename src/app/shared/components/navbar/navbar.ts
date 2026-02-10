import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.log('Navbar component initialized');
  }

  ngOnDestroy(): void {
    console.log('Navbar component destroyed');
  }
}
