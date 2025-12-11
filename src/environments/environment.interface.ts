/**
 * Environment interface definition
 */

export interface DialogflowConfig {
  enabled: boolean;
  useIframe: boolean;
  projectId: string;
  agentId: string;
  location: string;
  languageCode: string;
}

export interface Environment {
  production: boolean;
  hmr: boolean;
  name: string;
  PORT: number;
  urlIntegracion: string;
  dialogflow: DialogflowConfig;
}

