// OpenAI API 서비스 (Vercel Serverless 사용)
class OpenAIService {
    constructor() {
        this.conversationHistory = [];
        this.maxHistoryLength = 8; // 대화 기록 최대 길이
    }
    
    // 채팅 완성 API 호출 (새로운 rusk API 사용)
    async generateResponse(userMessage, character) {
        try {
            console.log('🤖 라스크 AI 응답 생성 시작:', userMessage);
            
            // 대화 기록에 사용자 메시지 추가
            this.addToHistory('user', userMessage);
            
            // 새로운 rusk API 호출
            const response = await this.callRuskAPI(userMessage);
            
            // 대화 기록에 어시스턴트 응답 추가
            this.addToHistory('assistant', response);
            
            // 감정 분석 및 아바타 변경
            const emotion = characterManager.analyzeEmotion(userMessage, response);
            characterManager.setCharacterEmotion(emotion);
            
            return response;
            
        } catch (error) {
            console.error('AI API 호출 실패:', error);
            return this.getFallbackResponse();
        }
    }
    
    // 새로운 rusk API 호출
    async callRuskAPI(message) {
        try {
            // 현재 도메인 기반 API URL 생성
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/rusk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory.slice(-6) // 최근 6개만 전송
                })
            });

            console.log('🌟 API 응답 상태:', response.status);

            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }

            const data = await response.json();
            console.log('✨ 라스크 응답 수신:', data);

            if (data.fallback || data.error) {
                console.log('⚠️ Fallback 또는 에러 응답 사용');
            }

            return data.response || this.getFallbackResponse();

        } catch (error) {
            console.error('🚨 라스크 API 호출 실패:', error);
            return this.getFallbackResponse();
        }
    }
    
    // Fallback 응답 생성
    getFallbackResponse() {
        const fallbackResponses = [
            "あの...지금 조금 바쁜 것 같아요 😅 다시 말해주실래요?",
            "そうですね...서버가 좀 느린 것 같아요 💦 잠깐만요~",
            "えーっと...연결이 좀 이상해요 😔 다시 시도해볼게요!",
            "わあ...뭔가 문제가 있나봐요 😅 죄송해요!",
            "そうそう...기술적인 문제가 있는 것 같아요 💧"
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    // 시스템 메시지 생성 (더 이상 직접 사용하지 않음)
    createSystemMessage(character) {
        return {
            role: 'system',
            content: '라스크 캐릭터 시스템 메시지'
        };
    }
    
    // 대화 기록에 메시지 추가
    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // 기록 길이 제한
        if (this.conversationHistory.length > this.maxHistoryLength * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
    }
    
    // 대화 기록 초기화
    clearHistory() {
        this.conversationHistory = [];
        console.log('💫 대화 기록이 초기화되었습니다.');
    }
    
    // 대화 기록 가져오기
    getHistory() {
        return [...this.conversationHistory];
    }
    
    // API 연결 테스트
    async testApiKey() {
        try {
            console.log('🔧 라스크 API 연결 테스트 시작...');
            
            const testResponse = await this.callRuskAPI('안녕하세요');
            
            if (testResponse && !testResponse.includes('문제가')) {
                console.log('✅ API 연결 테스트 성공!');
                return true;
            } else {
                console.log('⚠️ API 연결 불안정');
                return false;
            }
        } catch (error) {
            console.error('❌ API 연결 테스트 실패:', error);
            return false;
        }
    }
}

// 전역 OpenAI 서비스 인스턴스
const openaiService = new OpenAIService();
