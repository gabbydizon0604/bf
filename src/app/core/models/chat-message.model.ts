export class ChatMessage {
    public id: string;
    public message: string;
    public isUser: boolean;
    public timestamp: Date;
    public isLoading?: boolean;
    public error?: string;

    constructor(message: string, isUser: boolean = true, id?: string) {
        this.id = id || this.generateId();
        this.message = message;
        this.isUser = isUser;
        this.timestamp = new Date();
        this.isLoading = false;
    }

    private generateId(): string {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

