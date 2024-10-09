import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  private lastScrollTop = 0;
  private scrollListener!: () => void;
  userName: string | null = null;

  constructor(private renderer: Renderer2, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const headerNav = document.getElementById('header-nav');
      
      if (scrollTop > this.lastScrollTop) {
        headerNav?.classList.add('hidden-nav');
      } else {
        headerNav?.classList.remove('hidden-nav');
      }
      this.lastScrollTop = scrollTop;
    });
    this.UserWelcome();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('panier');
    this.router.navigate(['/']);
  }

  UserWelcome() {

  }

}
