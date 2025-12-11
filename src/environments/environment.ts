// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  hmr: false,
  name: 'DESARROLLO',
  PORT: 3000,
  urlIntegracion: 'http://localhost:3010',
  // urlIntegracion: 'https://apianabet.herokuapp.com',
  // urlIntegracion: 'https://dev-apianabet-56f3650bc0aa.herokuapp.com',
  
  // Dialogflow Configuration
  dialogflow: {
    enabled: true, // Set to false to use direct API instead of Dialogflow
    useIframe: true, // Set to true for iframe Messenger, false for custom UI with SDK
    projectId: '', // Set your Dialogflow project ID (e.g., 'bettics-betina-chatbot')
    agentId: '', // Set your Dialogflow agent ID (usually same as projectId)
    location: 'us-central1', // Dialogflow location
    languageCode: 'es' // Language code (Spanish)
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
