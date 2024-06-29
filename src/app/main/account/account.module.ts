import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SubscriptionPageComponent } from './pages/subscription-page/subscription-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import { EventLigaPageComponent } from './pages/event-liga-page/event-liga-page.component';
import { TableroPosicionesPageComponent } from './pages/tablero-posiciones-page/tablero-posiciones-page.component';
import { PartidosJugarPageComponent } from './pages/partidos-jugar/partidos-jugar-page.component';
import { ResultadosPageComponent } from './pages/resultados/resultados-page.component';
import { DetallePrediccionesComponent } from './pages/shared/detalle-prediccion/detalle-prediccion.component';

@NgModule({
  declarations: [
    SubscriptionPageComponent,
    ProfilePageComponent,
    EventLigaPageComponent,
    TableroPosicionesPageComponent,
    PartidosJugarPageComponent,
    ResultadosPageComponent,
    DetallePrediccionesComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DatePipe
  ],
  exports: [
    DetallePrediccionesComponent
  ]
})
export class AccountModule { }
