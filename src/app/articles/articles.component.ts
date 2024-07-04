import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ArticleModalComponent } from './article-modal/article-modal.component';
import { ArticlesService } from '../shared/services/articles.service';
import { Article } from '../shared/entities/entities';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [ArticleModalComponent, NgFor],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit, OnDestroy {

  articles: Article[] = [];
  dataArticles!: Subscription;

  constructor(private titleService: Title, private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Mes articles');
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.dataArticles = this.articlesService.getAll().subscribe((data) => {
      this.articles = data;
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.dataArticles.unsubscribe();
  }
}

