// 환경 설정 관리 (온라인 배포용)
class EnvironmentConfig {
    constructor() {
        this.isProduction = this.checkProductionEnvironment();
        this.backendUrl = this.getBackendUrl();
        this.allowLocalStorage = !this.isProduction; // 프로덕션에서는 로컬 스토리지 비활성화
    }
    
    // 프로덕션 환경 확인
    checkProductionEnvironment() {
        return window.location.hostname !== 'localhost' && 
               window.location.hostname !== '127.0.0.1' &&
               window.location.hostname !== '';
    }
    
    // 백엔드 URL 결정
    getBackendUrl() {
        if (this.isProduction) {
            // 프로덕션 환경에서는 실제 서버 URL 사용
            return 'https://your-backend-api.vercel.app'; // 실제 백엔드 URL로 변경 필요
        } else {
            // 개발 환경에서는 로컬 설정
            return null;
        }
    }
    
    // API 키 저장 방식 결정
    shouldUseBackend() {
        return this.isProduction && this.backendUrl;
    }
    
    // 보안 경고 표시
    showSecurityWarning() {
        if (this.isProduction && !this.shouldUseBackend()) {
            return '⚠️ 보안 경고: 프로덕션 환경에서는 API 키를 안전하게 관리하기 위해 백엔드 서버 사용을 권장합니다.';
        }
        return null;
    }
}

// 전역 환경 설정 인스턴스
const envConfig = new EnvironmentConfig();
