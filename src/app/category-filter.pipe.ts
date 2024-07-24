import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../app/shared/entities/entities'; 
@Pipe({
  name: 'categoryFilter',
  standalone: true
})
export class CategoryFilterPipe implements PipeTransform {

  
  transform(articles: Article[], selectedCategory: number | null): Article[] {
    if (selectedCategory === null) {
      return articles;
    }
    return articles.filter(article => +article.idCategory === selectedCategory);
  }
}
