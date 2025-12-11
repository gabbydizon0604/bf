/**
 * Betina Chat Widget with Dialogflow Integration
 * This component embeds Dialogflow Messenger in an iframe
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DialogflowService } from '../../service/dialogflow.service';

@Component({
  selector: 'app-betina-chat-widget-dialogflow',
  templateUrl: './betina-chat-widget-dialogflow.component.html',
  styleUrls: ['./betina-chat-widget-dialogflow.component.css']
})
export class BetinaChatWidgetDialogflowComponent implements OnInit, OnDestroy {
  isOpen = false;
  dialogflowConfig = environment.dialogflow || {
    enabled: false,
    useIframe: true,
    projectId: '',
    agentId: '',
    location: 'us-central1',
    languageCode: 'es'
  };
  messengerLoaded = false;

  constructor(private dialogflowService: DialogflowService) {}

  ngOnInit(): void {
    // Initialize Dialogflow service if not using iframe
    if (this.dialogflowConfig && !this.dialogflowConfig.useIframe) {
      this.initializeDialogflowSDK();
    } else if (this.dialogflowConfig && this.dialogflowConfig.useIframe) {
      this.loadDialogflowMessenger();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Toggle chat window open/close
   */
  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Load Dialogflow Messenger (iframe approach)
   */
  private loadDialogflowMessenger(): void {
    // Check if script is already loaded
    if (document.querySelector('script[src*="dialogflow-console"]')) {
      this.messengerLoaded = true;
      return;
    }

    // Load Dialogflow Messenger script
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/frames/messenger/bootstrap.js';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      this.messengerLoaded = true;
      console.log('Dialogflow Messenger loaded');
    };

    script.onerror = () => {
      console.error('Failed to load Dialogflow Messenger');
    };

    document.head.appendChild(script);
  }

  /**
   * Initialize Dialogflow SDK (for custom UI approach)
   */
  private initializeDialogflowSDK(): void {
    if (this.dialogflowConfig && this.dialogflowConfig.projectId && this.dialogflowConfig.agentId) {
      this.dialogflowService.initialize({
        projectId: this.dialogflowConfig.projectId,
        agentId: this.dialogflowConfig.agentId,
        languageCode: this.dialogflowConfig.languageCode,
        location: this.dialogflowConfig.location
      });
    }
  }

  /**
   * Get Dialogflow Messenger attributes
   */
  getMessengerAttributes(): any {
    if (!this.dialogflowConfig) {
      return {};
    }
    return {
      'project-id': this.dialogflowConfig.projectId || '',
      'agent-id': this.dialogflowConfig.agentId || this.dialogflowConfig.projectId || '',
      'language-code': this.dialogflowConfig.languageCode || 'es',
      'location-id': this.dialogflowConfig.location || 'us-central1',
      'intent': 'WELCOME',
      'chat-title': 'Betina',
      'placeholder': 'Escribe tu mensaje...',
      'minimal': 'false',
      'width': '400',
      'height': '600'
    };
  }
}

