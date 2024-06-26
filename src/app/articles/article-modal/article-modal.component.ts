import { AfterViewInit, Component, ViewChild, ElementRef} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-article-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './article-modal.component.html',
  styleUrl: './article-modal.component.css'
})
export class ArticleModalComponent implements AfterViewInit {

  count: number = 0;

  @ViewChild('inputQt', { static: true }) inputQt!: ElementRef;

  ngAfterViewInit() {
    this.updateInputValue();
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
    this.inputQt.nativeElement.value = this.count;
  }

}
