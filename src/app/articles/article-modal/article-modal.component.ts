import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Article } from '../../shared/entities/entities';
import { ArticlesService } from '../../shared/services/articles.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-article-modal',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './article-modal.component.html',
  styleUrls: ['./article-modal.component.css'] 
})
export class ArticleModalComponent implements AfterViewInit, OnInit {

  articles: Article[] = [];
  articleSelected: Article | null = null; // Initialiser avec null
  count: number = 0;

  constructor(private route: ActivatedRoute, private articleService: ArticlesService) { }

  @ViewChild('inputQt', { static: true }) inputQt!: ElementRef;

  ngOnInit() {
    

    this.fetchOne(); 
  }

  selectArticle(article: Article) {
    this.articleSelected = article;
  }

  ngAfterViewInit() {
    this.updateInputValue();
  }

  increment() {
    this.count++;
    this.updateInputValue();
  }

  fetchOne() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id !== null) {
      console.log(id);
      this.articleService.getById(id).subscribe({
        next: (data) => this.articleSelected = data,
        error: (error) => console.error('Erreur lors de la récupération de l\'article', error)
      });
    } else {
      console.error('ID is null');
    }
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
}
