import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../shared/services/articles.service';
import { Article, Category, NewArticle } from '../../shared/entities/entities';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  createArticleForm!: FormGroup;
  articleId: number | null = null;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire
    this.initializeForm();
    
    // Charger les catégories
    this.loadCategories();
    
    // Récupérer l'ID de l'article
    this.articleId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    
    // Si articleId est présent, charger les données de l'article
    if (this.articleId) {
      this.loadArticle();
    }
  }

  // Initialiser le formulaire
  initializeForm(): void {
    this.createArticleForm = this.fb.group({
      articleName: ['', Validators.required],
      coeff: [0, Validators.required],
      idCategory: ['', Validators.required],
      imgUrl: ['', Validators.required]
    });
  }

  // Charger les catégories
  loadCategories(): void {
    this.categoriesService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  // Charger les données de l'article
  loadArticle(): void {
    this.articlesService.getById(this.articleId!).subscribe((data) => {
      this.createArticleForm.patchValue({
        articleName: data.articleName,
        coeff: data.coeff,
        idCategory: data.idCategory ? this.extractCategoryId(data.idCategory) : '',
        imgUrl: data.imgUrl
      });
    });
  }

  // Extraire l'ID de la catégorie
  extractCategoryId(categoryUrl: string): string {
    if (!categoryUrl) {
      console.error('Category URL is undefined or empty');
      return '';
    }
    const parts = categoryUrl.split('/');
    return parts.pop() || '';
  }

  // Soumettre le formulaire
  onSubmit(): void {
    const formValues = this.createArticleForm.value;
    const articleToSubmit: NewArticle = {
      articleName: formValues.articleName,
      coeff: formValues.coeff,
      idCategory: `/api/categories/${formValues.idCategory}`,
      imgUrl: formValues.imgUrl
    };

    if (this.articleId) {
      // Si articleId est présent, mettre à jour l'article
      this.articlesService.update(this.articleId, { ...articleToSubmit, id: this.articleId }).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la modification de l\'article:', err)
      });
    } else {
      // Sinon, créer un nouvel article
      this.articlesService.create(articleToSubmit).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la création de l\'article:', err)
      });
    }
  }
}
