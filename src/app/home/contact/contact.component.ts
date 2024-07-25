import { Component } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  newMessage: any = { senderName: '', senderFirstName: '', senderEmail: '', content: '' };
  successMessage: string = '';

  constructor(private messageService: MessageService) {}

  sendMessage(): void {
    this.newMessage.createdAt = new Date();
    this.newMessage.isRead = false;
    this.messageService.postMessage(this.newMessage).subscribe(() => {
      this.successMessage = 'Message envoyé avec succès';
      this.newMessage = { senderName: '', senderFirstName: '', senderEmail: '', content: ''};
      console.log(this.newMessage);

      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, (error) => {
      console.error('Erreur lors de l\'envoi du message', error);
    });
  }
}
