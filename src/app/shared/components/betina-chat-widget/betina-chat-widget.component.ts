import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BetinaChatService } from '../../service/betina-chat.service';
import { ChatMessage } from 'src/app/core/models/chat-message.model';
import { ChatResponse } from 'src/app/core/models/chat-response.model';

@Component({
  selector: 'app-betina-chat-widget',
  templateUrl: './betina-chat-widget.component.html',
  styleUrls: ['./betina-chat-widget.component.css']
})
export class BetinaChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  private _unsubscribeAll: Subject<any>;

  constructor(private chatService: BetinaChatService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Add welcome message when component initializes
    this.addWelcomeMessage();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Toggle chat window open/close
   */
  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Focus input when opening
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  /**
   * Send message to chatbot
   */
  sendMessage(): void {
    const messageText = this.currentMessage.trim();
    
    if (!messageText || this.isLoading) {
      return;
    }

    // Add user message
    const userMessage = new ChatMessage(messageText, true);
    this.messages.push(userMessage);
    this.currentMessage = '';
    this.isLoading = true;

    // Add loading message
    const loadingMessage = new ChatMessage('...', false);
    loadingMessage.isLoading = true;
    this.messages.push(loadingMessage);

    // Send to API
    this.chatService.sendMessage(messageText)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: ChatResponse) => {
          // Remove loading message
          this.messages = this.messages.filter(msg => !msg.isLoading);
          
          if (response.success) {
            // Add bot response
            const botMessage = new ChatMessage(response.response, false);
            this.messages.push(botMessage);
          } else {
            // Add error message
            const errorMessage = new ChatMessage(
              'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
              false
            );
            errorMessage.error = response.error;
            this.messages.push(errorMessage);
          }
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (error: any) => {
          // Remove loading message
          this.messages = this.messages.filter(msg => !msg.isLoading);
          
          // Add error message with more details
          let errorText = 'Lo siento, hubo un error de conexión. Por favor, intenta de nuevo más tarde.';
          const status = error?.status || error?.error?.status;
          
          if (status === 404) {
            errorText = 'El servidor del chatbot no está disponible. Por favor, intenta más tarde o contacta al soporte.';
          } else if (status === 0 || !status) {
            errorText = 'No se pudo conectar al servidor. Verifica tu conexión a internet e intenta nuevamente.';
          }
          
          const errorMessage = new ChatMessage(errorText, false);
          errorMessage.error = error?.message || error?.error?.message || `Error ${status || 'desconocido'}`;
          this.messages.push(errorMessage);
          this.isLoading = false;
          this.scrollToBottom();
        }
      });
  }

  /**
   * Send message on Enter key press
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Add welcome message
   */
  private addWelcomeMessage(): void {
    const welcomeMessage = new ChatMessage(
      '¡Hola! 👋 Soy Betina, tu asistente de recomendaciones deportivas. ¿En qué puedo ayudarte?',
      false
    );
    this.messages.push(welcomeMessage);
  }

  /**
   * Scroll to bottom of messages container
   */
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  /**
   * Format message text (convert markdown-like formatting)
   */
  formatMessage(text: string): string {
    if (!text) return '';
    
    // Convert **text** to <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert \n to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
  }
}

