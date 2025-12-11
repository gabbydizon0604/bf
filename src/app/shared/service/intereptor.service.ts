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
    
    // Only show splash screen for non-chatbot requests
    if (!isChatbotRequest) {
      this._fuseSplashScreenService.show();
    }
    
    return next.handle(req.clone({
      setHeaders: {
        Authorization: Constantes.tipoSeguridad.bearToken + this._authService.usuarioConectado.token
      }
    })).pipe(
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

