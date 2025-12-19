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
    console.log('[GuardService] Checking route access:', state.url);
    // Ensure storage is loaded before checking
    this._authService.cargarStorage();
    const result = this.checkUserLogin(state.url);
    console.log('[GuardService] Route access result:', result ? 'ALLOWED' : 'DENIED');
    return result;
  }

  checkUserLogin(attemptedUrl: string): boolean {
    // Load storage to ensure we have the latest user data
    this._authService.cargarStorage();
    
    if(this._authService.usuarioConectado == undefined || this._authService.usuarioConectado == null){
      console.log('[GuardService] Access DENIED: User not connected. Redirecting to /auth/login');
      console.log('[GuardService] Attempted URL:', attemptedUrl);
      this._router.navigate(['/auth/login']);
      return false;
    }
    else if(this._authService.usuarioConectado._id == null || this._authService.usuarioConectado._id == '') {
      console.log('[GuardService] Access DENIED: User ID is null or empty. Redirecting to /auth/login');
      console.log('[GuardService] Attempted URL:', attemptedUrl);
      this._router.navigate(['/auth/login']);
      return false;
    }
    else {
      console.log('[GuardService] Access ALLOWED: User authenticated. User ID:', this._authService.usuarioConectado._id);
      return true;
    }
  }
} 
