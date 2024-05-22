import { Component, OnInit } from '@angular/core';
import { RecommendationsService } from '../../services/recommendations.service';
import { forkJoin, merge, Subject, takeUntil, BehaviorSubject, fromEvent, debounceTime } from 'rxjs';
import { TableroPosicionesModel } from 'src/app/core/models/tableroLiga.model';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-resultados-page',
  templateUrl: './resultados-page.component.html',
  styleUrls: ['./resultados-page.component.css']
})
export class ResultadosPageComponent implements OnInit {

  _unsubscribeAll: Subject<any>;
  tableroPosiciones: TableroPosicionesModel[] = [];
  datosOriginales: TableroPosicionesModel[] = [];
  listadoLiga: any[] = [];
  equiposLocales: any[] = [];
  equiposVisitas: any[] = [];
  suscriptoCulqi: boolean = true;
  mensajeSuscriptoCulqi: string = '';

  strLeague: any[] = [];
  strLeagueSelected: any;
  strFechaAll: any;
  strFecha: any;
  strFechaSelected: any;
  resumenAciertos: any;
  resumenFallos: any;
  resumenPorcentaje: any;

  public screenWidth$: BehaviorSubject<any> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<any> = new BehaviorSubject(null);
  private _unsubscriber$: Subject<any> = new Subject();

  verSoloResultados = true;

