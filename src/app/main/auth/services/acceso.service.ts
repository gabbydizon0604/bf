import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import { Constantes } from 'src/app/core/data/constants';
import { ResponseModel } from 'src/app/core/models/response.model';
import { SwalAlertService } from 'src/app/shared/service/swal-alert.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MensajeEmailModel } from 'src/app/core/models/mensajeEmailModel.model';
import { ConvertDataHelper } from './convert-data-helper';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  urlAccesos = environment.urlIntegracion;

  constructor(private _httpClient: HttpClient,
    private _router: Router,
    private _swalAlertService: SwalAlertService,
    private _convertDataHelper: ConvertDataHelper
  ) {
  }

  obtenerPartidosPriorizados(criterioBusqueda: any): Observable<any> {
    const url = this.urlAccesos + Constantes.api.prioridadpartidos.getCriterio;
    const parametrosGet = this._convertDataHelper.obtenerParametrosGet(
      criterioBusqueda
    );

    return this._httpClient
    .get<any>(url, {
      params: parametrosGet
    })
    .pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError((error) => {
        console.log(error)
        // this._statusCodeResponseHelper.statusResponse(error);
        return error;
      })
    );
  }

 
}
