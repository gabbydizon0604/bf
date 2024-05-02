import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConvertDataHelper {

    constructor() {
    }
    obtenerParametrosGet(criterioBusqueda: any): any {
        let params: HttpParams = new HttpParams();
        for (const key of Object.keys(criterioBusqueda)) {
            if (criterioBusqueda[key] instanceof Array) {
                criterioBusqueda[key].forEach((item: any) => {
                    params = params.append(`${key.toString()}[]`, item);
                });
            } else {
                params = params.append(key.toString(), criterioBusqueda[key]);
            }            
        }
        return params;
    }
}
