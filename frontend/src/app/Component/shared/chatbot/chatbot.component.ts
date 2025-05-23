import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../../services/services/chatService.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';
  chatHistory: {sender: string, message: string}[] = [];
  isWaitingForResponse: boolean = false;
  isOpen: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    console.log('Button clicked, current state:', this.isOpen); // Add this line

    this.isOpen = !this.isOpen;
    console.log('New state:', this.isOpen); // Add this line

  }

  closeChat() {
    this.isOpen = false;
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;
    
    // Add user message to chat history
    this.chatHistory.push({sender: 'You', message: this.userMessage});
    this.isWaitingForResponse = true;
    
    this.chatbotService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        this.chatHistory.push({sender: 'Bot', message: response});
        this.isWaitingForResponse = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.chatHistory.push({sender: 'Bot', message: 'Sorry, an error occurred.'});
        this.isWaitingForResponse = false;
      }
    });

    this.userMessage = ''; // Clear input
  }
}