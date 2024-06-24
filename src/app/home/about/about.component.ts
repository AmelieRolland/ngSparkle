import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  isExpanded = false;
  txtCourt = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et unde earu autem rem rerum cupiditate dignissimos. Ab optio quos perspiciatis molestias consequatur? Ut amet, accusantium distinctio libero maiores laborum sunt!";
  txtLong = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et unde earum autem rem rerum cupiditate dignissimos. Ab optio quos perspiciatis molestias consequatur? Utamet, accusantium distinctio libero maiores laborum sunt! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.";

  get currentText(): string {
    return this.isExpanded ? this.txtLong : this.txtCourt;
  }

  get buttonText(): string {
    return this.isExpanded ? 'Voir moins' : 'Je veux en savoir plus';
  }

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

}
