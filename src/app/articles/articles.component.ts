import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ArticleModalComponent } from './article-modal/article-modal.component';


@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [ArticleModalComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Mes articles');
  }

}
