import { Component, OnInit, ViewEncapsulation, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-detalle-prediccion',
    templateUrl: './detalle-prediccion.component.html',
    styleUrls: ['./detalle-prediccion.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class DetallePrediccionesComponent implements OnInit {
    @Input() tableroPosiciones: any[] = [];
    @Input() tipoMercado = "Resumen";
    @Input() sizeScreen = "lg";
    
    excelData : any;
    fileExcel: string = '';
    tipoPlantillaCarga: string = 'NORMAL';
    @Output() valorSalida: EventEmitter<any> = new EventEmitter();

    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatTable, { static: true }) tablaDocumentoDetalle: MatTable<any>;

    // tipoColumnasMatTable = Constantes.tipoColumnasMatTable;

    // columnasTabla = [
    //     {
    //         matColumnDef: 'tipoImpuestoId',
    //         tituloCabecera: 'Afectacion',
    //         tipoColumna: Constantes.tipoColumnasMatTable.Combo,
    //         nombreListaCombo: 'tiposImpuesto',
    //         styleExpression: { 'min-width': '130px' }
    //     },
    //     {
    //         matColumnDef: 'codigoProducto',
    //         tituloCabecera: 'Cod. Artículo',
    //         styleExpression: { 'min-width': '120px' }
    //     },
    //     {
    //         matColumnDef: 'nombreProducto',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputTexto,
    //         tituloCabecera: 'Artículo',
    //         styleExpression: { 'min-width': '300px' }
    //     },
    // ];

    // columnasComun = [
    //     {
    //         matColumnDef: 'abreviaturaAlmacen',
    //         tituloCabecera: 'Almacén',
    //         styleExpression: { 'min-width': '100px' }
    //     },
    //     {
    //         matColumnDef: 'nombreUnidadMedida',
    //         tituloCabecera: 'U. Medida',
    //         styleExpression: { 'min-width': '130px' }
    //     },
    //     {
    //         matColumnDef: 'cantidad',
    //         tituloCabecera: 'Cantidad',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputDecimalThree,
    //         styleExpression: { 'min-width': '60px' }
    //     },
    //     {
    //         matColumnDef: 'precioUnitario',
    //         tituloCabecera: 'Precio',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputDecimalFour,
    //         styleExpression: { 'min-width': '100px' }
    //     },
    //     {
    //         matColumnDef: 'total',
    //         tituloCabecera: 'Total',
    //         styleExpression: { 'min-width': '100px' }
    //     },
    // ];

    // columnasTransporte = [
    //     {
    //         matColumnDef: 'nombreUnidadMedida',
    //         tituloCabecera: 'U. Medida',
    //         styleExpression: { 'min-width': '100px' }
    //     },
    //     {
    //         matColumnDef: 'cantidad',
    //         tituloCabecera: 'Cantidad',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputDecimalThree,
    //         styleExpression: { 'min-width': '60px' }
    //     },
    //     {
    //         matColumnDef: 'cantidadReferencia',
    //         tituloCabecera: 'Peso',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputDecimalFour,
    //         styleExpression: { 'min-width': '70px' }
    //     },
    //     {
    //         matColumnDef: 'precioReferencia',
    //         tituloCabecera: 'Precio Cliente',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputDecimalFour,
    //         styleExpression: { 'min-width': '80px' }
    //     },
    //     {
    //         matColumnDef: 'precioUnitario',
    //         tituloCabecera: 'Precio',
    //         tipoColumna: Constantes.tipoColumnasMatTable.InputDecimalFour,
    //         styleExpression: { 'min-width': '100px' }
    //     },
    //     {
    //         matColumnDef: 'total',
    //         tituloCabecera: 'Total',
    //         styleExpression: { 'min-width': '100px' }
    //     },
    // ];

    
    columnasMostradas: string[] = ['accion'];
    _unsubscribeAll: Subject<any>;

    listadoCombosColumnas = {
        tiposImpuesto: []
    };

    constructor(

    ) {
        this._unsubscribeAll = new Subject();
        console.log(this.tipoMercado)
    }

    async ngOnInit(): Promise<void> {
        console.log(this.tipoMercado)

    }

}
