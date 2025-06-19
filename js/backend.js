// 백엔드 API 서비스 (간소화된 버전)
class BackendService {
    constructor() {
        // environment.js에서 백엔드 URL 가져오기
        this.baseUrl = envConfig.backendUrl;
        console.log(`백엔드 URL: ${this.baseUrl}`);
    }
    
    // 백엔드 연결 테스트
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: 'test'
                        }
                    ]
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('백엔드 연결 테스트 실패:', error);
            return false;
        }
    }
}

// 전역 백엔드 서비스 인스턴스
const backendService = new BackendService();
