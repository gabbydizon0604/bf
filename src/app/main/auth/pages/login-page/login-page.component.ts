import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsuarioModel } from 'src/app/core/models/usuario.model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appAnimations } from 'src/app/shared/utils/animation';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SwalAlertService } from 'src/app/shared/service/swal-alert.service';
import { ForgorPasswordService } from '../../services/forgor-password.service';
import { MensajeEmailModel } from 'src/app/core/models/mensajeEmailModel.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: appAnimations
})

export class LoginPageComponent implements OnInit, AfterViewInit, OnDestroy {

  usuarioModel: UsuarioModel;
  formularioEntidad: FormGroup;
  formularioContrasenia: FormGroup;
  submitted = false;
  submittedContrasenia = false;
  recuperarContrasenia = false;
  @ViewChild('correoInput', { static: false }) correoInput: ElementRef;
  @ViewChild('correoOlvidoInput', { static: false }) correoOlvidoInput: ElementRef;
  _unsubscribeAll: Subject<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public _activatedRouted: ActivatedRoute,
    private _swalAlertService: SwalAlertService,
    private _authService: AuthService,
    private _forgorPassword: ForgorPasswordService,
  ) {
    this.usuarioModel = new UsuarioModel();
    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit(): void {
    this.usuarioModel.correoElectronico = localStorage.getItem('email') || '';
    if (this.usuarioModel.correoElectronico != '') {
      this.usuarioModel.password = String(localStorage.getItem('contrasenia'));
      this.usuarioModel.recuerdame = true;
      this.formularioEntidad.patchValue(this.usuarioModel);
    }
  }

  ngOnInit(): void {
    this.formularioEntidad = this.crearFormularioEntidad();
    this.formularioContrasenia = this.crearFormularioContraseniaEntidad();
    this._authService.logout();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  crearFormularioEntidad(): FormGroup {
    return this._formBuilder.group({
      correoElectronico: [this.usuarioModel.correoElectronico, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      password: [this.usuarioModel.password, [Validators.required]],
      recuerdame: [this.usuarioModel.recuerdame]
    });
  }

  crearFormularioContraseniaEntidad(): FormGroup {
    return this._formBuilder.group({
      to: [this.usuarioModel.correoElectronico, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
    });
  }

  ingresar(): void {
    this.submitted = true;
    if (this.formularioEntidad.invalid) {
      return;
    }
    let data = this.formularioEntidad.getRawValue() as UsuarioModel;
    data.correoElectronico = data.correoElectronico.toLowerCase()
    this._authService.login(data, Boolean(this.formularioEntidad.controls['recuerdame'].value))
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((response) => {
        if (response.estado) {
          if (this._authService.usuarioConectado.tipoLicencia == "gratis") {
            this._router.navigate(['/cuenta/recomendacion'], { relativeTo: this._activatedRouted });
          }
          else if (this._authService.usuarioConectado.suscripcionCulquiId != null)
            this._router.navigate(['/cuenta/recomendacion'], { relativeTo: this._activatedRouted });
          else {

            if (this._authService.usuarioConectado.billeteraMovilPagadoId != null) {
              this._router.navigate(['/cuenta/recomendacion'], { relativeTo: this._activatedRouted });
            } else {
              this._router.navigate(['/cuenta/suscripcion'], { relativeTo: this._activatedRouted });
            }
          }
        }
        else {
          this._swalAlertService.swalEventoUrgente({ mensaje: response.mensaje });
        }
      });
  }

  olvidoContrasenia(): void {
    this.submitted = false;
    this.formularioContrasenia.controls["to"].setValue('');
    this.recuperarContrasenia = true;
    setTimeout(() => {
      this.correoOlvidoInput.nativeElement.focus();
    }, 300);
  }

  cancelarContrasenia(): void {
    this.submittedContrasenia = false;
    this.recuperarContrasenia = false;
    setTimeout(() => {
      this.correoInput.nativeElement.focus();
    }, 300);
  }



  get f(): { [key: string]: AbstractControl } {
    return this.formularioEntidad.controls;
  }

  enviarEmailForgorPassword(): void {

    this.submitted = true
    if (this.formularioContrasenia.invalid) {
      return;
    }
    let data = this.formularioContrasenia.getRawValue() as MensajeEmailModel;
    data.to = data.to.toLowerCase();
    this._forgorPassword.forgorPassword(data)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((response: any) => {
        if (response.resStatus == 'ok') {
          this._swalAlertService.swalEventoExitoso({ mensaje: 'Revise su correo electronico, se le ha enviado un enlace para crear una nueva contraseña' });
        }
      });
  }
}
