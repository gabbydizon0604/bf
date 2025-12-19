import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
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
    
    // Only show splash screen for non-chatbot requests
    if (!isChatbotRequest) {
      this._fuseSplashScreenService.show();
    }
    
    // Only add Authorization header if:
    // 1. It's not a public endpoint (login, register, etc.)
    // 2. User has a valid token
    const token = this._authService.usuarioConectado?.token;
    const shouldAddAuth = !isPublicEndpoint && token;
    
    let clonedRequest = req;
    if (shouldAddAuth) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: Constantes.tipoSeguridad.bearToken + token
        }
      });
    }
    
    return next.handle(clonedRequest).pipe(
      finalize(() => {
        // Only hide splash screen if we showed it (non-chatbot requests)
        if (!isChatbotRequest) {
          this._fuseSplashScreenService.hide();
        }
      }
      )
    );
  }
}

