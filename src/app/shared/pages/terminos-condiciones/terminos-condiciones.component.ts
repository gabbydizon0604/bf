import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss']
})
export class TerminoCondicionesComponent {

  nombreCompleto = new FormControl('', [Validators.required]);
  tipo_documento = new FormControl('', [Validators.required]);
  direccion = new FormControl('', [Validators.required]);
  numero_documento = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  telefono = new FormControl('', [Validators.required]);
  tipoReclamo = new FormControl('', [Validators.required]);
  comprobanteTipo = new FormControl('', [Validators.required]);
  num_comprobante = new FormControl('', [Validators.required]);
  detalle_producto = new FormControl('', [Validators.required]);
  detalle_reclamo = new FormControl('', [Validators.required]);
  num_reclamo = new FormControl('');
  acciones_reclamo = new FormControl('');
  
  constructor(
    private _httpClient: HttpClient,
  ) {
  }
  // Contact Popup
  isOpen = false;
  showAlert= false;
  showLoading = false;
  openPopup(): void {
    this.isOpen = true;
  }

  closePopup(): void {
    console.log('close 8')

    this.isOpen = false;
}
  enviarMensajeFooter(): void {
    console.log('datos')
    if(this.nombreCompleto.invalid || 
      this.tipo_documento.invalid ||
      this.direccion.invalid ||
      this.numero_documento.invalid ||
      this.email.invalid ||
      this.telefono.invalid ||
      this.tipoReclamo.invalid ||
      this.comprobanteTipo.invalid ||
      this.num_comprobante.invalid ||
      this.detalle_producto.invalid ||  
      this.detalle_reclamo.invalid  ){
        alert("Debe ingresar o seleleccionar todos los campos obligatorios")
      return ;
    }
    this.showLoading = true;

    const data = {
        nombre_completo: this.nombreCompleto.value,
        tipo_documento: this.tipo_documento.value,
        direccion: this.direccion.value,
        numero_documento: this.numero_documento.value,
        email: this.email.value,
        telefono: this.telefono.value,
        tipo_reclamo: this.tipoReclamo.value,
        tipo_comprobante: this.comprobanteTipo.value,
        num_comprobante: this.num_comprobante.value,
        detalle_producto: this.detalle_producto.value,
        detalle_reclamo: this.detalle_reclamo.value
    };

    console.log("data");
    console.log(data);

    this.guardarLibroReclamaciones(data).subscribe((s) => {
      let mensajeSwal = 'Se registro con éxito su reclamo, por favor revis su correo electronico para tener más detalle';
      this.isOpen = false;
      this.showLoading = false;
      this.showAlert = true;
      setTimeout(() => { this.showAlert = false }, 5000);
      this.nombreCompleto.setValue("");
      tipo_documento: this.tipo_documento.setValue("");
      this.direccion.setValue("");
      this.numero_documento.setValue("");
      this.email.setValue("");
      this.telefono.setValue("");
      this.tipoReclamo.setValue("");
      this.comprobanteTipo.setValue("");
      this.num_comprobante.setValue("");
      this.detalle_producto.setValue("");
      this.detalle_reclamo.setValue("");
    }, (error) => {
      console.log('oops', error)
    });

  }

  consultarReclamo(): void { 
    this.consultaReclamo().subscribe((s) => {
      let mensajeSwal = 'Se registro con éxito su reclamo, por favor revis su correo electronico para tener más detalle';
      this.isOpen = false;
      this.showLoading = false;
      this.acciones_reclamo.setValue(s.accion_adoptada)
      this.acciones_reclamo = new FormControl(s.accion_adoptada);
      
    }, (error) => {
      console.log('oops', error)
    });
  }

  guardarLibroReclamaciones(data: any): Observable<any> {
    const url = `${environment.urlIntegracion}/api/libro-reclamaciones/registrar`;

    return this._httpClient
      .post<any>(url, data, {})
      .pipe(
        map((resp: any) => {
          console.log(resp);
          return resp;
        }),
        catchError((error: any) => {
          console.log(error);
          return error;
        })
      );
  }

  consultaReclamo( ): Observable<any> {
    const url = `${environment.urlIntegracion}/api/libro-reclamaciones/get/${this.num_reclamo.value}`;

    return this._httpClient
      .get<any>(url, {})
      .pipe(
        map((resp: any) => {
          console.log(resp.accion_adoptada);
          
          return resp;
        }),
        catchError((error: any) => {
          console.log(error);
          return error;
        })
      );
  }
}


