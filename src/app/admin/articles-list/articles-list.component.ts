import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ArticlesService } from '../../shared/services/articles.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { FabricService } from '../../shared/services/fabric.service';
import { ServicesService } from '../../shared/services/services.service';
import { Router, RouterLink } from '@angular/router';
import { Article, Category, Fabric, Service } from '../../shared/entities/entities';
import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent {

  articles: Article[] = [];
  categories: Category[] = [];
  fabrics: Fabric[] = [];
  services: Service[] = [];

  private subscriptions: Subscription = new Subscription();


  constructor(
    private titleService: Title,
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private fabricService: FabricService,
    private servicesService: ServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.subscriptions.add(
      forkJoin({
        articles: this.articlesService.getAll(),
        categories: this.categoriesService.getAll(),
        fabrics: this.fabricService.getFabrics(),
        services: this.servicesService.getServices()
      }).subscribe(({ articles, categories, fabrics, services }) => {
        this.articles = articles;
        this.categories = categories;
        this.fabrics = fabrics;
        this.services = services;
      })
    );
  }

  deleteArticle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articlesService.delete(id).subscribe(() => {
        this.articles = this.articles.filter(article => article.id !== id);
      });
    }
  }

  deleteFabric(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      this.fabricService.delete(id).subscribe(() => {
        this.fabrics = this.fabrics.filter(fabric => fabric.id !== id);
      });
    }
  }

  deleteService(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.servicesService.deleteService(id).subscribe(() => {
        this.services = this.services.filter(service => service.id !== id);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
