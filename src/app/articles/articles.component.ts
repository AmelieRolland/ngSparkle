import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ArticlesService } from '../shared/services/articles.service';
import { Article, Category, Fabric, Service } from '../shared/entities/entities';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../shared/services/categories.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FabricService } from '../shared/services/fabric.service';
import { ServicesService } from '../shared/services/services.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, RouterModule],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit, OnDestroy {

  articles: Article[] = [];
  categories: Category[] = [];
  fabrics: Fabric[] = [];
  services: Service[] = [];
  dataArticles!: Subscription;
  dataCategories!: Subscription;
  articleSelected: Article | null = null;
  dataFabrics!: Subscription;
  dataServices!: Subscription;
  count: number = 0;

  @ViewChild('inputQt', { static: true }) inputQt!: ElementRef;
  @Output() close = new EventEmitter<void>();

  constructor(private titleService: Title, 
    private articlesService: ArticlesService, 
    private categoriesService: CategoriesService,
    private fabricService: FabricService,
    private servicesService: ServicesService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Mes articles');
    this.fetchArticles();
    this.fetchCategories();
    this.fetchFabrics();
    this.fetchServices();
  }

  fetchArticles(): void {
    this.dataArticles = this.articlesService.getAll().subscribe((data) => {
      this.articles = data;
      console.log(data);
    });
  }

  fetchCategories(): void {
    this.dataCategories = this.categoriesService.getAll().subscribe((catData) => {
      this.categories = catData;
    });
  }

  fetchFabrics(): void {
    this.dataFabrics = this.fabricService.getFabrics().subscribe((fabricData) => {
      this.fabrics = fabricData;
    });
  }

  fetchServices(): void {
    this.dataServices = this.servicesService.getServices().subscribe((serviceData) => {
      this.services = serviceData;
    });
  }

  ngOnDestroy(): void {
    this.dataArticles.unsubscribe();
    this.dataCategories.unsubscribe();
    this.dataFabrics.unsubscribe();
    this.dataServices.unsubscribe();
  }

  increment() {
    this.count++;
    this.updateInputValue();
  }

  decrement() {
    if (this.count > 0) {
      this.count--;
      this.updateInputValue();
    }
  }

  updateInputValue() {
    this.inputQt.nativeElement.value = this.count;
  }

  openModal(article: any): void {
    this.articleSelected = article;
  }

  closeModal(): void {
    this.articleSelected = null;
  }

  addToCart(): void {
    console.log('Adding to cart:', this.articleSelected);
  }
}
