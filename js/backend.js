// 백엔드 API 서비스
class BackendService {
    constructor() {
        // environment.js에서 백엔드 URL 가져오기
        this.baseUrl = envConfig.backendUrl;
        this.isVercel = this.baseUrl && this.baseUrl.includes('vercel.app');
        if (!this.isVercel) {
            // Vercel 백엔드가 아니면 강제로 오류 처리
            throw new Error('Vercel 백엔드 URL이 올바르지 않습니다. 환경설정을 확인하세요.');
        }
        console.log(`백엔드 URL: ${this.baseUrl}, Vercel 연결: ${this.isVercel}`);
    }

    // 백엔드 상태 확인
    async checkBackendStatus() {
        if (!this.isVercel) {
            // Vercel을 사용하지 않는 경우, 이 부분을 어떻게 처리할지 결정해야 합니다.
            // 예를 들어, 항상 "연결 안됨"으로 표시하거나 다른 상태를 정의할 수 있습니다.
            // 현재는 Vercel 백엔드만 지원하므로, isVercel이 false이면 연결 실패로 간주합니다.
            return {
                message: '❌ Vercel 백엔드 설정 필요',
                color: '#F44336' // Red
            };
        }

        try {
            // Vercel 백엔드의 상태 확인을 위해 간단한 요청 전송
            const response = await fetch(`${this.baseUrl}/api/rusk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.error && data.error.includes("API key")) {
                    return {
                        message: '⚠️ Vercel 백엔드 연결됨 (API 키 문제)',
                        color: '#FFD700' // Gold
                    };
                }
                return {
                    message: '☁️ Vercel 백엔드 연결됨',
                    color: '#4CAF50' // Green
                };
            } else {
                return {
                    message: `🔌 Vercel 백엔드 오류 (${response.status})`,
                    color: '#F44336' // Red
                };
            }
        } catch (error) {
            console.error('Vercel 백엔드 연결 확인 실패:', error);
            return {
                message: '❌ Vercel 백엔드 연결 실패',
                color: '#F44336' // Red
            };
        }
    }

    // 채팅 메시지 전송
    async sendMessage(messages) {
        if (!this.isVercel) {
            // isVercel이 false일 경우, 오류를 발생시키거나 적절한 메시지를 반환합니다.
            // 이제 로컬 모드는 지원하지 않으므로, 백엔드 연결이 필수적입니다.
            const errorMsg = "Vercel 백엔드에 연결되어 있지 않습니다. 환경 설정을 확인하세요.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            // messages 배열을 백엔드가 기대하는 구조로 변환
            const history = messages.slice(0, -1).map(m => ({
                sender: m.role,
                message: m.content
            }));
            const message = messages[messages.length - 1]?.content || '';

            const response = await fetch(`${this.baseUrl}/api/rusk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, history })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('백엔드 응답 오류:', errorData);
                throw new Error(`서버 오류: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('메시지 전송 실패:', error);
            throw error;
        }
    }
}

// 전역 백엔드 서비스 인스턴스를 window 객체에 할당
window.backend = new BackendService();
