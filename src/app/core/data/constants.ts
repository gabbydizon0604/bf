export class Constantes {
    static api = {
        auth: {
            Login: '/api/Login/Login',
        },
        usuario: {
            Get: '/api/usuario/get',
            Registro: '/api/usuario/registrar',
            Suscripcion: '/api/usuario/registrarSuscripcion',
            Cancelar: '/api/usuario/cancelarSuscripcion'
        },
        culqi: {
            Get: '/api/culqi/suscripciones/get',
            GetOrder: '/api/culqi/order/get',
        },
        account: {
            Recomendaciones: '/api/recomendaciones/getCriterio',
            TableroPosiciones: '/api/tableroPosiciones/getCriterio',
            Resultados: '/api/resultados/getCriterio',
            Maestros: '/api/eventosLiga/getMaestros',
            Equipos: '/api/eventosLiga/getEquipos',
            Temporadas: '/api/eventosLiga/getTemporadas',
            MaestrosPosiciones: '/api/tableroPosiciones/getMaestros',
            MaestrosPartidosJugar: '/api/partidosJugar/getMaestros',
            MaestrosResultados: '/api/resultados/getMaestros',
            EventosLiga: '/api/eventosLiga/getCriterio',
            PartidosJugar: '/api/partidosJugar/getCriterio'
        },
        email: {
            enviarmensajesoporte: '/api/email/enviarmensajesoporte',
        },
        forgorPassword: {
            recuperarPasswordEmail: '/api/forgorpassword/recuperarPasswordEmail',
            resetPassword: '/api/forgorpassword/resetPassword',
        },
        prioridadpartidos: {
            getCriterio: '/api/prioridadpartidos/getCriterio'
        },
        chatbot: {
            Query: '/api/chatbot/query',
            Search: '/api/chatbot/search',
            FAQs: '/api/chatbot/faqs',
            KnowledgeBase: '/api/chatbot/knowledge-base'
        },
    }
    static culqi = {
        auth: {
            id: 'pk_test_bded8ec6438187ee'
        },
        path: 'assets/js/culqi.js'
    }
    static tipoSeguridad = {
        bearToken: 'Bearer ',
    }
}

