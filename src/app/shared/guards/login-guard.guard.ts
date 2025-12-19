import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from 'src/app/main/auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

    constructor(
        private _authService: AuthService,
        public router: Router
    ) { }

    token: string;
    listadoAccesos: any;

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('[LoginGuardGuard] Checking route access:', state.url);
        
        // Ensure storage is loaded before checking
        this._authService.cargarStorage();
        
        const isAuthenticated = this._authService.isAuthenticated();
        console.log('[LoginGuardGuard] Authentication status:', isAuthenticated);

        if (!isAuthenticated) {
            console.log('[LoginGuardGuard] Access DENIED: User not authenticated. Redirecting to /auth/login');
            console.log('[LoginGuardGuard] Attempted URL:', state.url);
            this.router.navigate(['/auth/login']);
            return false;
        }
        
        console.log('[LoginGuardGuard] Access ALLOWED: User authenticated');
        return true;
    }
}
