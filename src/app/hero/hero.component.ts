import { Component, Input } from '@angular/core';
import { AccueilComponent } from '../home/accueil/accueil.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AccueilComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  
  
}
