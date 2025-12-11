/**
 * Dialogflow Service
 * Handles integration with Google Dialogflow
 * Supports both iframe Messenger and SDK approaches
 */

import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare var dfMessenger: any;

export interface DialogflowConfig {
  projectId: string;
  agentId: string;
  languageCode: string;
  location?: string;
}

export interface DialogflowMessage {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {
  private messagesSubject = new Subject<DialogflowMessage>();
  public messages$ = this.messagesSubject.asObservable();
  
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  public isLoaded$ = this.isLoadedSubject.asObservable();
  
  private config: DialogflowConfig | null = null;

  constructor() {
    // Check if Dialogflow Messenger is already loaded (iframe approach)
    if (typeof window !== 'undefined') {
      this.checkMessengerLoaded();
    }
  }

  /**
   * Initialize Dialogflow service
   * @param config Dialogflow configuration
   */
  initialize(config: DialogflowConfig): void {
    this.config = config;
    
    // For iframe approach, the messenger is loaded separately
    // For SDK approach, we'll handle initialization here if needed
  }

  /**
   * Check if Dialogflow Messenger is loaded (iframe approach)
   */
  private checkMessengerLoaded(): void {
    if (typeof dfMessenger !== 'undefined') {
      this.isLoadedSubject.next(true);
    } else {
      // Check periodically
      const checkInterval = setInterval(() => {
        if (typeof dfMessenger !== 'undefined') {
          this.isLoadedSubject.next(true);
          clearInterval(checkInterval);
        }
      }, 100);
      
      // Stop checking after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 5000);
    }
  }

  /**
   * Send message using Dialogflow SDK (for custom UI approach)
   * Note: This requires Dialogflow API client library
   * For now, we'll use the webhook approach via backend
   */
  sendMessageSDK(message: string, sessionId: string): Observable<any> {
    // This would require @google-cloud/dialogflow SDK
    // For simplicity, we'll use the backend webhook approach instead
    throw new Error('SDK approach not implemented. Use sendMessageWebhook instead.');
  }

  /**
   * Send message via Dialogflow webhook (recommended approach)
   * This uses your backend webhook which then calls Dialogflow
   */
  sendMessageWebhook(message: string, sessionId: string): Observable<any> {
    // We'll use the backend webhook endpoint
    // The backend handles Dialogflow communication
    const fetch = window.fetch.bind(window);
    
    return new Observable(observer => {
      // This will be handled by the chat widget calling Dialogflow directly
      // or via the backend webhook
      observer.error('Use Dialogflow iframe or backend integration instead');
    });
  }

  /**
   * Send message via Dialogflow Messenger API (iframe approach)
   * @param message User message
   */
  sendMessageMessenger(message: string): void {
    if (typeof dfMessenger !== 'undefined' && dfMessenger.renderCustomText) {
      dfMessenger.renderCustomText(message, true);
    } else {
      console.warn('Dialogflow Messenger not loaded');
    }
  }

  /**
   * Get Dialogflow Messenger instance (iframe approach)
   */
  getMessengerInstance(): any {
    if (typeof dfMessenger !== 'undefined') {
      return dfMessenger;
    }
    return null;
  }

  /**
   * Add message to stream (for custom UI)
   */
  addMessage(message: string, isUser: boolean): void {
    this.messagesSubject.next({
      message: message,
      isUser: isUser,
      timestamp: new Date()
    });
  }

  /**
   * Get Dialogflow Messenger URL (for iframe embedding)
   */
  getMessengerUrl(config: DialogflowConfig): string {
    const projectId = config.projectId;
    const agentId = config.agentId || config.projectId;
    const location = config.location || 'us-central1';
    
    return `https://www.gstatic.com/dialogflow-console/frames/messenger.html?agentId=${agentId}&location=${location}`;
  }

  /**
   * Get Dialogflow iframe embed code
   */
  getIframeEmbedCode(config: DialogflowConfig): string {
    const messengerUrl = this.getMessengerUrl(config);
    return `<df-messenger
      project-id="${config.projectId}"
      agent-id="${config.agentId || config.projectId}"
      language-code="${config.languageCode}"
      ${config.location ? `location-id="${config.location}"` : ''}
      intent="WELCOME"
      chat-title="Betina">
    </df-messenger>
    <script src="https://www.gstatic.com/dialogflow-console/frames/messenger/bootstrap.js"></script>`;
  }
}

