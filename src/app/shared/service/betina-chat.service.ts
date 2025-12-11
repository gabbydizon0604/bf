import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Constantes } from 'src/app/core/data/constants';
import { ChatResponse } from 'src/app/core/models/chat-response.model';

@Injectable({
  providedIn: 'root'
})
export class BetinaChatService {
  private urlAccesos = environment.urlIntegracion;

  constructor(private httpClient: HttpClient) { }

  /**
   * Send a message to the chatbot
   * @param message User message
   * @param sessionId Optional session ID for conversation tracking
   * @returns Observable<ChatResponse>
   */
  sendMessage(message: string, sessionId?: string): Observable<ChatResponse> {
    const url = `${this.urlAccesos}${Constantes.api.chatbot.Query}`;
    const body = {
      message: message,
      sessionId: sessionId || this.generateSessionId()
    };

    return this.httpClient.post<any>(url, body).pipe(
      map((response: any) => {
        return new ChatResponse(response);
      }),
      catchError(error => {
        console.error('Error sending chat message:', error);
        console.error('Request URL:', url);
        console.error('Environment URL:', this.urlAccesos);
        
        // Return error with status info
        const errorMessage = error.error?.error || 
                           (error.status === 404 ? 'Endpoint no encontrado. Verifica que el backend esté corriendo.' : 
                           (error.status === 0 ? 'No se pudo conectar al servidor.' : 
                           'Error al enviar mensaje'));
        
        return throwError(() => ({
          ...error,
          message: errorMessage
        }));
      })
    );
  }

  /**
   * Search recommendations directly
   * @param local Local team name
   * @param visitor Visitor team name
   * @param date Optional date filter
   * @param league Optional league filter
   * @returns Observable<any>
   */
  searchRecommendations(local?: string, visitor?: string, date?: string, league?: string): Observable<any> {
    const url = `${this.urlAccesos}${Constantes.api.chatbot.Search}`;
    let params = new HttpParams();
    
    if (local) params = params.set('local', local);
    if (visitor) params = params.set('visitor', visitor);
    if (date) params = params.set('date', date);
    if (league) params = params.set('league', league);

    return this.httpClient.get<any>(url, { params }).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error searching recommendations:', error);
        return throwError(() => new Error(error.error?.error || 'Error al buscar recomendaciones'));
      })
    );
  }

  /**
   * Get FAQs
   * @param category Optional category filter
   * @param limit Optional limit
   * @returns Observable<any>
   */
  getFAQs(category?: string, limit?: number): Observable<any> {
    const url = `${this.urlAccesos}${Constantes.api.chatbot.FAQs}`;
    let params = new HttpParams();
    
    if (category) params = params.set('category', category);
    if (limit) params = params.set('limit', limit.toString());

    return this.httpClient.get<any>(url, { params }).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error getting FAQs:', error);
        return throwError(() => new Error(error.error?.error || 'Error al obtener FAQs'));
      })
    );
  }

  /**
   * Get knowledge base articles
   * @param topic Optional topic filter
   * @param limit Optional limit
   * @returns Observable<any>
   */
  getKnowledgeBase(topic?: string, limit?: number): Observable<any> {
    const url = `${this.urlAccesos}${Constantes.api.chatbot.KnowledgeBase}`;
    let params = new HttpParams();
    
    if (topic) params = params.set('topic', topic);
    if (limit) params = params.set('limit', limit.toString());

    return this.httpClient.get<any>(url, { params }).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error getting knowledge base:', error);
        return throwError(() => new Error(error.error?.error || 'Error al obtener artículos'));
      })
    );
  }

  /**
   * Generate a session ID for conversation tracking
   * @returns string
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

