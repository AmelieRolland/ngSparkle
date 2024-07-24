import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../shared/services/articles.service';
import { Article, Category, NewArticle } from '../../shared/entities/entities';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  article: Partial<Article> = { articleName: '', coeff: 0, idCategory: '', imgUrl: '' };
  articleId: number | null = null;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.loadCategories();
    if (this.articleId) {
      this.articlesService.getById(this.articleId).subscribe((data) => {
        this.article = {
          id: data.id,
          articleName: data.articleName,
          coeff: data.coeff,
          idCategory: this.extractCategoryId(data.idCategory),
          imgUrl: data.imgUrl
        };
      });
    }
  }
  
  //Pour afficher les options de catégories
  loadCategories(): void {
    this.categoriesService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  //Pour récupérer l'id de la catégorie
  extractCategoryId(categoryUrl: string): string {
    const parts = categoryUrl.split('/');
    return parts.pop() || '';
  }

  onSubmit(): void {
    const articleToSubmit: NewArticle = {
      articleName: this.article.articleName!,
      coeff: this.article.coeff!,
      idCategory: `/api/categories/${this.article.idCategory}`, 
      imgUrl: this.article.imgUrl!
    };


    if (this.articleId) {
      // Si ID, alors update :
      this.articlesService.update(this.articleId, { ...articleToSubmit, id: this.articleId }).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la modification de l\'article:', err)
      });
    } else {
      // Création
      this.articlesService.create(articleToSubmit).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la création de l\'article:', err)
      });
    }
  }
}
