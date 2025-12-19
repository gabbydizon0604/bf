import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/main/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService  {

  constructor(
    private _authService: AuthService,
    public _activatedRouted: ActivatedRoute,
    private _router: Router) { 
      this._authService.cargarStorage()
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkUserLogin();
  }

  checkUserLogin() : boolean {
    if(this._authService.usuarioConectado == undefined){
      this._router.navigate(['/auth/login'], { relativeTo: this._activatedRouted });
      return false;
    }
    else if(this._authService.usuarioConectado._id == null || this._authService.usuarioConectado._id == '') {
      this._router.navigate(['/auth/login'], { relativeTo: this._activatedRouted });
      return false;
    }
    else return true;
  }
} 
