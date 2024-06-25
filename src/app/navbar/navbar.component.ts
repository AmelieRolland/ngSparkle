import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  private lastScrollTop = 0;
  private scrollListener!: () => void;

  constructor(private renderer: Renderer2) {}

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
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

}
