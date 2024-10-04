import { Component } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  newMessage: any = { senderName: '', senderFirstName: '', senderEmail: '', content: '', isRead: false };
  successMessage: string = '';
  errorMessage: string = ''; 
  contactForm: FormGroup;



  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.contactForm = this.fb.group({
      senderEmail: ['', [Validators.required, Validators.email]]
    });
  }

  sendMessage(): void {
    this.newMessage.createdAt = new Date();
    this.messageService.postMessage(this.newMessage).subscribe(() => {
      this.successMessage = 'Message envoyé avec succès';
      this.errorMessage = ''; 
      this.newMessage = { senderName: '', senderFirstName: '', senderEmail: '', content: '' };

      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, (error) => {
      this.errorMessage = 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.';  // Afficher le message d'erreur
      console.error('Erreur lors de l\'envoi du message', error);

      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    });
  }
}

