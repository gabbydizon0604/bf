import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  hmr: false,
  name: 'DESARROLLO',
  urlIntegracion: 'https://betticsbackend.onrender.com',
  // urlIntegracion: 'https://apianabet.herokuapp.com', // Legacy URL
  // urlIntegracion: 'https://dev-apianabet-56f3650bc0aa.herokuapp.com',
  PORT: 3000,
  
  // Dialogflow Configuration
  dialogflow: {
    enabled: true,
    useIframe: true,
    projectId: '', // Set your Dialogflow project ID in production
    agentId: '', // Set your Dialogflow agent ID in production
    location: 'us-central1',
    languageCode: 'es'
  }
};
