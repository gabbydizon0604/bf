import { Component, OnInit } from '@angular/core';
import { RecommendationsService } from '../../services/recommendations.service';
import { forkJoin, merge, Subject, takeUntil, BehaviorSubject, fromEvent, debounceTime } from 'rxjs';
import { TableroPosicionesModel } from 'src/app/core/models/tableroLiga.model';
import { TableroPosicionesService } from '../../services/tableroPosiciones.service';
import { DetallePrediccionesComponent } from '../shared/detalle-prediccion/detalle-prediccion.component';

@Component({
  selector: 'app-tablero-posiciones-page',
  templateUrl: './tablero-posiciones-page.component.html',
  styleUrls: ['./tablero-posiciones-page.component.css']
})
export class TableroPosicionesPageComponent implements OnInit {

  _unsubscribeAll: Subject<any>;
  tableroPosiciones: TableroPosicionesModel[] = [];
  listadoLiga: any[] = [];
  equiposLocales: any[] = [];
  equiposVisitas: any[] = [];
  suscriptoCulqi: boolean = true;
  mensajeSuscriptoCulqi: string = '';

  strLeague: any[] = [];
  strLeagueSelected: any;
  activeTab:any = 'Resumen';
  tipoMercado: any = 'Mercado';

  public screenWidth$: BehaviorSubject<any> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<any> = new BehaviorSubject(null);
  private _unsubscriber$: Subject<any> = new Subject();
  

  constructor(
    private _tableroPosicionesService: TableroPosicionesService,
  ) {
    this._unsubscribeAll = new Subject();
    console.log('TableroPosicionesPageComponent')
    this.init();
  }

  ngOnInit(): void {
    const criterioBusqueda2 = {
      pageSize: 20
    };
    forkJoin([
      this._tableroPosicionesService.obtenerMaestros(criterioBusqueda2),
    ])
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((rest: any) => {

        if (rest[0].resStatus != "ok") {
          this.mensajeSuscriptoCulqi = rest[0].resStatus;
          this.suscriptoCulqi = false;
        } else {

          let strLeagueAll: any[] = [{
            id: null,
            descripcion: 'Todas'
          }];

          rest[0].strLeague.forEach((element: any) => {
            strLeagueAll.push({
              id: element,
              descripcion: element
            })
          });
          this.strLeague = strLeagueAll
          this.strLeagueSelected = null
          this.suscriptoCulqi = true;
          this.mensajeSuscriptoCulqi = '';
          this.getData()
        }
      });
  }

