// API 설정 관리 (백엔드 전용)
class APIConfig {
    constructor() {
        this.isConfigured = true; // 항상 설정된 것으로 간주
        this.useBackend = true;   // 항상 백엔드 사용
        
        console.log('백엔드 API 모드로 설정되었습니다.');
    }
    
    // 항상 준비된 상태
    isReady() {
        return true;
    }
    
    // 항상 백엔드 사용
    shouldUseBackend() {
        return true;
    }
    
    // 보안 상태 정보
    getSecurityInfo() {
        return {
            useBackend: true,
            securityLevel: 'High',
            mode: 'Backend API'
        };
    }
}

// 전역 API 설정 인스턴스
const apiConfig = new APIConfig();

// 이미지 경로 관리 설정
window.IMAGE_CONFIG = {
    // Netlify와 로컬 환경 모두 지원
    getImagePath: function(imageName) {
        // Netlify에서는 루트 경로에서 직접 접근
        return '/' + imageName;
    }
};
