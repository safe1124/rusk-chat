// 백엔드 API 서비스
class BackendService {
    constructor() {
        // environment.js에서 백엔드 URL 가져오기
        this.baseUrl = envConfig.backendUrl;
        this.isNetlify = true; // Netlify 환경으로 간주
        console.log(`백엔드 URL: ${this.baseUrl}, Netlify 연결: ${this.isNetlify}`);
    }

    // 백엔드 상태 확인
    async checkBackendStatus() {
        if (!this.isNetlify) {
            return {
                message: '❌ Netlify 백엔드 설정 필요',
                color: '#F44336'
            };
        }
        try {
            // Netlify 백엔드의 상태 확인을 위해 간단한 요청 전송
            const response = await fetch(`${this.baseUrl}/api/rusk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] })
            });
            if (response.ok) {
                const data = await response.json();
                if (data.error && data.error.includes("API key")) {
                    return {
                        message: '⚠️ Netlify 백엔드 연결됨 (API 키 문제)',
                        color: '#FFD700'
                    };
                }
                return {
                    message: '☁️ Netlify 백엔드 연결됨',
                    color: '#4CAF50'
                };
            } else {
                return {
                    message: `🔌 Netlify 백엔드 오류 (${response.status})`,
                    color: '#F44336'
                };
            }
        } catch (error) {
            console.error('Netlify 백엔드 연결 확인 실패:', error);
            return {
                message: '❌ Netlify 백엔드 연결 실패',
                color: '#F44336'
            };
        }
    }

    // 채팅 메시지 전송
    async sendMessage(messages) {
        try {
            // messages 배열을 그대로 전송 (ChatGPT 호환)
            const response = await fetch(`${this.baseUrl}/api/rusk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('백엔드 응답 오류:', errorData);
                throw new Error(errorData.error || `서버 오류: ${response.status}`);
            }

            const data = await response.json();
            // content 필드를 우선적으로 사용
            return data.content || data.message || data.reply || data;
        } catch (error) {
            console.error('메시지 전송 실패:', error);
            throw error;
        }
    }
}

// 전역 백엔드 서비스 인스턴스를 window 객체에 할당
window.backend = new BackendService();
