import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BodyHomePageComponent } from 'src/app/shared/pages/body-home-page/body-home-page.component';
import { TerminoCondicionesComponent } from 'src/app/shared/pages/terminos-condiciones/terminos-condiciones.component';

@NgModule({
  declarations: [
    HomePageComponent,
    AboutPageComponent,
    ContactPageComponent,
    BodyHomePageComponent,
    TerminoCondicionesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    CarouselModule
  ],
  exports: [
    HomePageComponent
  ]
})
export class HomeModule { }
