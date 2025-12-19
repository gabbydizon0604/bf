import { Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MensajeEmailModel } from 'src/app/core/models/mensajeEmailModel.model';
import { AccountService } from 'src/app/main/account/services/account.service';
import { SwalAlertService } from 'src/app/shared/service/swal-alert.service';
import { appAnimations } from 'src/app/shared/utils/animation';
import { AuthService } from '../../services/auth.service';
import { ForgorPasswordService } from '../../services/forgor-password.service';

// declare function suscribirseCulqi(): any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {

  mensajeEmailModel: MensajeEmailModel;
  formularioContrasenia: FormGroup;
  submittedContrasenia = false;
  _unsubscribeAll: Subject<any>;
  userid: any = '';
  token: any = '';

  fieldTextType: any = false;
  fieldTextTypeConfirm: any = false;

  constructor(private _formBuilder: FormBuilder,
    private _swalAlertService: SwalAlertService,
    private _router: Router,
    public _activatedRouted: ActivatedRoute,
    private _forgorPassword: ForgorPasswordService,
    private _accountService: AccountService,

  ) {
    this.mensajeEmailModel = new MensajeEmailModel();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.userid = this._activatedRouted.snapshot.paramMap.get('userid');
    this.token = this._activatedRouted.snapshot.paramMap.get('token');
    this.formularioContrasenia = this.crearformularioContrasenia();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formularioContrasenia.controls;
  }

  crearformularioContrasenia(): FormGroup {
    return this._formBuilder.group({
      password: ['', [Validators.required]],
      tokenResetPassword: [this.token, [Validators.required]],
      _id: [this.userid, [Validators.required]],
      repitPassword: ['', [Validators.required, confirmPasswordValidator]]
    });
  }

  enviarNuevoPassword(): void {

    console.log(this.formularioContrasenia.get('repitPassword')?.errors?.required);
    this.submittedContrasenia = true
    if (this.formularioContrasenia.invalid) {
      return;
    }
    let data = this.formularioContrasenia.getRawValue() as MensajeEmailModel;
    this._forgorPassword.resetPassword(data)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((response) => {
        this._swalAlertService.swalEventoExitoso({ mensaje: 'Su contraseña ha sido cambiado con éxito, vuelva ingresar a la plataforma' });
        this._router.navigate(['/auth/login'], { relativeTo: this._activatedRouted });
      });
  }


  showHidePassConfirm(): void {
    this.fieldTextTypeConfirm = !this.fieldTextTypeConfirm
  }
  showHidePass(): void {
    this.fieldTextType = !this.fieldTextType
  }

}


export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('repitPassword');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};