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
  imports: [NgFor, FormsModule, NgIf, RouterModule, CategoryFilterPipe, CommonModule],
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

  showAlert = false;

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

  errorMessages = {
    fabric: '',
    services: '',
    quantity: ''
  };

  ngOnInit(): void {
    this.titleService.setTitle('Mes articles');
    this.fetchArticles();
    this.fetchCategories();
    this.fetchFabrics();
    this.fetchServices();
    this.loadCartFromSession();
    if (this.fabrics.length > 0) {
      this.fabricSelected = this.fabrics[0];
    }
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
  
      if (this.fabrics.length > 0) {
        this.fabricSelected = this.fabrics[0];
      }
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
    let valid = true;

    this.errorMessages = {
      fabric: '',
      services: '',
      quantity: ''
    };

    if (!this.fabricSelected) {
        this.errorMessages.fabric = 'Veuillez sélectionner une matière.';
        valid = false;
    }

    if (this.selectedServices.length === 0) {
        this.errorMessages.services = 'Veuillez sélectionner au moins un service.';
        valid = false;
    }

    if (this.count <= 0) {
        this.errorMessages.quantity = 'Veuillez sélectionner une quantité valide.';
        valid = false;
    }

    if (valid) {
        console.log('Article sélectionné:', this.articleSelected);
        console.log('Tissu sélectionné:', this.fabricSelected);
        console.log('Services sélectionnés:', this.selectedServices);
        console.log('Quantité:', this.count);

        const pricePerUnit = this.calculateTotalPrice();

        this.selectedServices.forEach(service => {
          const item: CartItem = {
              id: this.panier.length + 1, 
              quantity: this.count,
              price: pricePerUnit / this.count,
              subTotal: pricePerUnit,
              articleName: this.articleSelected!.articleName,
              fabricName: this.fabricSelected!.fabricName,
              serviceName: service.serviceName,
              article_id: this.articleSelected!.id,
              fabric_id: this.fabricSelected!.id,
              service_id: service.id
          };

          this.panier.push(item);
          console.log('Item ajouté au panier:', item);
      });

        this.saveCartToSession();
        this.closeModal();

        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);

        this.router.navigate(['/articles']);
    } else {
        console.error('Veuillez sélectionner un article, une matière, un ou plusieurs services, et spécifier une quantité.');
    }
}



  private saveCartToSession(): void {
    localStorage.setItem('panier', JSON.stringify(this.panier));
    console.log('Panier sauvegardé dans la session:', this.panier);
  }

  private loadCartFromSession(): void {
    const savedCart = localStorage.getItem('panier');
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
