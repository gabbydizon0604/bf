export enum ChatbotIntent {
    GREETING = 'greeting',
    SEARCH_RECOMMENDATION = 'search_recommendation',
    ASK_FAQ = 'ask_faq',
    LEARN_BETTING = 'learn_betting',
    PLATFORM_INFO = 'platform_info',
    FALLBACK = 'fallback'
}

export interface ChatbotEntities {
    teams?: string[];
    date?: string;
    league?: string;
    keywords?: string[];
}

