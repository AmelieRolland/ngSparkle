import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticlesService } from '../shared/services/articles.service';
import { CategoriesService } from '../shared/services/categories.service';
import { FabricService } from '../shared/services/fabric.service';
import { ServicesService } from '../shared/services/services.service';
import { Article, Category, Fabric, Service, Item, CartItem } from '../shared/entities/entities';
import { CategoryFilterPipe } from '../category-filter.pipe';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, RouterModule, CategoryFilterPipe, CommonModule], // Ajoutez le pipe ici
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
  dataFabrics!: Subscription;
  dataServices!: Subscription;
  articleSelected: Article | null = null;
  fabricSelected: Fabric | null = null;
  selectedServices: Service[] = [];
  count: number = 0;
  panier: Item[] = [];
  selectedCategory: number | null = null;

  @ViewChild('inputQt', { static: true }) inputQt!: ElementRef;
  @Output() close = new EventEmitter<void>();

  constructor(
    private titleService: Title,
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private fabricService: FabricService,
    private servicesService: ServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Mes articles');
    this.fetchArticles();
    this.fetchCategories();
    this.fetchFabrics();
    this.fetchServices();
    this.loadCartFromSession();
  }
  

  fetchArticles(): void {
   this.articlesService.getAll().subscribe((data) => {
      this.articles = data;
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
    this.inputQt.nativeElement.value = this.count.toString();
  }

  openModal(article: Article): void {
    this.articleSelected = article;
    this.fabricSelected = null;
    this.selectedServices = [];
  }

  closeModal(): void {
    this.articleSelected = null;
    this.fabricSelected = null;
    this.selectedServices = [];
    this.count = 0;
  }

  toggleService(service: Service): void {
    const index = this.selectedServices.findIndex(s => s.id === service.id);
    if (index === -1) {
      this.selectedServices.push(service); 
    } else {
      this.selectedServices.splice(index, 1);
    }
  }

  addToCart(): void {
    console.log('Article sélectionné:', this.articleSelected);
    console.log('Tissu sélectionné:', this.fabricSelected);
    console.log('Services sélectionnés:', this.selectedServices);
    console.log('Quantité:', this.count);

    if (this.articleSelected && this.fabricSelected && this.selectedServices.length > 0 && this.count > 0) {
        const pricePerUnit = this.calculateTotalPrice();
        
        const item: CartItem = {
            id: this.panier.length + 1, 
            quantity: this.count,
            price: pricePerUnit / this.count,
            subTotal: pricePerUnit,
            articleName: this.articleSelected.articleName,
            fabricName: this.fabricSelected.fabricName,
            serviceName: this.selectedServices[0].serviceName,
            article_id: this.articleSelected.id,
            fabric_id: this.fabricSelected.id,
            service_id: this.selectedServices[0].id
        };
        
        this.panier.push(item);
        console.log('Item ajouté au panier:', item);
    
        this.saveCartToSession(); 
        this.closeModal();
        this.router.navigate(['/articles']);
    } else {
        console.error('Veuillez sélectionner un article, une matière, un ou plusieurs services, et spécifier une quantité.');
    }
}



  private saveCartToSession(): void {
    sessionStorage.setItem('panier', JSON.stringify(this.panier));
    console.log('Panier sauvegardé dans la session:', this.panier);
  }

  private loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('panier');
    if (savedCart) {
      this.panier = JSON.parse(savedCart);
      console.log('Panier chargé de la session:', this.panier);
    }
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
  }

  updateModalPrice(): void {
    if (this.articleSelected && this.fabricSelected) {
      const totalPrice = this.calculateTotalPrice();
    }
  }

  calculateTotalPrice(): number {
    if (!this.articleSelected || !this.fabricSelected) return 0;

    let price = this.articleSelected.coeff; 
    price += this.fabricSelected.coeff;
    this.selectedServices.forEach(service => {
      price += service.price;
    });

    return price * this.count;
  }

  
}
