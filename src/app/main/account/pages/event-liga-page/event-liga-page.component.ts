import { Component, OnInit, enableProdMode } from '@angular/core';
import { BehaviorSubject, debounceTime, forkJoin, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { EventLigaModel } from 'src/app/core/models/eventLiga.model';
import { EventoLigaService } from '../../services/eventoLiga.service';
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-liga-page',
  templateUrl: './event-liga-page.component.html',
  styleUrls: ['./event-liga-page.component.css']
})
export class EventLigaPageComponent implements OnInit {

  _unsubscribeAll: Subject<any>;
  eventos: EventLigaModel[] = [];
  suscriptoCulqi: boolean = true;
  mensajeSuscriptoCulqi: string = '';
  strLeague: any[] = [];
  strSeason: any[] = [{
    id: null,
    descripcion: 'Todas'
  }];
  strHomeTeam: any[] = [];
  strAwayTeam: any[] = [];
  //
  strFilterMatch: any[] = [];
  strFilterMatchLocal: any[] = [];
  strFilterMatchVisita: any[] = [];
  totalIntScoreFilter: any[] = [];
  totalIntScoreFilterLocal: any[] = [];
  totalIntScoreFilterVisita: any[] = [];
  totalCornerKicksFilter: any[] = [];
  totalCornerKicksFilterLocal: any[] = [];
  totalCornerKicksFilterVisita: any[] = [];
  totalCardsFilter: any[] = [];
  totalCardsFilterLocal: any[] = [];
  totalCardsFilterVisita: any[] = [];
  totalshotsonFilter: any[] = [];
  totalshotsonFilterLocal: any[] = [];
  totalshotsonFilterVisita: any[] = [];

  totalCornerKicksFilterCustom: any[] = [6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5  ];
  totalCornerKicksFilterCustomLocalVisita: any[] = [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5  ];
  totalIntScoreFilterCustom: any[] = [1.5, 2.5, 3.5, 4.5, 5.5];
  totalIntScoreFilterCustomLocalVisita: any[] = [0.5, 1.5, 2.5, 3.5, 4.5];

  totalshotsonFilterCustom: any[] = [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5];
  totalshotsonFilterCustomLocalVisita: any[] = [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5];

