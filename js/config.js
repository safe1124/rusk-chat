// API 설정 관리
class APIConfig {
    constructor() {
        this.apiKey = '';
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.maxTokens = 150;
        this.temperature = 0.8;
        this.isConfigured = false;
        this.useBackend = false;
        
        this.loadConfig();
        this.checkEnvironment();
    }
    
    // 환경 확인 및 설정
    checkEnvironment() {
        if (envConfig.isProduction) {
            this.useBackend = envConfig.shouldUseBackend();
            
            // 프로덕션에서 로컬 스토리지 사용 시 경고
            const warning = envConfig.showSecurityWarning();
            if (warning && !this.useBackend) {
                console.warn(warning);
            }
        }
    }
    
    // 로컬 스토리지에서 설정 로드
    loadConfig() {
        // 프로덕션에서는 로컬 스토리지 사용 제한
        if (envConfig.isProduction && !envConfig.allowLocalStorage) {
            console.log('프로덕션 환경: 로컬 API 키 저장이 비활성화되었습니다.');
            return;
        }
        
        try {
            const savedConfig = localStorage.getItem('chatbot_config');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                this.apiKey = config.apiKey || '';
                this.model = config.model || 'gpt-3.5-turbo';
                this.maxTokens = config.maxTokens || 150;
                this.temperature = config.temperature || 0.8;
                this.isConfigured = !!this.apiKey;
            }
        } catch (error) {
            console.error('설정 로드 실패:', error);
        }
    }
    
    // 설정 저장
    saveConfig() {
        // 프로덕션에서는 백엔드 사용 권장
        if (envConfig.isProduction && !envConfig.allowLocalStorage) {
            console.warn('프로덕션 환경에서는 보안을 위해 백엔드 서버 사용을 권장합니다.');
            return false;
        }
        
        try {
            const config = {
                apiKey: this.apiKey,
                model: this.model,
                maxTokens: this.maxTokens,
                temperature: this.temperature
            };
            localStorage.setItem('chatbot_config', JSON.stringify(config));
            this.isConfigured = !!this.apiKey;
            return true;
        } catch (error) {
            console.error('설정 저장 실패:', error);
            return false;
        }
    }
    
    // API 키 설정
    setApiKey(key) {
        this.apiKey = key.trim();
        return this.saveConfig();
    }
    
    // API 키 유효성 검사
    validateApiKey(key) {
        return key && key.startsWith('sk-') && key.length > 20;
    }
    
    // 설정 초기화
    clearConfig() {
        this.apiKey = '';
        this.isConfigured = false;
        
        if (envConfig.allowLocalStorage) {
            localStorage.removeItem('chatbot_config');
        }
    }
    
    // 설정 상태 확인
    isReady() {
        if (this.useBackend) {
            return backendService.sessionToken !== null;
        }
        return this.isConfigured && this.validateApiKey(this.apiKey);
    }
    
    // 백엔드 사용 여부
    shouldUseBackend() {
        return this.useBackend;
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
