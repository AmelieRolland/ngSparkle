import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  isExpanded = false;
  txtCourt = "Depuis sa création, Sparkle Pressing est synonyme d'excellence dans le domaine du pressing haut de gamme. Fondée par Bernard et Laeticia, notre entreprise familiale s’est donnée pour mission de fournir des services de pressing de premier choix pour les particuliers et les professionnels.";
  txtLong = "Depuis sa création, Sparkle Pressing est synonyme d'excellence dans le domaine du pressing haut de gamme. Fondée par Bernard et Laeticia, notre entreprise familiale s’est donnée pour mission de fournir des services de pressing de premier choix pour les particuliers et les professionnels.Bernard et Laeticia, animés par une passion commune pour l'art du pressing, ont décidé de transformer leur expertise en une entreprise dédiée à la qualité et à l’attention aux détails. Leur vision était simple mais ambitieuse : offrir un service irréprochable qui allie innovation et tradition.À Sparkle Pressing, nous comprenons que chaque vêtement est unique. C’est pourquoi nous employons des techniques de nettoyage sophistiquées et respectueuses des matériaux pour garantir une propreté impeccable sans compromettre la qualité des tissus. Que vous soyez un particulier cherchant à entretenir des pièces précieuses ou un professionnel nécessitant un service de pressing fiable pour vos tenues de travail, nous avons la solution qu'il vous faut .Notre engagement envers le service client est au cœur de notre entreprise. Nous offrons une expérience personnalisée pour répondre aux besoins spécifiques de chaque client. En tant que pressing haut de gamme, nous nous efforçons non seulement de satisfaire mais de dépasser les attentes de nos clients, en leur offrant des solutions sur mesure et un service à la hauteur de leur exigence.";

  get currentText(): string {
    return this.isExpanded ? this.txtLong : this.txtCourt;
  }

  get buttonText(): string {
    return this.isExpanded ? 'Voir moins' : 'Je veux en savoir plus';
  }

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

}
