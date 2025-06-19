// OpenAI API 서비스 (Vercel 인증 문제로 로컬 전용)
class OpenAIService {
    constructor() {
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // 대화 기록 최대 길이
    }
    
    // 채팅 완성 API 호출 (로컬 응답 사용)
    async generateResponse(userMessage, character) {
        try {
            // 대화 기록에 사용자 메시지 추가
            this.addToHistory('user', userMessage);
            
            // 로컬에서 라스크 응답 생성
            const response = this.generateRuskResponse(userMessage);
            
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
    
    // 라스크 캐릭터 응답 생성 (로컬)
    generateRuskResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // 인사말
        if (message.includes('안녕') || message.includes('hello') || message.includes('hi') || message.includes('こんにちは')) {
            const greetings = [
                "こんにちは！ラスクです~ 오늘 기분이 어떠세요? 😊",
                "わあ！안녕하세요! 저는 라스크예요~ 만나서 반가워요! ✨",
                "そうですね！안녕하세요! 오늘도 좋은 하루 보내고 계신가요? 💕"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // 질문
        if (message.includes('?') || message.includes('뭐') || message.includes('어떻게') || message.includes('무엇') || message.includes('왜')) {
            const questions = [
                "えーっと...그건 정말 어려운 질문이네요! 😅 저도 잘 모르겠어요~",
                "そうですね！저도 그게 궁금해요! 함께 생각해볼까요? 🤔",
                "わあ！재미있는 질문이네요! 어떻게 생각하세요? ✨"
            ];
            return questions[Math.floor(Math.random() * questions.length)];
        }
        
        // 감정 표현 (긍정)
        if (message.includes('좋다') || message.includes('기쁘다') || message.includes('행복') || message.includes('재미')) {
            const positive = [
                "わあ！정말 기쁘네요! 저도 덩달아 기분이 좋아져요~ 😄",
                "そうですね！좋은 일이 있으신 것 같아요! 축하해요! 🎉",
                "ありがとうございます！행복한 기운이 전해져요~ 💕"
            ];
            return positive[Math.floor(Math.random() * positive.length)];
        }
        
        // 감정 표현 (부정)
        if (message.includes('슬프다') || message.includes('힘들다') || message.includes('우울') || message.includes('아프다')) {
            const comfort = [
                "そうですね...힘든 일이 있으셨나봐요 😔 괜찮아요, 제가 옆에 있을게요!",
                "えーっと...슬픈 일이 있으시군요 💧 언제든 이야기해주세요!",
                "わあ...힘내세요! 모든 일이 잘 될 거예요! 😊"
            ];
            return comfort[Math.floor(Math.random() * comfort.length)];
        }
        
        // 자기소개 요청
        if (message.includes('자기소개') || message.includes('누구') || message.includes('이름') || message.includes('소개')) {
            return "こんにちは！저는 ラスク(라스크)예요! 16살이고요~ 😊 사람들과 이야기하는 걸 정말 좋아해요! よろしくお願いします! ✨";
        }
        
        // 취미/관심사
        if (message.includes('취미') || message.includes('좋아') || message.includes('관심')) {
            const hobbies = [
                "わあ！저는 음악 듣기랑 책 읽기를 좋아해요! 😊 특히 J-POP을 자주 들어요~",
                "そうですね！저는 요리하는 것도 좋아해요! 🍰 같이 요리해볼까요?",
                "えーっと...게임도 좋아하고 영화 보는 것도 좋아해요! 😄"
            ];
            return hobbies[Math.floor(Math.random() * hobbies.length)];
        }
        
        // 고마움 표현
        if (message.includes('고마워') || message.includes('감사') || message.includes('ありがとう')) {
            const thanks = [
                "どういたしまして！별말씀을요~ 언제든 도와드릴게요! 😊",
                "ありがとうございます！저도 이야기할 수 있어서 즐거워요! ✨",
                "そうですね！천만에요~ 더 이야기해요! 💕"
            ];
            return thanks[Math.floor(Math.random() * thanks.length)];
        }
        
        // 날씨 관련
        if (message.includes('날씨') || message.includes('비') || message.includes('눈') || message.includes('바람')) {
            const weather = [
                "そうですね！오늘 날씨 어떤가요? 저는 맑은 날씨를 좋아해요~ ☀️",
                "わあ！날씨 이야기네요! 비오는 날엔 집에서 책 읽는 게 좋아요~ 🌧️",
                "えーっと...날씨에 따라 기분도 달라지죠! 😊"
            ];
            return weather[Math.floor(Math.random() * weather.length)];
        }
        
        // 음식 관련
        if (message.includes('음식') || message.includes('먹다') || message.includes('맛있다') || message.includes('요리')) {
            const food = [
                "わあ！음식 이야기네요! 저는 단 것을 좋아해요~ 🍰 특히 케이크!",
                "そうですね！일본 음식도 좋아하고 한국 음식도 좋아해요! 😋",
                "ありがとうございます！같이 맛있는 것 먹고 싶어요~ ✨"
            ];
            return food[Math.floor(Math.random() * food.length)];
        }
        
        // 기본 응답들
        const defaultResponses = [
            "そうですね！정말 재미있는 이야기네요! 더 들려주세요~ ✨",
            "わあ！그렇군요! 저도 그런 얘기 들으면 기분이 좋아져요~ 😊",
            "ありがとうございます！언제든 편하게 이야기해주세요! 🌟",
            "えーっと...그게 무슨 뜻인지 잘 모르겠어요 😅 더 쉽게 설명해주실래요?",
            "そうそう！저도 그렇게 생각해요! 좋은 아이디어네요! 💡",
            "こんな感じ！어떻게 생각하세요? 괜찮나요? 😄",
            "すごい！정말 대단하네요! 더 자세히 알려주세요! 🤩",
            "なるほど！그런 일이 있었군요~ 흥미로워요! 😮"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // 시스템 메시지 생성 (더 이상 사용하지 않음)
    createSystemMessage(character) {
        return {
            role: 'system',
            content: '라스크 캐릭터의 로컬 응답을 생성합니다.'
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
    
    // API 테스트 (항상 성공)
    async testApiKey() {
        console.log('로컬 모드 사용 중 - API 테스트 항상 성공');
        return true;
    }
}

// 전역 OpenAI 서비스 인스턴스
const openaiService = new OpenAIService();
