import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Constantes } from 'src/app/core/data/constants';
import { AuthService } from 'src/app/main/auth/services/auth.service';
import { FuseSplashScreenService } from './splash-screen.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _fuseSplashScreenService: FuseSplashScreenService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._authService.cargarStorage();
    
    // Check if this is a chatbot API request - don't show splash screen for chatbot
    const isChatbotRequest = req.url.includes('/api/chatbot/');
    
    // List of public endpoints that don't require authentication
    const publicEndpoints = [
      '/api/Login/Login',
      '/api/usuario/registrar',
      '/api/forgorpassword/recuperarPasswordEmail',
      '/api/forgorpassword/resetPassword',
      '/api/email/enviarmensajesoporte',
      '/api/libro-reclamaciones/registrar',
      '/api/libro-reclamaciones/get'
    ];
    
    // Check if this is a public endpoint (login, register, etc.)
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
    
    // Log headers for login requests to verify Content-Type is preserved
    if (req.url.includes('/api/Login/Login')) {
      console.log('[Interceptor] ===== LOGIN REQUEST HEADERS =====');
      console.log('[Interceptor] Request URL:', req.url);
      console.log('[Interceptor] Request method:', req.method);
      console.log('[Interceptor] All headers:', req.headers.keys());
      console.log('[Interceptor] Content-Type:', req.headers.get('Content-Type'));
      console.log('[Interceptor] Authorization:', req.headers.get('Authorization') || 'NOT SET (public endpoint)');
      console.log('[Interceptor] Is public endpoint:', isPublicEndpoint);
      console.log('[Interceptor] ===================================');
    }
    
    // Only show splash screen for non-chatbot requests
    if (!isChatbotRequest) {
      this._fuseSplashScreenService.show();
    }
    
    // Only add Authorization header if:
    // 1. It's not a public endpoint (login, register, etc.)
    // 2. User has a valid token
    const token = this._authService.usuarioConectado?.token;
    const shouldAddAuth = !isPublicEndpoint && token;
    
    // For public endpoints (like login), preserve all original headers including Content-Type
    // setHeaders is additive - it adds new headers without removing existing ones
    let clonedRequest = req;
    if (shouldAddAuth) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: Constantes.tipoSeguridad.bearToken + token
        }
      });
    }
    // For public endpoints, clonedRequest = req (no modification, all headers preserved)
    
    // Log final headers for login requests
    if (req.url.includes('/api/Login/Login')) {
      console.log('[Interceptor] ===== FINAL REQUEST HEADERS =====');
      console.log('[Interceptor] Content-Type:', clonedRequest.headers.get('Content-Type'));
      console.log('[Interceptor] Authorization:', clonedRequest.headers.get('Authorization') || 'NOT SET (public endpoint)');
      console.log('[Interceptor] Request modified:', clonedRequest !== req);
      console.log('[Interceptor] =================================');
    }
    
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log HTTP errors with detailed information
        this.logHttpError(error, clonedRequest);
        return throwError(() => error);
      }),
      finalize(() => {
        // Only hide splash screen if we showed it (non-chatbot requests)
        if (!isChatbotRequest) {
          this._fuseSplashScreenService.hide();
        }
      }
      )
    );
  }

  /**
   * Log HTTP errors with detailed information including backend validation messages
   */
  private logHttpError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    console.error('[Interceptor] ===== HTTP ERROR =====');
    console.error('[Interceptor] Request URL:', request.url);
    console.error('[Interceptor] Request method:', request.method);
    console.error('[Interceptor] Error status:', error.status);
    console.error('[Interceptor] Error statusText:', error.statusText);
    
    // Log complete error.error object (backend response body)
    console.error('[Interceptor] ===== BACKEND ERROR RESPONSE =====');
    if (error.error) {
      console.error('[Interceptor] Full error.error object:', error.error);
      console.error('[Interceptor] Error response (JSON):', JSON.stringify(error.error, null, 2));
      
      // Display backend validation messages if present (400 BadRequest)
      if (error.status === 400 && error.error.errors && typeof error.error.errors === 'object') {
        console.error('[Interceptor] ===== VALIDATION ERRORS =====');
        const validationErrors = error.error.errors;
        const errorFields = Object.keys(validationErrors);
        
        errorFields.forEach(field => {
          const fieldErrors = validationErrors[field];
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((errorMsg: string) => {
              console.error(`[Interceptor] ❌ ${field}: ${errorMsg}`);
            });
          } else {
            console.error(`[Interceptor] ❌ ${field}:`, fieldErrors);
          }
        });
        
        console.error('[Interceptor] =================================');
      }
      
      // Log other error details
      if (error.error.message) {
        console.error('[Interceptor] Error message:', error.error.message);
      }
      if (error.error.type) {
        console.error('[Interceptor] Error type:', error.error.type);
      }
      if (error.error.title) {
        console.error('[Interceptor] Error title:', error.error.title);
      }
      if (error.error.traceId) {
        console.error('[Interceptor] Trace ID:', error.error.traceId);
      }
    } else {
      console.error('[Interceptor] No error.error object found');
    }
    
    console.error('[Interceptor] ========================================');
  }
}

