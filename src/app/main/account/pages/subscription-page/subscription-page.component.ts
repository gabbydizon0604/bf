import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Constantes } from 'src/app/core/data/constants';
import { BilleteraMovilPagadoModel } from 'src/app/core/models/billeteraMovilPagado.model';
import { SuscripcionModel } from 'src/app/core/models/suscripcion.model';
import { AuthService } from 'src/app/main/auth/services/auth.service';
import { ScriptService } from 'src/app/shared/service/script.service';
import { SwalAlertService } from 'src/app/shared/service/swal-alert.service';
import { AccountService } from '../../services/account.service';

// declare function suscribirseCulqi(): any;

@Component({
  selector: 'app-subscription-page',
  templateUrl: './subscription-page.component.html',
  styleUrls: ['./subscription-page.component.css']
})
export class SubscriptionPageComponent implements OnInit, AfterViewInit, OnDestroy {

  formularioEntidad: FormGroup;
  suscripcionModel: SuscripcionModel;
  billeteraMovilPagadoModel: BilleteraMovilPagadoModel;
  _unsubscribeAll: Subject<any>;
  suscriptoCulqi: boolean = false;
  billeteraMovilPagado: boolean = false;
  tipoMembresia: string = "";

  product = {
    description: 'Suscripción básica',
    amount: 10,
  };
  TOKEN_CULQI = '';

  constructor(
    private _scriptService: ScriptService,
    private _accountService: AccountService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _swalAlertService: SwalAlertService,
    private _datepipe: DatePipe) {
    this.suscripcionModel = new SuscripcionModel();
    this.billeteraMovilPagadoModel = new BilleteraMovilPagadoModel()
    this._unsubscribeAll = new Subject();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
    this._scriptService.removeScript('culqi');
  }

  async ngAfterViewInit(): Promise<void> {
    this._authService.cargarStorage();
    console.log(this._authService.usuarioConectado)
    if (this._authService.usuarioConectado.tipoLicencia == 'gratis') {
      this.tipoMembresia = 'gratis'
    } else {
      if (this._authService.usuarioConectado.suscripcionCulquiId != null) {
        this.cargarSuscripcion(this._authService.usuarioConectado.suscripcionCulquiId);
      }
      if (this._authService.usuarioConectado.billeteraMovilPagadoId != null) {
        this.cargarInfoBilleteraMovil(this._authService.usuarioConectado.billeteraMovilPagadoId);
      }
    }

  }

  cargarSuscripcion(pSuscripcionCulquiId: String): void {
    this._accountService.obtenerSuscripcionEntidad(pSuscripcionCulquiId)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(entidad => {
        this.suscriptoCulqi = true;
        this.suscripcionModel.correoElectronico = this._authService.usuarioConectado.correoElectronico;
        this.suscripcionModel.celular = this._authService.usuarioConectado.celular;
        this.suscripcionModel.numeroTarjeta = entidad.card.source.card_number;
        let fechaInicio = new Date(entidad.creation_date);
        this.suscripcionModel.fechaInicio = "Miembro desde " + String(this._datepipe.transform(fechaInicio, 'MMM YY'));
        let fechaFacturacion = new Date(entidad.next_billing_date);
        this.suscripcionModel.fechaProximaFacturacion = "Tu próxima fecha de facturación es el " + String(this._datepipe.transform(fechaFacturacion, 'dd MMM YY'));
        this.formularioEntidad.patchValue(this.suscripcionModel);
      });
  }

  cargarInfoBilleteraMovil(billeteraMovilPagadoId: String): void {
    this._accountService.obtenerInfoBilleteraMovilPagado(billeteraMovilPagadoId)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(entidad => {
        this.billeteraMovilPagado = true;
        this.billeteraMovilPagadoModel = entidad;
        this.billeteraMovilPagadoModel.correoElectronico = this._authService.usuarioConectado.correoElectronico;
        this.billeteraMovilPagadoModel.celular = this._authService.usuarioConectado.celular;
        let fechaVigencia = new Date(entidad.next_billing_date);
        this.billeteraMovilPagadoModel.fechaVigencia = "Tu vigencia de uso hasta el: " + String(this._datepipe.transform(fechaVigencia, 'dd MMM YY'));
        let fechaInicio = new Date(entidad.creation_date);
        this.billeteraMovilPagadoModel.fechaInicio = "Pago realizado el dia: " + String(this._datepipe.transform(fechaInicio, 'MMM YY'));
        // this.formularioEntidad.patchValue(this.suscripcionModel);
      });
  }

  ngOnInit(): void {
    this.formularioEntidad = this.crearFormularioEntidad();
    this._scriptService.loadScript('culqi', Constantes.culqi.path);
  }

  crearFormularioEntidad(): FormGroup {
    return this._formBuilder.group({
      correoElectronico: [this.suscripcionModel.correoElectronico],
      celular: [this.suscripcionModel.celular],
      numeroTarjeta: [this.suscripcionModel.numeroTarjeta],
      fechaInicio: [this.suscripcionModel.fechaInicio],
      fechaProximaFacturacion: [this.suscripcionModel.fechaProximaFacturacion],
    });
  }

  registrarSuscripcion(): void {
    // suscribirseCulqi();
  }

  cancelarSuscripcion(): void {
    this._swalAlertService.confirmarEliminar({
      titulo: '¿Desea eliminar la suscripción?'
    }).then((result: { value: any; }) => {
      if (result.value) {
        let cancelar = {
          suscripcionCulquiId: this._authService.usuarioConectado.suscripcionCulquiId,
          usuario: {
            _id: this._authService.usuarioConectado._id
          }
        };
        this._accountService.cancelarSuscripcionEntidad(cancelar)
          .pipe(
            takeUntil(this._unsubscribeAll)
          )
          .subscribe((response) => {

            this.suscriptoCulqi = false;
            this.suscripcionModel = new SuscripcionModel();
            this._authService.usuarioConectado.suscripcionCulquiId = '';
            this._authService.usuarioConectado.tarjetaCulquiId = '';
            this._authService.actualizarStore();
            this._swalAlertService.swalEventoExitoso({ mensaje: 'Se cancelo la suscripción correctamente.' });
          });
      }
    });
  }

  @HostListener('document:payment_event', ['$event'])
  onPaymentEventCustom($event: CustomEvent) {
    this.TOKEN_CULQI = $event.detail;
    let registrar = {
      usuario: {
        clienteCulquiId: this._authService.usuarioConectado.clienteCulquiId,
        _id: this._authService.usuarioConectado._id
      },
      token: this.TOKEN_CULQI
    };
    this._accountService.registrarSuscripcionEntidad(registrar)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((response) => {
        console.log('response registro');
        console.log(response);
        this._authService.usuarioConectado.suscripcionCulquiId = response.suscripcionCulquiId;
        this._authService.usuarioConectado.tarjetaCulquiId = response.tarjetaCulquiId;
        this._authService.actualizarStore();
        this._swalAlertService.swalEventoExitoso({ mensaje: 'Se registro correctamente su suscripción.' });
        this.cargarSuscripcion(response.suscripcionCulquiId);
      });
  }

  getControlLabel(type: string) {
    return this.formularioEntidad.controls[type].value;
  }
}
