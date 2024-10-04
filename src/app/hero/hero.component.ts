import { Component, Input } from '@angular/core';
import { AccueilComponent } from '../home/accueil/accueil.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AccueilComponent, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  
  
}
