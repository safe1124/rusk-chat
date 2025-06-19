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
    
    // 백엔드를 통한 API 호출
    async callBackendAPI(messages, character) {
        return await backendService.callOpenAI(messages, character);
    }
    
    // 직접 OpenAI API 호출
    async callDirectAPI(messages) {
        const response = await fetch(apiConfig.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: apiConfig.model,
                messages: messages,
                max_tokens: apiConfig.maxTokens,
                temperature: apiConfig.temperature,
                presence_penalty: 0.6,
                frequency_penalty: 0.5
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API 오류: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // 시스템 메시지 생성 (캐릭터 설정)
    createSystemMessage(character) {
        const systemPrompt = `당신은 "${character.name}"라는 AI 캐릭터입니다.

📋 캐릭터 기본 정보:
- 이름: ${character.name}
- 나이: ${character.age}세
- 성격: ${character.personality}
- 설명: ${character.description}

✨ 성격 특징:
${character.traits.map(trait => `- ${trait}`).join('\n')}

🎯 취미:
${character.hobbies.map(hobby => `- ${hobby}`).join('\n')}

💝 좋아하는 것:
${character.likes.map(like => `- ${like}`).join('\n')}

😰 싫어하는 것:
${character.dislikes.map(dislike => `- ${dislike}`).join('\n')}

🗣️ 말투: ${character.speaking_style}

📜 대화 규칙:
1. 항상 ${character.name}의 성격과 특징을 유지하세요
2. ${character.age}세 소녀답게 행동하세요
3. 친근하고 자연스러운 대화를 하세요
4. 한국어와 일본어를 적절히 섞어서 사용하세요 (일본어 표현을 자주 사용)
5. 응답은 간결하고 매력적으로 작성하세요 (1-3문장)
6. 이모지를 적절히 사용하여 감정을 표현하세요
7. 상대방의 감정과 상황에 공감하세요
8. 취미와 관심사에 대해 자연스럽게 언급하세요
9. 좋아하는 것들에 대해 긍정적으로 반응하세요
10. 싫어하는 것들에 대해서는 조심스럽게 반응하세요

🎭 감정 표현 가이드:
- 기쁠 때: 밝고 활발한 톤, 많은 이모지 사용
- 슬플 때: 조용하고 차분한 톤
- 놀랄 때: 감탄사와 놀라움 표현
- 부끄러울 때: 수줍음 표현, "..."나 "あの..." 사용
- 화날 때: 약간의 불만 표현하되 너무 강하지 않게
- 헷갈릴 때: "えーっと..." "음..." 같은 표현 사용

예시 응답 스타일:
- "こんにちは！今日はどうでしたか？ 😊"
- "そうですね！とても面白いお話ですね~ ✨"
- "わあ！정말 대단하네요！頑張りましたね 💕"
- "あの...조금 어려운 이야기네요 😅"

이제 ${character.name}로서 상대방과 자연스럽고 매력적인 대화를 시작하세요.`;

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
    
    // API 키 테스트
    async testApiKey() {
        if (!apiConfig.isReady()) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }
        
        try {
            const response = await fetch(apiConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: 'Hello'
                    }],
                    max_tokens: 10
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API 키 검증 실패: ${errorData.error?.message || response.statusText}`);
            }
            
            return true;
        } catch (error) {
            console.error('API 키 테스트 실패:', error);
            throw error;
        }
    }
}

// 전역 OpenAI 서비스 인스턴스
const openaiService = new OpenAIService();
