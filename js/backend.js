// 백엔드 API 서비스 (안전한 API 키 관리)
class BackendService {
    constructor() {
        // Vercel 배포 URL을 기본값으로 설정 (배포 후 실제 URL로 변경 필요)
        this.baseUrl = envConfig.backendUrl || 'https://your-backend-project.vercel.app';
        this.sessionToken = 'default-session'; // 기본 세션 토큰
        console.log(`백엔드 URL: ${this.baseUrl}`);
    }
    
    // 사용자 세션 생성 (임시 토큰 방식)
    async createSession(userId = null) {
        if (!this.baseUrl) return null;
        
        try {
            const response = await fetch(`${this.baseUrl}/api/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId || this.generateUserId(),
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.sessionToken = data.sessionToken;
                return this.sessionToken;
            }
        } catch (error) {
            console.error('세션 생성 실패:', error);
        }
        
        return null;
    }
    
    // ChatGPT API 호출 (백엔드를 통해)
    async callOpenAI(messages, character) {
        if (!this.baseUrl || !this.sessionToken) {
            throw new Error('백엔드 서비스가 설정되지 않았습니다.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.sessionToken}`
                },
                body: JSON.stringify({
                    messages: messages,
                    character: {
                        name: character.name,
                        personality: character.personality,
                        age: character.age,
                        traits: character.traits
                    },
                    options: {
                        model: 'gpt-3.5-turbo',
                        max_tokens: 150,
                        temperature: 0.8
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`백엔드 API 오류: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.response;
            
        } catch (error) {
            console.error('백엔드 API 호출 실패:', error);
            throw error;
        }
    }
    
    // 사용자 ID 생성
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    // 세션 유효성 확인
    async validateSession() {
        if (!this.baseUrl || !this.sessionToken) return false;
        
        try {
            const response = await fetch(`${this.baseUrl}/api/session/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.sessionToken}`
                }
            });
            
            return response.ok;
        } catch (error) {
            console.error('세션 검증 실패:', error);
            return false;
        }
    }
    
    // 세션 종료
    async endSession() {
        if (!this.baseUrl || !this.sessionToken) return;
        
        try {
            await fetch(`${this.baseUrl}/api/session/end`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.sessionToken}`
                }
            });
        } catch (error) {
            console.error('세션 종료 실패:', error);
        } finally {
            this.sessionToken = null;
        }
    }
}

// 전역 백엔드 서비스 인스턴스
const backendService = new BackendService();
