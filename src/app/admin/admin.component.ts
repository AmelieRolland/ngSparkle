import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MessageService } from '../shared/services/message.service';
import { Message } from '../shared/entities/entities';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  unreadMessagesCount: number = 0;
  messages: Message[] = [];

  constructor(private titleService: Title, private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.getUnreadMessagesCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });
    this.titleService.setTitle('Dashboard');
    
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe((messages: Message[]) => {
      this.messages = messages;
      this.calculateUnreadMessagesCount();
    });
  }

  calculateUnreadMessagesCount(): void {
    this.unreadMessagesCount = this.messages.filter(message => !message.read).length;
  }
}