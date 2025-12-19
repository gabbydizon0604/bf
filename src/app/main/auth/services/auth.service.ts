import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
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
    const token = this.usuarioConectado.token;
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  login(usuario: UsuarioModel, recordar: boolean = false): Observable<ResponseModel> {
    let response: ResponseModel = new ResponseModel();
    const url = this.urlAccesos + Constantes.api.auth.Login;
    return this._httpClient.post(url, usuario)
      .pipe(
        map((resp: any) => {
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
          this._swalAlertService.swalEventoUrgente({ mensaje: err.error.message })
          throw new Error(err)
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
      if (data)
        this.usuarioConectado = JSON.parse(data);
    } else {

    }
  }

  actualizarStore(): void {
    localStorage.setItem('usuarioConectado', JSON.stringify(this.usuarioConectado));
  }
}
