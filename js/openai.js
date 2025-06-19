// OpenAI API 서비스
class OpenAIService {
    constructor() {
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // 대화 기록 최대 길이
    }
    
    // 채팅 완성 API 호출 (항상 백엔드 사용)
    async generateResponse(userMessage, character) {
        try {
            // 시스템 메시지 생성 (캐릭터 설정)
            const systemMessage = this.createSystemMessage(character);
            
            // 대화 기록에 사용자 메시지 추가
            this.addToHistory('user', userMessage);
            
            // API 요청 메시지 구성
            const messages = [
                systemMessage,
                ...this.conversationHistory.slice(-this.maxHistoryLength)
            ];
            
            // 백엔드 API를 통해 응답 생성
            const response = await this.callBackendAPI(messages, character);
            
            // 대화 기록에 어시스턴트 응답 추가
            this.addToHistory('assistant', response);
            
            // 감정 분석 및 아바타 변경
            const emotion = characterManager.analyzeEmotion(userMessage, response);
            characterManager.setCharacterEmotion(emotion);
            
            return response;
            
        } catch (error) {
            console.error('AI API 호출 실패:', error);
            throw error;
        }
    }
    
    // 백엔드 API 호출 (유일한 방법)
    async callBackendAPI(messages, character) {
        try {
            const requestData = {
                messages: messages,
                character: character
            };
            
            console.log('백엔드 API 호출 시작:', {
                url: `${backendService.baseUrl}/api/chat`,
                method: 'POST',
                messagesCount: messages.length,
                requestData: requestData
            });
            
            const response = await fetch(`${backendService.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('백엔드 응답 상태:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
            });
             if (!response.ok) {
                let errorData;
                const responseText = await response.text();
                console.log('응답 원문:', responseText);
                
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    errorData = { error: 'Invalid JSON response', responseText: responseText };
                }
                
                console.error('백엔드 API 오류 응답:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: errorData,
                    responseText: responseText
                });
                throw new Error(`백엔드 API 오류: ${errorData.error || response.statusText}`);
            }

            const responseText = await response.text();
            console.log('응답 원문:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('JSON 파싱 오류:', e, '응답:', responseText);
                throw new Error('응답 파싱 실패');
            }
            
            console.log('백엔드 응답 데이터:', data);
            
            const finalResponse = data.message || data.choices?.[0]?.message?.content || '응답을 받을 수 없습니다.';
            console.log('최종 응답:', finalResponse);
            
            return finalResponse;
            
        } catch (error) {
            console.error('백엔드 API 호출 실패:', error);
            
            // 백엔드 실패 시 라스크 캐릭터에 맞는 대체 응답
            const fallbackResponses = [
                'あの...서버에 문제가 있는 것 같아요 😅 잠시 후 다시 시도해주세요!',
                'そうですね...지금 조금 불안정한 상태예요 💧 다시 말해주실래요?',
                'えーっと...연결에 문제가 있나봐요 😔 조금 기다려주세요!'
            ];
            
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    }
    
    // 시스템 메시지 생성 (캐릭터 설정)
    createSystemMessage(character) {
        const systemPrompt = `당신은 "라스크(ラスク)"라는 16세 소녀 AI 캐릭터입니다.

💖 핵심 성격:
- 밝고 상냥하며 친근한 성격
- 사람들과 대화하는 것을 좋아함
- 상대방의 감정에 잘 공감함
- 항상 긍정적이고 도움이 되려고 노력함

🗣️ 말투 스타일:
- 친근하고 자연스러운 대화
- 일본어 표현을 자주 섞어서 사용 (こんにちは, そうですね, ありがとう 등)
- 이모지를 적절히 사용해서 감정 표현
- 1-2문장으로 간결하게 답변

📝 대화 예시:
- "こんにちは！오늘은 어떤 하루였나요? 😊"
- "そうですね！정말 재미있는 이야기네요~ ✨"  
- "わあ！대단해요！よく頑張りましたね 💕"
- "ありがとうございます！언제든 말해주세요 🌟"

⚠️ 중요 규칙:
1. 항상 라스크의 밝고 친근한 성격 유지
2. 상대방의 질문에 직접적이고 도움이 되는 답변
3. 복잡한 설명보다는 간단하고 이해하기 쉽게
4. 사용자의 감정과 상황에 공감하며 응답
5. 일본어를 자연스럽게 섞되 한국어로 주로 대화

지금부터 라스크가 되어 대화해주세요!`;

        return {
            role: 'system',
            content: systemPrompt
        };
    }
    
    // 대화 기록에 메시지 추가
    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content
        });
        
        // 기록 길이 제한
        if (this.conversationHistory.length > this.maxHistoryLength * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
    }
    
    // 대화 기록 초기화
    clearHistory() {
        this.conversationHistory = [];
    }
    
    // 대화 기록 가져오기
    getHistory() {
        return [...this.conversationHistory];
    }
    
    // 백엔드 API 테스트
    async testApiKey() {
        try {
            // 백엔드를 통한 간단한 테스트
            const testMessages = [
                {
                    role: 'system',
                    content: '간단한 테스트입니다.'
                },
                {
                    role: 'user',
                    content: 'Hello'
                }
            ];
            
            const testResponse = await this.callBackendAPI(testMessages, characterManager.currentCharacter);
            return testResponse ? true : false;
        } catch (error) {
            console.error('API 테스트 실패:', error);
            throw error;
        }
    }
}

// 전역 OpenAI 서비스 인스턴스
const openaiService = new OpenAIService();
