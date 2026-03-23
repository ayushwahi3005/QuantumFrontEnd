import { Component } from '@angular/core';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        text: 'Hi! How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      });
    }
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });

    this.userInput = '';

    // Simulate bot reply
    setTimeout(() => {
      this.messages.push({
        text: this.getBotReply(text),
        sender: 'bot',
        timestamp: new Date()
      });
    }, 600);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private getBotReply(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) {
      return 'Hello! What can I assist you with?';
    }
    if (lower.includes('help')) {
      return 'Sure! You can ask me about assets, work orders, customers, or settings.';
    }
    if (lower.includes('asset')) {
      return 'You can manage assets from the sidebar. Need more details?';
    }
    if (lower.includes('work order') || lower.includes('workorder')) {
      return 'Work orders can be created and tracked from the sidebar menu.';
    }
    if (lower.includes('customer')) {
      return 'Navigate to Customers in the sidebar to manage your customer list.';
    }
    return "I'm here to help! Could you provide more details about your question?";
  }
}
