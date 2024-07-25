import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  message: any;

  constructor(private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    const messageId = +this.route.snapshot.paramMap.get('id')!;
    this.getMessage(messageId);
  }

  getMessage(id: number): void {
    this.messageService.getMessage(id).subscribe((data: any) => {
      this.message = data;
    });
  }

  
}

