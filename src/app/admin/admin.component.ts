import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  unreadMessagesCount: number = 0;
  constructor(private titleService: Title, private messageService: MessageService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
    this.loadUnreadMessagesCount();
  }

  loadUnreadMessagesCount(): void {
    this.messageService.getUnreadMessagesCount().subscribe((count: number) => {
      this.unreadMessagesCount = count;
    });
  }
}