import { Component, OnInit } from '@angular/core';
import { RecommendationsService } from '../../services/recommendations.service';
import { forkJoin, merge, Subject, takeUntil } from 'rxjs';
import { RecomendacionesModel } from 'src/app/core/models/recomendaciones.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  _unsubscribeAll: Subject<any>;
  recomendaciones: RecomendacionesModel[] = [];
  suscriptoCulqi: boolean = false;
  mensajeSuscriptoCulqi: string = '';

  constructor(
    private _recommendationsService: RecommendationsService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    const criterioBusqueda = {
      fecha: '10/09/2022',
      pageSize: 20
    };
    forkJoin([
      this._recommendationsService.obtenerListado(criterioBusqueda),
    ])
      .pipe(
        takeUntil(this._unsubscribeAll)

      )
      .subscribe((rest: any) => {
        console.log(rest)
        if (rest[0].resStatus != "ok") {
          this.mensajeSuscriptoCulqi = rest[0].resStatus;
          this.suscriptoCulqi = false;
        } else {
          this.recomendaciones = rest[0].resResult;
          this.suscriptoCulqi = true;
          this.mensajeSuscriptoCulqi = '';

        }
      });
  }

  ngOnDestroy() {
    if (this._unsubscribeAll !== undefined) {
      this._unsubscribeAll.unsubscribe();
    }
  }

}
