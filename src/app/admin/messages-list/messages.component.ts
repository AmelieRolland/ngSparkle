import { Component } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { CommonModule, NgFor } from '@angular/common';
import { Message } from '../../shared/entities/entities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

  messages: Message[] = [];
  unreadMessagesCount: number = 0;

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.loadMessages();
    this.getUnreadMessagesCount(); 
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe((data: Message[]) => {
      this.messages = data;
      this.unreadMessagesCount = this.messages.filter(msg => !msg.isRead).length;
    });
  }

  markAsRead(messageId: number): void {
    this.messageService.markAsRead(messageId).subscribe(() => {
      this.loadMessages(); 
    });
  }

  getUnreadMessagesCount(): void {  
    this.messageService.getUnreadMessagesCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });
  }

  openMessage(messageId: number): void {
    this.markAsRead(messageId);
    this.router.navigate(['/admin/messages', messageId]); 
  }
}