  totalCardsFilterCustom: any[] = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5];
  totalCardsFilterCustomLocalVisita: any[] = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5];


  strAwayTeamSelected: any;
  strAwayTeamNameSelected: any;
  strHomeTeamSelected: any;
  strHomeTeamNameSelected: any;
  strLeagueSelected: any;
  strSeasonSelected: any;

  //
  strMatchFilterSelected: any;
  strMatchFilterLocalSelected: any;
  strMatchFilterVisitaSelected: any;

  partidosLosDosEquipos: any[] = [];
  ultimos6Away: any[] = [];
  soloVisita: any[] = [];
  ultimos6Home: any[] = [];
  soloLocal: any[] = [];

  params_liga = '';
  params_equipoLocal = '';
  params_idHomeTeam = '';
  params_equipoVisitante = '';
  params_idAwayTeam = '';

  public screenWidth$: BehaviorSubject<any> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<any> = new BehaviorSubject(null);
  private _unsubscriber$: Subject<any> = new Subject();

  constructor(
    private _eventoLigaService: EventoLigaService,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
    console.log('EventLigaPageComponent')
    this.init();
    this.onTab(1);
  }

  ngOnInit(): void {
    const criterioBusqueda = {
      pageSize: 20
    };
    forkJoin([
      this._eventoLigaService.obtenerMaestros(criterioBusqueda),
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

          let strLeagueAll: any[] = [];
          rest[0].strLeague.forEach((element: any) => {
            strLeagueAll.push({
              id: element,
              descripcion: element
            })
          });
          this.strLeague = strLeagueAll

          this.suscriptoCulqi = true;
          this.mensajeSuscriptoCulqi = '';

          this.route.queryParams
            .subscribe(params => {
              console.log(params); // { orderby: "price" }

              if (params['liga']) {
                this.params_liga = params['liga'];
                this.params_equipoLocal = params['equipoLocal'];
                this.params_idHomeTeam = params['idHomeTeam'];
                this.params_equipoVisitante = params['equipoVisitante'];
                this.params_idAwayTeam = params['idAwayTeam'];

                this.strLeagueSelected = params['liga'];
                this.strSeasonSelected = null;
                this.strHomeTeamNameSelected = params['equipoLocal'];
                this.strHomeTeamSelected = params['idHomeTeam'];
                this.strHomeTeam.push({
                  id: params['idHomeTeam'],
                  descripcion: this.strHomeTeamNameSelected
                })

                this.strAwayTeamNameSelected = params['equipoVisitante'];
                this.strAwayTeamSelected = params['idAwayTeam'];
                this.strAwayTeam.push({
                  id: params['idAwayTeam'],
                  descripcion: this.strAwayTeamNameSelected
                })

                this.cargarTemporadas(true);
              }
            }
            );

        }
      });
  }

  cargarInfoFromQueryParameters(isQueryParams: boolean): void {

    this.cargarEquipos(isQueryParams);
    // this.cargarResumenes();
  }

  cargarResumenes(): void {

    const criterioBusqueda = {
      idAwayTeam: this.strAwayTeamSelected,
      strLeague: this.strLeagueSelected,
      strSeason: this.strSeasonSelected,
      idHomeTeam: this.strHomeTeamSelected
    };
    this._eventoLigaService.obtenerResumenes(criterioBusqueda)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(rest => {
        console.log('rest')
        console.log(rest)

        this.partidosLosDosEquipos = rest.partidosLosDosEquipos;

        rest.ultimos6Home.forEach((element: any) => {
          if (element.idHomeTeam == this.strHomeTeamSelected) {
            element.esLocal = 'true'

            // if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }
          } else {
            element.esLocal = 'false'

            // if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }
          }
        });

        rest.ultimos6Away.forEach((element: any) => {
          if (element.idHomeTeam == this.strAwayTeamSelected) {
            element.esLocal = 'true'
            // if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }

          } else {
            element.esLocal = 'false'

            // if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }
          }
        });

        rest.soloLocal.forEach((element: any) => {
          if (element.idHomeTeam == this.strHomeTeamSelected) {
            element.esLocal = 'true'

            // if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }

          } else {
            element.esLocal = 'false'

            // if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }

          }
        });

        rest.soloVisita.forEach((element: any) => {
          if (element.idHomeTeam == this.strAwayTeamSelected) {
            element.esLocal = 'true'

            // if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }

          } else {
            element.esLocal = 'false'

            // if (element.intAwayScore > element.intHomeScore) {
            //   element.tipoResultado = 'ganador'
            // }
            // else if (element.intHomeScore > element.intAwayScore) {
            //   element.tipoResultado = 'perdedor'
            // }
            // else {
            //   element.tipoResultado = 'empate'
            // }

            // if (element.cornerKicksAway > element.cornerKicksHome) {
            //   element.tipoResultadoCorners = 'ganador'
            // }
            // else if (element.cornerKicksHome > element.cornerKicksAway) {
            //   element.tipoResultadoCorners = 'perdedor'
            // }
            // else {
            //   element.tipoResultadoCorners = 'empate'
            // }

          }
        });

        this.crearValoresFiltro(rest.ultimos6Home, rest.ultimos6Away, rest.soloLocal, rest.soloVisita)
        this.onTab(this.tabActual)
        this.ultimos6Away = rest.ultimos6Away;
        this.ultimos6Home = rest.ultimos6Home;
        this.soloVisita = rest.soloVisita;
        this.soloLocal = rest.soloLocal;
      });
  }

  crearValoresFiltro(ultimos6Home:any, ultimos6Away:any, soloLocal:any, soloVisita:any ): void{

    // Goles
    const intScore_ultimos6Home = ultimos6Home.map((a:any) => a.intHomeScore).filter((e:any) => e);
    const intScore_ultimos6Away = ultimos6Away.map((a:any) => a.intAwayScore).filter((e:any) => e);
    const intScore_soloLocal = soloLocal.map((a:any) => a.intHomeScore).filter((e:any) => e);
    const intScore_soloVisita = soloVisita.map((a:any) => a.intAwayScore).filter((e:any) => e);

    this.totalIntScoreFilter = this.union(intScore_ultimos6Home, intScore_ultimos6Away, intScore_soloLocal, intScore_soloVisita)
    this.totalIntScoreFilterVisita = this.union(intScore_ultimos6Away, intScore_soloVisita)
    this.totalIntScoreFilterLocal = this.union(intScore_ultimos6Home, intScore_soloLocal)
    console.log(this.totalIntScoreFilter)

    // Goles
    const cornerKicks_ultimos6Home = ultimos6Home.map((a:any) => a.cornerKicksHome).filter((e:any) => e);
    const cornerKicks_ultimos6Away = ultimos6Away.map((a:any) => a.cornerKicksAway).filter((e:any) => e);
    const cornerKicks_soloLocal = soloLocal.map((a:any) => a.cornerKicksHome).filter((e:any) => e);
    const cornerKicks_soloVisita = soloVisita.map((a:any) => a.cornerKicksAway).filter((e:any) => e);

    this.totalCornerKicksFilter = this.union(cornerKicks_ultimos6Home, cornerKicks_ultimos6Away, cornerKicks_soloLocal, cornerKicks_soloVisita)
    this.totalCornerKicksFilterVisita = this.union(cornerKicks_ultimos6Away, cornerKicks_soloVisita)
    this.totalCornerKicksFilterLocal = this.union(cornerKicks_ultimos6Home, cornerKicks_soloLocal)
    console.log(this.totalCornerKicksFilter)
  
    // Tarjetas
    const totalCards_ultimos6Home = ultimos6Home.map((a:any) => a.totalCardsHome).filter((e:any) => e);
    const totalCards_ultimos6Away = ultimos6Away.map((a:any) => a.totalCardsAway).filter((e:any) => e);
    const totalCards_soloLocal = soloLocal.map((a:any) => a.totalCardsHome).filter((e:any) => e);
    const totalCards_soloVisita = soloVisita.map((a:any) => a.totalCardsAway).filter((e:any) => e);

    this.totalCardsFilter = this.union(totalCards_ultimos6Home, totalCards_ultimos6Away, totalCards_soloLocal, totalCards_soloVisita)
    this.totalCardsFilterVisita = this.union(totalCards_ultimos6Away, totalCards_soloVisita)
    this.totalCardsFilterLocal = this.union(totalCards_ultimos6Home, totalCards_soloLocal)
    console.log(this.totalCardsFilter)

    // Tarjetas
    const shotson_ultimos6Home = ultimos6Home.map((a:any) => a.shotsonGoalHome).filter((e:any) => e);
    const shotson_ultimos6Away = ultimos6Away.map((a:any) => a.shotsonGoalAway).filter((e:any) => e);
    const shotson_soloLocal = soloLocal.map((a:any) => a.shotsonGoalHome).filter((e:any) => e);
    const tshotson_soloVisita = soloVisita.map((a:any) => a.shotsonGoalAway).filter((e:any) => e);

    this.totalshotsonFilter = this.union(shotson_ultimos6Home, shotson_ultimos6Away, shotson_soloLocal, tshotson_soloVisita)
    this.totalshotsonFilterLocal = this.union( shotson_ultimos6Home, shotson_soloLocal)
    this.totalshotsonFilterVisita = this.union(shotson_ultimos6Away, tshotson_soloVisita)
    console.log(this.totalshotsonFilter)
  }

  cargarTemporadasEquipos(): void {
    this.cargarTemporadas(false);
    this.strSeasonSelected = null;
    this.cargarEquipos(false);
  }

  union(...listado: any) {
      return Array.from(new Set([...listado].flat()));
  }

  cargarTemporadas(isQueryParams: boolean): void {

    const criterioBusqueda = {
      strLeague: this.strLeagueSelected
    };
    this._eventoLigaService.obtenerTemporadasByLiga(criterioBusqueda)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(rest => {

        let strSeasonAll: any[] = [{
          id: null,
          descripcion: 'Todas'
        }];
        let max = 0;
        rest.strSeason.forEach((element: any) => {
          strSeasonAll.push({
            id: element,
            descripcion: element
          })
          let numero = 0
          if (element.includes("-")){
            numero = element.split('-')[1]
          }else{
            numero = element.split('-')[0]
          }
          if (max < numero)
            max = numero;
        });
        console.log("max")
        console.log(max)
        this.strSeason = strSeasonAll

        if (isQueryParams) {
          this.strSeasonSelected = rest.strSeason.find((x: any) => x.includes(max));
          this.cargarInfoFromQueryParameters(isQueryParams)
        }
      });
  }

  tabActual: any = 1

  onTab(tab:any): void {
    console.log(tab)
    this.limpiarFiltrado();
    this.tabActual = tab; 
    this.strMatchFilterSelected = ""
    this.strMatchFilterVisitaSelected = ""
    this.strMatchFilterLocalSelected= ""

    if(tab== 1){
      
      this.strFilterMatch = this.totalIntScoreFilterCustom
      this.strFilterMatchLocal = this.totalIntScoreFilterCustomLocalVisita
      this.strFilterMatchVisita = this.totalIntScoreFilterCustomLocalVisita
      
    }
    if(tab== 2){

      this.strFilterMatch = this.totalCornerKicksFilterCustom
      this.strFilterMatchLocal = this.totalCornerKicksFilterCustomLocalVisita
      this.strFilterMatchVisita = this.totalCornerKicksFilterCustomLocalVisita
      
    }
    if(tab== 3){

      this.strFilterMatch = this.totalCardsFilterCustom
      this.strFilterMatchLocal = this.totalCardsFilterCustomLocalVisita
      this.strFilterMatchVisita = this.totalCardsFilterCustomLocalVisita

    }
    if(tab== 4){

      this.strFilterMatch = this.totalshotsonFilterCustom
      this.strFilterMatchLocal = this.totalshotsonFilterCustomLocalVisita
      this.strFilterMatchVisita = this.totalshotsonFilterCustomLocalVisita
    }

  }
  
  cargarEquipos(isQueryParams: boolean): void {

    const criterioBusqueda = {
      strLeague: this.strLeagueSelected,
      strSeason: this.strSeasonSelected
    };
    this._eventoLigaService.obtenerEquipos(criterioBusqueda)
      .pipe(
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(rest => {

        let strHomeTeamAll: any[] = [];
        rest.strHomeTeam.forEach((element: any) => {
          strHomeTeamAll.push({
            id: element._id.idHomeTeam,
            descripcion: element._id.strHomeTeam
          })
        });

        let strAwayTeamAll: any[] = [];
        rest.strAwayTeam.forEach((element: any) => {
          strAwayTeamAll.push({
            id: element._id.idAwayTeam,
            descripcion: element._id.strAwayTeam
          })
        });

        this.strHomeTeam = strHomeTeamAll.sort((a, b) => a.descripcion > b.descripcion ? 1 : -1);
        this.strHomeTeam.sort((a, b) => a.descripcion > b.descripcion ? 1 : -1);
        this.strAwayTeam = strAwayTeamAll.sort((a, b) => a.descripcion > b.descripcion ? 1 : -1);
        this.strAwayTeam.sort((a, b) => a.descripcion > b.descripcion ? 1 : -1);

        console.log(this.strAwayTeam)
        if (isQueryParams) {
          this.strHomeTeamNameSelected = this.params_equipoLocal;
          this.strHomeTeamSelected = this.params_idHomeTeam;
          this.strAwayTeamNameSelected = this.params_equipoVisitante;
          this.strAwayTeamSelected = this.params_idAwayTeam;
        }
        this.cargarResumenes();

      });
  }

  onChange(): void {
    if (
      this.strLeagueSelected &&
      this.strHomeTeamSelected &&
      this.strAwayTeamSelected
      ) {

      this.strAwayTeamNameSelected = this.strAwayTeam.find(x => x.id == this.strAwayTeamSelected).descripcion
      this.strHomeTeamNameSelected = this.strHomeTeam.find(x => x.id == this.strHomeTeamSelected).descripcion
      this.cargarResumenes();
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

  limpiarfiltros(tipo:any): void { 
    if(tipo== 1){
      this.strMatchFilterSelected = ""
      this.strMatchFilterVisitaSelected = ""
    }
    if(tipo== 2){
      this.strMatchFilterLocalSelected = ""
      this.strMatchFilterVisitaSelected = ""
    }
    if(tipo== 3){
      this.strMatchFilterLocalSelected = ""
      this.strMatchFilterSelected = ""
    }
  }

  aplicarfiltroMatch(tipo:any): void {
    this.limpiarfiltros(tipo);

    if(this.tabActual== 1){

      console.log("strMatchFilterSelected")
      console.log(this.strMatchFilterSelected)

      this.ultimos6Home.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoGoles(tipo, element);
      });
      this.ultimos6Away.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoGoles(tipo, element);
      });

      this.soloVisita.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoGoles(tipo, element);
      });

      this.soloLocal.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoGoles(tipo, element);
      });

      this.partidosLosDosEquipos.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoGoles(tipo, element);
      });

    }

    if(this.tabActual== 2){

      this.ultimos6Home.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoCorner(tipo, element);
      });
      this.ultimos6Away.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoCorner(tipo, element);
      });

      this.soloVisita.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoCorner(tipo, element);
      });

      this.soloLocal.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoCorner(tipo, element);
      });

      this.partidosLosDosEquipos.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoCorner(tipo, element);
      });
      
    }
    if(this.tabActual== 4){

      this.ultimos6Away.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoRemate(tipo, element);
      });
      this.ultimos6Home.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoRemate(tipo, element);
      });

      this.soloVisita.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoRemate(tipo, element);
      });

      this.soloLocal.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoRemate(tipo, element);
      });

      this.partidosLosDosEquipos.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoRemate(tipo, element);
      });
      
    }
    if(this.tabActual== 3){
      this.ultimos6Home.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoTarjeta(tipo, element);
      });
      this.ultimos6Away.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoTarjeta(tipo, element);
      });

      this.soloVisita.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoTarjeta(tipo, element);
      });

      this.soloLocal.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoTarjeta(tipo, element);
      });

      this.partidosLosDosEquipos.forEach((element: any) => {
        element.filtroAplicado = false;
        element = this.retornarElementoTarjeta(tipo, element);
      });
    }

  }

  limpiarFiltrado(): void {
    this.ultimos6Home.forEach((element: any) => {
      element.filtroAplicado = false;
    });
    this.ultimos6Away.forEach((element: any) => {
      element.filtroAplicado = false;
    });

    this.soloVisita.forEach((element: any) => {
      element.filtroAplicado = false;
    });

    this.soloLocal.forEach((element: any) => {
      element.filtroAplicado = false;
    });

    this.partidosLosDosEquipos.forEach((element: any) => {
      element.filtroAplicado = false;
    });
  }

  retornarElementoGoles(tipo:any, element:any): void {
 
    if(tipo==1){ // Local 
      if (
        parseFloat(element.intHomeScore) > parseFloat(this.strMatchFilterLocalSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==2){ // Total 
      console.log((parseFloat(element.intHomeScore) + parseFloat(element.intAwayScore)))
      console.log(parseFloat(this.strMatchFilterSelected) )
      if (
        (parseFloat(element.intHomeScore) + parseFloat(element.intAwayScore)) > parseFloat(this.strMatchFilterSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==3){ // visita 
      if (
        parseFloat(element.intAwayScore) > parseFloat(this.strMatchFilterVisitaSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }
    return element;
  }

  retornarElementoCorner(tipo:any, element:any): void {

    if(tipo==1){ // Local 
      if (
        parseFloat(element.cornerKicksHome) > parseFloat(this.strMatchFilterLocalSelected)
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==2){ // Total 
      if (
        parseFloat(element.cornerKicksHome) + parseFloat(element.cornerKicksAway) > parseFloat(this.strMatchFilterSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==3){ // visita 
      if (
        parseFloat(element.cornerKicksAway) > parseFloat(this.strMatchFilterVisitaSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }

    return element;
  }

  retornarElementoRemate(tipo:any, element:any): void {

    if(tipo==1){ // Local 
      if (
        parseFloat(element.shotsonGoalHome) > parseFloat(this.strMatchFilterLocalSelected)
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==2){ // Total 
      if (
        parseFloat(element.shotsonGoalHome) + parseFloat(element.shotsonGoalAway) > parseFloat(this.strMatchFilterSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==3){ // visita 
      if (
        parseFloat(element.shotsonGoalAway) > parseFloat(this.strMatchFilterVisitaSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }

    return element;
  }

  retornarElementoTarjeta(tipo:any, element:any): void {

    if(tipo==1){ // Local

      if (
        parseFloat(element.totalCardsHome) > parseFloat(this.strMatchFilterLocalSelected)
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==2){ // Total
      if (
        parseFloat(element.totalCardsHome) + parseFloat(element.totalCardsAway) > parseFloat(this.strMatchFilterSelected)
      ) {
        element.filtroAplicado = true
      } 
    }
    if(tipo==3){ // visita
      if (
        parseFloat(element.totalCardsAway) > parseFloat(this.strMatchFilterVisitaSelected) 
      ) {
        element.filtroAplicado = true
      } 
    }

    return element;
  }
}
