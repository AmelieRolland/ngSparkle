import { Component } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
      senderName: ['', Validators.required],
      senderFirstName: ['', Validators.required],
      senderEmail: ['', [Validators.required, Validators.email]],
      content: ['', Validators.required]
    });
  }

  sendMessage(): void {
    if (this.contactForm.valid) {
      this.newMessage = { 
        ...this.newMessage,
        ...this.contactForm.value, 
        createdAt: new Date()
      };
  
      this.messageService.postMessage(this.newMessage).subscribe(() => {
        this.successMessage = 'Message envoyé avec succès';
        this.errorMessage = ''; 
        this.contactForm.reset(); 
        console.log(this.newMessage);
  
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }, (error) => {
        this.errorMessage = 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.';
        console.error('Erreur lors de l\'envoi du message', error);
  
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      });
    }
  }
  
}

