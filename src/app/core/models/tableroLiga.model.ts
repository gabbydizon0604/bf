export class TableroPosicionesModel {
    public _id: any;
    public fecha: string;
    public hora: string;
    public liga: string;
    public equipoLocal: string;
    public equipoVisitante: string;
    public posicionLocal: Number;
    public posicionVisita: Number;
    public cornersProbabilidadMas6: Number;
    public cornersProbabilidadMas7: Number;
    public cornersProbabilidadMas8: Number;
    public cornersProbabilidadMas9: Number;
    public golesProbabilidadMas1: Number;
    public golesProbabilidadMas2: Number;
    public golesProbabilidadMas3: Number;
    public tirosaporteriaProb6: Number;
    public tirosaporteriaProb7: Number;
    public tirosaporteriaProb8: Number;
    public tirosaporteriaProb9: Number;
    public tarjetasProbabilidad3: Number;
    public tarjetasProbabilidad4: Number;
    public tarjetasProbabilidad5: Number;
    public cornersLocalProbMas5: Number;
    public golesLocalProbMas1: Number;
    public tirosaporteriaLocalProb5: Number;
    public tarjetasLocalProb2: Number;
    public cornersHechoTotalesLocalVisita: Number;
    public golesHechoTotalesLocalVisita: Number;
    public tirosaporteriaTotalProm: Number;
    public tarjetasTotalProm: Number;
 
    public detalle: any;
    public labelCornersProbabilidadMas6: any;
    public labelGolesProbabilidadMas6: any;
    public colorPosicionLocal: any;
    public colorPosicionVisita: any;

    public idHomeTeam: string;
    public idAwayTeam: string;
    public labelCornersProbabilidadMas7: string;
    public labelGolesProbabilidadMas1: string;
    public labelTirosaporteriaProb6: string;
    public labelTarjetasProbabilidad3: string;
    public labelCornersLocalProbMas5: string;
    public labelGolesLocalProbMas1: string;
    public labelTirosaporteriaLocalProb5: string;
    public labelTarjetasLocalProb2: string;

    public cornerstotalesresultado: Number;
    public golestotalesresultado: Number;
    public tirosaporteriatotalresultado: Number;
    public tarjetastotalresultado: Number;

    public labelCornerstotalesresultado: string;
    public labelGolestotalesresultado: string;
    public labelTirosaporteriatotalresultado: string;
    public labelTarjetastotalresultado: string;

    public home_image: string;
    public away_image: string;
    public pais_imagen: string;


    // Nuevo 2024 06 09
    public cornersVisitaProbMas3: Number;
    public golesVisitaProbMas0: Number;
    public tirosaporteriaVisitaProb3: Number;
    public tarjetasVisitaProb1: Number;

    public totalPartido: any;
    public primerTiempo: any;

}