import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginGuardGuard } from './shared/guards/login-guard.guard';
import { BodyAccountPageComponent } from './shared/pages/body-account-page/body-account-page.component';
import { BodyPageComponent } from './shared/pages/body-page/body-page.component';
import { BodyHomePageComponent } from './shared/pages/body-home-page/body-home-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import(`./main/auth/auth.module`).then(m => m.AuthModule),
  },
  {
    path: 'cuenta',
    component: BodyAccountPageComponent,
    loadChildren: () => import(`./main/account/account.module`).then(m => m.AccountModule),
    canActivate: [LoginGuardGuard]

  },
  // {
  //   path: 'home',
  //   component: BodyHomePageComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./main/home/home.module').then((m) => m.HomeModule)
  //     }
  //   ]
  // },
  {
    path: 'page',
    component: BodyPageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./main/home/home.module').then((m) => m.HomeModule)
      }
    ]
  },
  {
    path: '',
    component: BodyHomePageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./main/home/home.module').then((m) => m.HomeModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
