import { Component } from '@angular/core';
import { HeroComponent } from '../../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { PrestationsComponent } from '../prestations/prestations.component';
import { FaqComponent } from '../faq/faq.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [HeroComponent, AboutComponent, ContactComponent, PrestationsComponent, FaqComponent, TestimonialsComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Sparkle - bienvenue');
  }
}
