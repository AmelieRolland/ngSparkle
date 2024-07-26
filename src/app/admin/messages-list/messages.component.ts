import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { CommonModule } from '@angular/common';
import { Message } from '../../shared/entities/entities';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  unreadMessagesCount: number = 0;
  private navigationSubscription: Subscription;

  constructor(private messageService: MessageService, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.router.url === '/admin/messages') {
        this.loadMessages();
      }
    });
  }

  ngOnInit(): void {
    this.loadMessages();
    this.messageService.getUnreadMessagesCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe((data: Message[]) => {
      this.messages = data;
      this.updateUnreadMessagesCount();
    });
  }

  markAsRead(messageId: number): void {
    this.messageService.markAsRead(messageId).subscribe(() => {
      const message = this.messages.find(msg => msg.id === messageId);
      if (message) {
        message.read = true;
        this.updateUnreadMessagesCount();
      }
    });
  }

  updateUnreadMessagesCount(): void {
    const count = this.messages.filter(msg => !msg.read).length;
    this.unreadMessagesCount = count;
    this.messageService.updateUnreadMessagesCount(count);
  }

  openMessage(messageId: number): void {
    this.markAsRead(messageId);
    this.router.navigate(['/admin/messages', messageId]).then(() => {
      this.updateUnreadMessagesCount();
    });
  }

  deleteMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.messageService.deleteMessage(messageId).subscribe(() => {
        this.messages = this.messages.filter(msg => msg.id !== messageId);
        this.updateUnreadMessagesCount();
      });
    }
  }
}