  getData() {
    const criterioBusqueda = {
      strLeague: this.strLeagueSelected
    };
    forkJoin([
      this._tableroPosicionesService.obtenerListado(criterioBusqueda),
    ])
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((rest: any) => {


        rest[0].resResult.forEach((element: any) => {
          // if (element.cornersProbabilidadMas7 < 70) {
          //   element.labelCornersProbabilidadMas7 = 'rojo'
          // } else if (element.cornersProbabilidadMas7 >= 70 && element.cornersProbabilidadMas7 < 75) {
          //   element.labelCornersProbabilidadMas7 = 'amarilloSuave'
          // } 
          // else if (element.cornersProbabilidadMas7 >= 75 && element.cornersProbabilidadMas7 <= 77) {
          //   element.labelCornersProbabilidadMas7 = 'amarilloIntenso'
          // } else if (element.cornersProbabilidadMas7 > 77 && element.cornersProbabilidadMas7 <= 82) {
          //   element.labelCornersProbabilidadMas7 = 'verdeSuave'
          // } 
          // else {
          //   element.labelCornersProbabilidadMas7 = 'verdeIntenso'
          // }
          element = this.calcularLabelPorcentajes(element, 'cornersProbabilidadMas7', 'labelCornersProbabilidadMas7')
          element = this.calcularLabelPorcentajes(element, 'golesProbabilidadMas1', 'labelGolesProbabilidadMas1')
          element = this.calcularLabelPorcentajes(element, 'tirosaporteriaProb6', 'labelTirosaporteriaProb6')
          element = this.calcularLabelPorcentajes(element, 'tarjetasProbabilidad3', 'labelTarjetasProbabilidad3')
          element = this.calcularLabelPorcentajes(element, 'cornersLocalProbMas5', 'labelCornersLocalProbMas5')
          element = this.calcularLabelPorcentajes(element, 'golesLocalProbMas1', 'labelGolesLocalProbMas1')
          element = this.calcularLabelPorcentajes(element, 'tirosaporteriaLocalProb5', 'labelTirosaporteriaLocalProb5')
          element = this.calcularLabelPorcentajes(element, 'tarjetasLocalProb2', 'labelTarjetasLocalProb2')
        });

        rest[0].resResult.forEach((element: any) => {

          if (element.posicionLocal >= 1 && element.posicionLocal <= 5) {
            element.colorPosicionLocal = 'colorPosicionLocalPrimeros'
          }
          if (element.posicionLocal >= 6 && element.posicionLocal <= 10) {
            element.colorPosicionLocal = 'colorPosicionLocalSegundos'
          }
          if (element.posicionLocal >= 11 && element.posicionLocal <= 15) {
            element.colorPosicionLocal = 'colorPosicionLocalTerceros'
          }
          if (element.posicionLocal >= 16) {
            element.colorPosicionLocal = 'colorPosicionLocalCuartos'
          }

          if (element.posicionVisita >= 1 && element.posicionVisita <= 5) {
            element.colorPosicionVisita = 'colorPosicionLocalPrimeros'
          }
          if (element.posicionVisita >= 6 && element.posicionVisita <= 10) {
            element.colorPosicionVisita = 'colorPosicionLocalSegundos'
          }
          if (element.posicionVisita >= 11 && element.posicionVisita <= 15) {
            element.colorPosicionVisita = 'colorPosicionLocalTerceros'
          }
          if (element.posicionVisita >= 16) {
            element.colorPosicionVisita = 'colorPosicionLocalCuartos'
          }
        });

        this.tableroPosiciones = rest[0].resResult;
      });
  }

  onChange(): void {
    this.getData();
  }

  calcularLabelPorcentajes(element: any, atributo: any, label:any):void {
    if (element[atributo] < 70) {
      element[label] = 'rojo'
    } else if (element[atributo] >= 70 && element[atributo] < 75) {
      element[label] = 'amarilloSuave'
    } 
    else if (element[atributo] >= 75 && element[atributo] <= 77) {
      element[label] = 'amarilloIntenso'
    } else if (element[atributo] > 77 && element[atributo] <= 82) {
      element[label] = 'verdeSuave'
    } 
    else {
      element[label] = 'verdeIntenso'
    }

    return element;
  }

  init() {
    this._setScreenWidth(window.innerWidth);
    this._setMediaBreakpoint(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(1000),
        takeUntil(this._unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
        this._setMediaBreakpoint(evt.target.innerWidth);
      });
  }

  _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
  }

  _setMediaBreakpoint(width: number): void {
    if (width < 576) {
      this.mediaBreakpoint$.next('xs');
    } else if (width >= 576 && width < 768) {
      this.mediaBreakpoint$.next('sm');
    } else if (width >= 768 && width < 992) {
      this.mediaBreakpoint$.next('md');
    } else if (width >= 992 && width < 1200) {
      this.mediaBreakpoint$.next('lg');
    } else if (width >= 1200 && width < 1600) {
      this.mediaBreakpoint$.next('xl');
    } else {
      this.mediaBreakpoint$.next('xxl');
    }

    console.log('this.mediaBreakpoint$')
    console.log(this.mediaBreakpoint$.value)
    console.log(this.screenWidth$.value)

  }
  ngOnDestroy() {
    this._unsubscriber$.complete();
  }

  cambiarTab(activeTab: any): void {
    this.activeTab = activeTab;
  }


}
