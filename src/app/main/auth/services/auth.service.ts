import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Constantes } from 'src/app/core/data/constants';
import { ResponseModel } from 'src/app/core/models/response.model';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { SwalAlertService } from 'src/app/shared/service/swal-alert.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioConectado: UsuarioModel;
  urlAccesos = environment.urlIntegracion;

  constructor(private _httpClient: HttpClient,
    private _router: Router,
    private _swalAlertService: SwalAlertService,
    public jwtHelper: JwtHelperService
  ) {
    this.usuarioConectado = new UsuarioModel();
    this.cargarStorage();
  }

  logout(): void {
    this.usuarioConectado = new UsuarioModel();
    localStorage.removeItem('usuarioConectado');
    this._router.navigate(['/auth/login']);
  }

  // tieneToken(): boolean {
  //   return (this.usuarioConectado != undefined && this.usuarioConectado.token.length > 5) ? true : false;
  // }

  isAuthenticated(): boolean {
    // First ensure we have loaded from storage
    if (!this.usuarioConectado || !this.usuarioConectado.token) {
      this.cargarStorage();
    }
    const token = this.usuarioConectado?.token;
    if (!token) {
      return false;
    }
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  login(usuario: UsuarioModel, recordar: boolean = false): Observable<ResponseModel> {
    let response: ResponseModel = new ResponseModel();
    const url = this.urlAccesos + Constantes.api.auth.Login;
    
    // Validate input before sending
    if (!usuario.correoElectronico || !usuario.password) {
      const errorMsg = !usuario.correoElectronico 
        ? 'El correo electrónico es requerido.' 
        : 'La contraseña es requerida.';
      console.error('[AuthService] Validation failed:', errorMsg);
      response.estado = false;
      response.mensaje = errorMsg;
      this._swalAlertService.swalEventoUrgente({ mensaje: errorMsg });
      return of(response);
    }
    
    // Prepare the request payload - only send what backend expects
    // Backend DTO: { correoElectronico: string, password: string }
    // Backend validation: if (!correoElectronico || !password) returns 400
    // IMPORTANT: Password must NOT be trimmed - bcrypt.compareSync requires exact match
    // Email is trimmed and lowercased to ensure consistent format
    const emailTrimmed = usuario.correoElectronico.trim().toLowerCase();
    
    // Validate email after trimming (catches whitespace-only input)
    if (!emailTrimmed) {
      console.error('[AuthService] Validation failed: Email is empty after trimming');
      response.estado = false;
      response.mensaje = 'El correo electrónico es requerido.';
      this._swalAlertService.swalEventoUrgente({ mensaje: 'El correo electrónico es requerido.' });
      return of(response);
    }
    
    const loginPayload = {
      correoElectronico: emailTrimmed,
      password: usuario.password  // DO NOT trim - preserves exact user input for bcrypt comparison
    };
    
    // Log request details for debugging
    console.log('[AuthService] ===== LOGIN REQUEST =====');
    console.log('[AuthService] URL:', url);
    console.log('[AuthService] Request Headers:', {
      'Content-Type': 'application/json',
      'Authorization': 'NOT SET (public endpoint)'
    });
    console.log('[AuthService] Request Payload (sanitized):', {
      correoElectronico: loginPayload.correoElectronico ? 
        `${loginPayload.correoElectronico.substring(0, 3)}***${loginPayload.correoElectronico.substring(loginPayload.correoElectronico.indexOf('@'))}` : 
        'MISSING',
      password: loginPayload.password ? '***' : 'MISSING',
      hasEmail: !!loginPayload.correoElectronico,
      hasPassword: !!loginPayload.password,
      emailLength: loginPayload.correoElectronico?.length || 0,
      passwordLength: loginPayload.password?.length || 0
    });
    console.log('[AuthService] Full payload JSON:', JSON.stringify(loginPayload));
    console.log('[AuthService] =======================');
    
    return this._httpClient.post(url, loginPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .pipe(
        map((resp: any) => {
          console.log('[AuthService] ===== LOGIN RESPONSE =====');
          console.log('[AuthService] Response status: SUCCESS');
          console.log('[AuthService] Response has token:', !!resp.token);
          console.log('[AuthService] Response has usuario:', !!resp.usuario);
          if (resp.usuario) {
            console.log('[AuthService] Usuario ID:', resp.usuario._id);
            console.log('[AuthService] Usuario email:', resp.usuario.correoElectronico);
          }
          console.log('[AuthService] =======================');
          
          if (resp.token) {
            if (recordar) {
              localStorage.setItem('email', usuario.correoElectronico);
              localStorage.setItem('contrasenia', usuario.password);
            }
            this.usuarioConectado = resp.usuario;
            this.usuarioConectado.token = resp.token;
            response.estado = true;
            localStorage.setItem('usuarioConectado', JSON.stringify(this.usuarioConectado));
            localStorage.setItem('token', this.usuarioConectado.token);
            return response;
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('contrasenia');
            response.estado = false;
            response.mensaje = resp.message;
            return response;
          }
        }),
        catchError(err => {
          console.error('[AuthService] ===== LOGIN ERROR =====');
          console.error('[AuthService] Error status:', err.status);
          console.error('[AuthService] Error statusText:', err.statusText);
          console.error('[AuthService] Error URL:', err.url);
          console.error('[AuthService] Error message:', err.message);
          
          // Log complete error.error object (backend response body)
          console.error('[AuthService] ===== BACKEND ERROR RESPONSE =====');
          if (err.error) {
            console.error('[AuthService] Full error.error object:', err.error);
            console.error('[AuthService] Error response (JSON):', JSON.stringify(err.error, null, 2));
            
            // Display backend validation messages if present
            if (err.error.errors && typeof err.error.errors === 'object') {
              console.error('[AuthService] ===== VALIDATION ERRORS =====');
              const validationErrors = err.error.errors;
              const errorFields = Object.keys(validationErrors);
              
              errorFields.forEach(field => {
                const fieldErrors = validationErrors[field];
                if (Array.isArray(fieldErrors)) {
                  fieldErrors.forEach((errorMsg: string) => {
                    console.error(`[AuthService] ❌ ${field}: ${errorMsg}`);
                  });
                } else {
                  console.error(`[AuthService] ❌ ${field}:`, fieldErrors);
                }
              });
              
              console.error('[AuthService] =================================');
            }
            
            // Log other error details
            if (err.error.message) {
              console.error('[AuthService] Error message:', err.error.message);
            }
            if (err.error.type) {
              console.error('[AuthService] Error type:', err.error.type);
            }
            if (err.error.title) {
              console.error('[AuthService] Error title:', err.error.title);
            }
            if (err.error.traceId) {
              console.error('[AuthService] Trace ID:', err.error.traceId);
            }
          } else {
            console.error('[AuthService] No error.error object found');
          }
          console.error('[AuthService] ========================================');
          console.error('[AuthService] ========================================');
          
          // Extract user-friendly error message
          let errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          
          // Prioritize validation error messages
          if (err.error?.errors && typeof err.error.errors === 'object') {
            const validationErrors = err.error.errors;
            const errorFields = Object.keys(validationErrors);
            
            // Get first validation error message
            if (errorFields.length > 0) {
              const firstField = errorFields[0];
              const firstFieldErrors = validationErrors[firstField];
              if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
                errorMessage = firstFieldErrors[0];
              } else if (typeof firstFieldErrors === 'string') {
                errorMessage = firstFieldErrors;
              }
            }
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          this._swalAlertService.swalEventoUrgente({ mensaje: errorMessage });
          response.estado = false;
          response.mensaje = errorMessage;
          return of(response);
        })
      )
  }

  registrarEntidad(usuario: UsuarioModel): Observable<any> {
    const url = this.urlAccesos + Constantes.api.usuario.Registro;
    console.log(usuario);
    return this._httpClient.post(url, usuario)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError(err => {
          console.log(err);
          if (err.error.resError)
            this._swalAlertService.swalEventoUrgente({ mensaje: err.error.resError[0].message });
          else
            this._swalAlertService.swalEventoUrgente({ mensaje: err.error.msg });
          throw new Error(err)
        })
      )
  }

  cargarStorage(): void {
    if (localStorage.getItem('usuarioConectado')) {
      let data = localStorage.getItem('usuarioConectado');
      if (data) {
        try {
          this.usuarioConectado = JSON.parse(data);
          // Also load token from localStorage if available
          const token = localStorage.getItem('token');
          if (token && this.usuarioConectado) {
            this.usuarioConectado.token = token;
          }
        } catch (error) {
          console.error('Error parsing usuarioConectado from localStorage:', error);
          this.usuarioConectado = new UsuarioModel();
        }
      }
    } else {
      // Load token if available even without usuarioConectado
      const token = localStorage.getItem('token');
      if (token && this.usuarioConectado) {
        this.usuarioConectado.token = token;
      }
    }
  }

  actualizarStore(): void {
    localStorage.setItem('usuarioConectado', JSON.stringify(this.usuarioConectado));
  }
}
