import { RecomendacionesModel } from './recomendaciones.model';

export class ChatResponse {
    public success: boolean;
    public intent: string;
    public response: string;
    public recommendations?: RecomendacionesModel[];
    public hasMore?: boolean;
    public error?: string;

    constructor(data?: any) {
        this.success = data?.success || false;
        this.intent = data?.intent || '';
        this.response = data?.response || '';
        this.recommendations = data?.recommendations || [];
        this.hasMore = data?.hasMore || false;
        this.error = data?.error;
    }
}

