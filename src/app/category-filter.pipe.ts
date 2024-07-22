import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../app/shared/entities/entities'; // Assurez-vous que le chemin est correct

@Pipe({
  name: 'categoryFilter',
  standalone: true
})
export class CategoryFilterPipe implements PipeTransform {

  transform(articles: Article[], selectedCategory: number | null): Article[] {
    if (!selectedCategory) {
      return articles;
    }
    return articles.filter(article => article.idCategory === selectedCategory);
  }

}

