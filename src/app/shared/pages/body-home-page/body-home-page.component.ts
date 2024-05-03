import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject, Subscription, catchError, map, merge, switchMap, takeUntil } from 'rxjs';
import { Constantes } from 'src/app/config/constants';
import { AccesoService } from 'src/app/main/auth/services/acceso.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-body-home-page',
  templateUrl: './body-home-page.component.html',
  styleUrls: [
    './body-home-page.component.css',
    './body-home-page.component.scss']
})
export class BodyHomePageComponent implements OnInit {

  @ViewChild('htmlmain') testDiv: ElementRef;
  _suscripcion: Subscription;
  _observable: Subject<boolean> = new Subject<boolean>();
  _unsubscribeAll: Subject<any>;
  criterioBusqueda: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private accesoService: AccesoService
  ) {
    this._unsubscribeAll = new Subject();

  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('.hamburger-toggle')
      .addEventListener('click', this.onClick.bind(this));

    this.criterioBusqueda = {
      pageNumber : 1,
      pageSize : 13
    }

    console.log('cambios en ')
    
    this.accesoService.obtenerPartidosPriorizados(this.criterioBusqueda)
    .pipe(
      takeUntil(this._unsubscribeAll)
    )
    .subscribe(response => {
      console.log(response.resResult)
       
    });
 

  }

  ngOnInit(): void {
  }

  onClick(event: any): void {
    console.log(event);
    // this.renderer.addClass(this.testDiv.nativeElement, 'burger-is-active')
    if (document.documentElement.classList.contains('burger-is-active')) {
      document.documentElement.classList.remove('burger-is-active')
    } else {
      document.documentElement.classList.add('burger-is-active')
    }
  }

  urlInventario = environment.urlIntegracion;



}