  constructor(
    private _resultadosService: ResultadosService,
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
      this._resultadosService.obtenerMaestros(criterioBusqueda2),
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

          // Fecha 
          this.strFechaAll = rest[0].strFecha;
          this.generarFilterFecha();

          this.strFechaSelected = null;
          const criterioBusqueda = {
            strLeague: this.strLeagueSelected
          };
          this.getData(criterioBusqueda)
        }
      });
  }

  getData(criterioBusqueda: any) {

    forkJoin([
      this._resultadosService.obtenerListado(criterioBusqueda),
    ])
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((rest: any) => {


        rest[0].resResult.forEach((element: any) => {
          element = this.calcularLabelPorcentajes(element, 'cornersProbabilidadMas7', 'labelCornersProbabilidadMas7')
          element = this.calcularLabelPorcentajes(element, 'golesProbabilidadMas1', 'labelGolesProbabilidadMas1')
          element = this.calcularLabelPorcentajes(element, 'tirosaporteriaProb6', 'labelTirosaporteriaProb6')
          element = this.calcularLabelPorcentajes(element, 'tarjetasProbabilidad3', 'labelTarjetasProbabilidad3')
          element = this.calcularLabelPorcentajes(element, 'cornersLocalProbMas5', 'labelCornersLocalProbMas5')
          element = this.calcularLabelPorcentajes(element, 'golesLocalProbMas1', 'labelGolesLocalProbMas1')
          element = this.calcularLabelPorcentajes(element, 'tirosaporteriaLocalProb5', 'labelTirosaporteriaLocalProb5')
          element = this.calcularLabelPorcentajes(element, 'tarjetasLocalProb2', 'labelTarjetasLocalProb2')
          element = this.calcularLabelResultado(element, 'cornerstotalesresultado')
          element = this.calcularLabelResultado(element, 'golestotalesresultado')
          element = this.calcularLabelResultado(element, 'tirosaporteriatotalresultado')
          element = this.calcularLabelResultado(element, 'tarjetastotalresultado')
        });

        // this.strFecha = [...new Set(rest[0].resResult.map((item:any) => item.fecha))];
        this.calcularResumen(rest[0].resResult);

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
        this.datosOriginales = rest[0].resResult;
      });
  }

  onChange(): void {
    // this.getData();

    this.generarFilterFecha();
    this.strFechaSelected = null;
    const criterioBusqueda = {
      strLeague: this.strLeagueSelected
    };
    this.getData(criterioBusqueda)
  }

  generarFilterFecha() {
    let strFechaFilter: any[] = [{
      id: null,
      descripcion: 'Todas'
    }];
    console.log("this.strLeagueSelected")
    console.log(this.strLeagueSelected)
    let strFechaFiltered = []
    if(this.strLeagueSelected){
      const newLista = this.strFechaAll.filter((x:any) => x.liga == this.strLeagueSelected);
      strFechaFiltered = [...new Set(newLista.map((item:any) => item.fecha))];
    }else{
      strFechaFiltered = [...new Set(this.strFechaAll.map((item:any) => item.fecha))];
    }
     
    console.log("strFechaFiltered")
    console.log(strFechaFiltered)

    strFechaFiltered.forEach((element: any) => {
      strFechaFilter.push({
        id: element,
        descripcion: element
      })
    });
    console.log("strFechaFiltered")
    console.log(strFechaFiltered)

    this.strFecha = strFechaFilter
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

  calcularLabelResultado(element: any, label:any):void {
    if (element["cornerstotalesresultado"] > 7.5 && element["cornersProbabilidadMas7"]> 77) {
      element["labelCornerstotalesresultado"] = 'azul'
    }else if(element["cornerstotalesresultado"] < 7.5  && element["cornersProbabilidadMas7"]> 77){
      element["labelCornerstotalesresultado"] = 'rojo'
    }
    if (element["golestotalesresultado"] > 1.5 && element["golesProbabilidadMas1"]> 77) {
      element["labelGolestotalesresultado"] = 'azul'
    }else if(element["golestotalesresultado"] < 1.5  && element["golesProbabilidadMas1"]> 77){
      element["labelGolestotalesresultado"] = 'rojo'
    }

    if (element["tirosaporteriatotalresultado"] > 6.5 && element["tirosaporteriaProb6"]> 77) {
      element["labelTirosaporteriatotalresultado"] = 'azul'
    }
    else if(element["tirosaporteriatotalresultado"] < 6.5  && element["tirosaporteriaProb6"]> 77){
      element["labelTirosaporteriatotalresultado"] = 'rojo'
    }

    if (element["tarjetastotalresultado"] > 2.5 && element["tarjetasProbabilidad3"]> 77) {
      element["labelTarjetastotalresultado"] = 'azul'
    }else if(element["tarjetastotalresultado"] < 2.5  && element["tarjetasProbabilidad3"]> 77){
      element["labelTarjetastotalresultado"] = 'rojo'
    }
    return element;
  }

  calcularResumen(listaRegistros: any):void {
      // Aciertos
      const cornersAciertoResumen =  listaRegistros.filter((x:any) => x.labelCornerstotalesresultado == 'azul').length;
      const golesAciertoResumen =  listaRegistros.filter((x:any) => x.labelGolestotalesresultado == 'azul').length;
      const tirosAciertoResumen =  listaRegistros.filter((x:any) => x.labelTirosaporteriatotalresultado == 'azul').length;
      const tarjetasAciertoResumen =  listaRegistros.filter((x:any) => x.labelTarjetastotalresultado == 'azul').length;
      console.log("golesAciertoResumen")
      console.log(golesAciertoResumen)
      this.resumenAciertos = {
        cornersAciertoResumen: cornersAciertoResumen,
        golesAciertoResumen: golesAciertoResumen,
        tirosAciertoResumen: tirosAciertoResumen,
        tarjetasAciertoResumen: tarjetasAciertoResumen
      }
      // Aciertos
      const cornersFalloResumen =  listaRegistros.filter((x:any) => x.labelCornerstotalesresultado == 'rojo').length;
      const golesFalloResumenoResumen =  listaRegistros.filter((x:any) => x.labelGolestotalesresultado == 'rojo').length;
      const tirosFalloResumen =  listaRegistros.filter((x:any) => x.labelTirosaporteriatotalresultado == 'rojo').length;
      const tarjetasFalloResumen =  listaRegistros.filter((x:any) => x.labelTarjetastotalresultado == 'rojo').length;

      this.resumenFallos = {
        cornersFalloResumen: cornersFalloResumen,
        golesFalloResumenoResumen: golesFalloResumenoResumen,
        tirosFalloResumen: tirosFalloResumen,
        tarjetasFalloResumen: tarjetasFalloResumen
      }

      this.resumenPorcentaje = {
        corners: Math.round(((cornersAciertoResumen * 100 )/( cornersAciertoResumen + cornersFalloResumen))) || 0,
        goles: Math.round(((golesAciertoResumen * 100 )/( golesAciertoResumen + golesFalloResumenoResumen))) || 0,
        tiros:Math.round(((tirosAciertoResumen * 100 )/( tirosAciertoResumen + tirosFalloResumen))) || 0,
        tarjetas: Math.round(((tarjetasAciertoResumen * 100 )/( tarjetasAciertoResumen + tarjetasFalloResumen))) || 0,
      }
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

  filtrarResultados(): void {
    // this.tableroPosiciones = this.datosOriginales.filter((x:any) => x.fecha == this.strFechaSelected);
    console.log("this.strFechaSelected");
    console.log(this.strFechaSelected);
    const criterioBusqueda = {
      strLeague: this.strLeagueSelected,
      strFecha: this.strFechaSelected
    };
    this.getData(criterioBusqueda)
    // this.calcularResumen(this.tableroPosiciones);


  }
}
