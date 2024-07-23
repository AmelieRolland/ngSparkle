import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../shared/services/articles.service';
import { Article } from '../../shared/entities/entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css'
})
export class ArticleFormComponent {
  article: Article = { id: 0, articleName: '', coeff: 0, idCategory: 0, imgUrl: '' };
  articleId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.articleId) {
      this.articlesService.getById(this.articleId).subscribe((data) => {
        this.article = data;
      });
    }
  }

  onSubmit(): void {
    if (this.articleId) {
      this.articlesService.update(this.article.id, this.article).subscribe(() => {
        this.router.navigate(['/admin/articles']);
      });
    } else {
      this.articlesService.create(this.article).subscribe(() => {
        this.router.navigate(['/admin/articles']);
      });
    }
  }
}