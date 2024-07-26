import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MessageService } from '../shared/services/message.service';
import { Message } from '../shared/entities/entities';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'] 
})
export class AdminComponent implements OnInit {

  unreadMessagesCount = 0;
  messages: Message[] = [];

  constructor(private titleService: Title, private messageService: MessageService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
    this.loadUnreadMessagesCount();
    this.loadMessages();
  }

  private loadUnreadMessagesCount(): void {
    this.messageService.getUnreadMessagesCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });
  }

  private loadMessages(): void {
    this.messageService.getMessages().subscribe((messages: Message[]) => {
      this.messages = messages;
      this.calculateUnreadMessagesCount();
    });
  }

  private calculateUnreadMessagesCount(): void {
    this.unreadMessagesCount = this.messages.filter(message => !message.read).length;
  }
}
