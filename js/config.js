// API 설정 관리
class APIConfig {
    constructor() {
        this.apiKey = '';
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.maxTokens = 150;
        this.temperature = 0.8;
        this.isConfigured = true; // 항상 설정된 것으로 간주
        this.useBackend = true;   // 항상 백엔드 사용
        
        this.checkEnvironment();
    }
    
    // 환경 확인 및 설정
    checkEnvironment() {
        this.useBackend = true; // 항상 백엔드 사용
        console.log('백엔드 API 서버를 사용합니다.');
    }
    
    // 설정 상태 확인 (항상 준비됨)
    isReady() {
        return true; // 백엔드 사용으로 항상 준비된 상태
    }
    
    // 백엔드 사용 여부 (항상 true)
    shouldUseBackend() {
        return true;
    }
    
    // 보안 상태 정보
    getSecurityInfo() {
        return {
            isProduction: envConfig.isProduction,
            useBackend: this.useBackend,
            allowLocalStorage: envConfig.allowLocalStorage,
            securityLevel: this.useBackend ? 'High' : envConfig.isProduction ? 'Medium' : 'Low'
        };
    }
}

// 전역 API 설정 인스턴스
const apiConfig = new APIConfig();
