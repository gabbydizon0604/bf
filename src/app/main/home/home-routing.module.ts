import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TerminoCondicionesComponent } from 'src/app/shared/pages/terminos-condiciones/terminos-condiciones.component';


const routes: Routes = [
  {
      path: '', 
      component: HomePageComponent
  },
  {
    path: 'nosotros', 
    component: AboutPageComponent
  },
  {
    path: 'contacto', 
    component: ContactPageComponent
  },
  {
    path: 'termino-condiciones', 
    component: TerminoCondicionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
