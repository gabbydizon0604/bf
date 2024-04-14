import { Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { AccountService } from 'src/app/main/account/services/account.service';
import { SwalAlertService } from 'src/app/shared/service/swal-alert.service';
import { appAnimations } from 'src/app/shared/utils/animation';
import { AuthService } from '../../services/auth.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
declare function convertirMetaAd(data: any): any;

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  usuarioModel: UsuarioModel;
  formularioEntidad: FormGroup;
  submitted = false;
  _unsubscribeAll: Subject<any>;
  TOKEN_CULQI = '';

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [];
  onlyCountries: CountryISO[] = [CountryISO.Peru, CountryISO.Chile, CountryISO.Ecuador, CountryISO.Bolivia, CountryISO.Argentina, CountryISO.Uruguay , CountryISO.Colombia, CountryISO.Spain];

  @ViewChild('nombreInput', { static: false }) nombreInput: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef
  @ViewChild('closeModal2') closeModal2: ElementRef

  constructor(private _formBuilder: FormBuilder,
    private _swalAlertService: SwalAlertService,
    private _router: Router,
    public _activatedRouted: ActivatedRoute,
    private _authService: AuthService,
    private _accountService: AccountService,

  ) {
    this.usuarioModel = new UsuarioModel();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.formularioEntidad = this.crearFormularioEntidad();
    // this.formularioEntidad.get('at')?.disable();
    setTimeout(() => {
      this.nombreInput.nativeElement.focus();
    }, 300);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formularioEntidad.controls;
  }

  crearFormularioEntidad(): FormGroup {
    return this._formBuilder.group({
      nombres: [this.usuarioModel.nombres, [Validators.required]],
      apellidos: [this.usuarioModel.apellidos, [Validators.required]],
      correoElectronico: [this.usuarioModel.correoElectronico, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      celular: [this.usuarioModel.celular, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      password: ['', Validators.required],
      aceptaTerminosCondiciones: [false, Validators.requiredTrue],
      aceptaTerminosDatosPersonales: [false, Validators.requiredTrue],
      tipoCliente: 'basico',
      informacion: '' 
    });
  }

  registrarme(): void {
    
    console.log('aqui')
    console.log(this.formularioEntidad.get('celular'))
    this.submitted = true;

    if (this.formularioEntidad.controls["celular"].errors) {
      alert('El número celular no es válido, verifique por favor.')
      return;
    }

    if (this.formularioEntidad.invalid) {
      return;
    }

    let data = this.formularioEntidad.getRawValue() as UsuarioModel;
    data.countryCode = this.formularioEntidad.get('celular')?.value.countryCode;
    data.dialCode = this.formularioEntidad.get('celular')?.value.dialCode;
    data.celular = this.formularioEntidad.get('celular')?.value.number.replaceAll(' ', '');
    data.correoElectronico = data.correoElectronico.toLowerCase();

    this._authService.registrarEntidad(data)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((response) => {
        convertirMetaAd({em: data.correoElectronico, ph: data.celular});
        // this._swalAlertService.swalEventoExitoso({ mensaje: 'Se registró correctamente su cuenta.' });
        this.ingresar(data);
      });
  }

  ingresar(data: UsuarioModel): void {
    this._authService.login(data, false)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((response) => {
        if (response.estado) {

          this._authService.usuarioConectado.suscripcionCulquiId = "";
          this._authService.usuarioConectado.tarjetaCulquiId = "";
          this._authService.actualizarStore();
          this._swalAlertService.swalEventoExitoso({ mensaje: 'Se registro correctamente su suscripción.' });
          this._router.navigate(['/cuenta/recomendacion']);
        }
        else {
          this._swalAlertService.swalEventoUrgente({ mensaje: response.mensaje });
        }
      });
  }

  @HostListener('document:payment_event', ['$event'])
  onPaymentEventCustom($event: CustomEvent) {
    console.log('this._authService.usuarioConectado')
    console.log(this._authService.usuarioConectado)
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
        // this.cargarSuscripcion(response.suscripcionCulquiId);
        this._router.navigate(['/cuenta/recomendacion']);
      });
  }

  aceptarCondiciones(): void {
    this.formularioEntidad.controls["aceptaTerminosCondiciones"].setValue(true);
    this.closeModal.nativeElement.click()
  }
  aceptarDatosPersonales(): void {
    this.formularioEntidad.controls["aceptaTerminosDatosPersonales"].setValue(true);
    this.closeModal2.nativeElement.click()
  }
}
