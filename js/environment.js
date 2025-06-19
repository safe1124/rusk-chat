// 환경 설정 관리 (백엔드 전용)
class EnvironmentConfig {
    constructor() {
        this.isProduction = this.checkProductionEnvironment();
        // 현재 도메인을 백엔드 URL로 사용 (Netlify 자동 배포)
        this.backendUrl = window.location.origin;
    }
    
    // 프로덕션 환경 확인
    checkProductionEnvironment() {
        return window.location.hostname !== 'localhost' && 
               window.location.hostname !== '127.0.0.1' &&
               window.location.hostname !== '';
    }
    
    // 항상 백엔드 사용
    shouldUseBackend() {
        return true;
    }
    
    // 보안 경고 없음 (백엔드 사용)
    showSecurityWarning() {
        return null;
    }
}

// 전역 환경 설정 인스턴스
const envConfig = new EnvironmentConfig();