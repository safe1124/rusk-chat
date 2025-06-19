// OpenAI API 서비스 (백엔드 연동)
class OpenAIService {
    constructor() {
        this.history = [];
    }

    /**
     * 백엔드 API를 통해 AI 응답을 생성합니다.
     * @param {string} userMessage - 사용자 메시지
     * @param {object} character - 현재 캐릭터 정보 (백엔드에서 컨텍스트에 사용)
     * @returns {Promise<object>} AI 응답과 감정 정보를 포함한 객체
     */
    async generateResponse(userMessage, character) {
        this.history.push({ role: 'user', content: userMessage });

        try {
            // window.backend는 backend.js에서 노출된 전역 백엔드 서비스 인스턴스입니다.
            const response = await window.backend.sendMessage(this.history);
            // 응답 구조가 response.content 또는 response.response일 수 있음
            const reply = response.content || response.response;
            const emotion = response.emotion || 'normal'; // 감정 정보 추출
            
            if (reply) {
                this.history.push({ role: 'assistant', content: reply });
                
                // 대화 기록이 너무 길어지는 것을 방지 (예: 마지막 20개만 유지)
                if (this.history.length > 20) {
                    this.history = this.history.slice(-20);
                }
                
                return { 
                    message: reply,
                    emotion: emotion 
                };
            } else {
                const errorMessage = response.error || '백엔드로부터 유효한 응답을 받지 못했습니다.';
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error('OpenAI 서비스 오류:', error);
            this.history.pop(); // 실패한 메시지 기록에서 제거
            throw error; // 오류를 상위로 전파하여 UI에서 처리하도록 함
        }
    }

    /**
     * 대화 기록을 초기화합니다.
     */
    clearHistory() {
        this.history = [];
    }
}

// 전역 서비스 인스턴스 생성
const openaiService = new OpenAIService();
