import { Component } from '@angular/core';
import { ProHeroComponent } from '../pro-hero/pro-hero.component';
import { ServicesComponent } from '../services/services.component';
import { DevisComponent } from '../devis/devis.component';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-pro',
  standalone: true,
  imports: [ProHeroComponent, ServicesComponent,DevisComponent],
  templateUrl: './pro.component.html',
  styleUrl: './pro.component.css'
})
export class ProComponent {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Espace pro');
  }
}
