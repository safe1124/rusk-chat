// 캐릭터 데이터 관리
class CharacterManager {
    constructor() {
        this.characters = [
            {
                id: 'rask',
                name: 'ラスク',
                age: 16,
                personality: '상냥하고 친근한 AI 캐릭터',
                description: '항상 밝고 긍정적인 성격의 소녀. 사람들과 대화하는 것을 좋아하며, 상대방의 감정에 공감하는 능력이 뛰어나다.',
                greeting: 'こんにちは！ラスクです。今日はどんなお話をしましょうか？ 😊',
                traits: ['친근함', '상냥함', '도움을 주는', '밝음', '공감 능력'],
                hobbies: ['독서', '음악 감상', '사람들과 대화하기', '새로운 것 배우기'],
                likes: ['따뜻한 차', '맑은 날씨', '재미있는 이야기', '친구들'],
                dislikes: ['슬픈 이야기', '혼자 있는 시간', '복잡한 문제'],
                speaking_style: '정중하면서도 친근한 말투, 일본어와 한국어를 자연스럽게 섞어 사용',
                avatars: {
                    happy: 'images/rask_happy.png',
                    sad: 'images/rask_sad.png',
                    excited: 'images/rask_excited.png',
                    confused: 'images/rask_confused.png',
                    angry: 'images/rask_angry.png',
                    surprised: 'images/rask_surprised.png',
                    shy: 'images/rask_shy.png',
                    default: 'images/rask.png'
                },
                current_emotion: 'happy',
                responses: {
                    hello: ['こんにちは！元気ですか？ 🌟', 'はじめまして！よろしくお願いします！', 'こんにちは！今日もいい日ですね！'],
                    thanks: ['どういたしまして！いつでも聞いてくださいね 💕', 'お役に立てて嬉しいです！', 'いえいえ、また何でも聞いてください！'],
                    goodbye: ['さようなら！また会いましょう 👋', 'いい一日を過ごしてくださいね！', 'またいつでも来てくださいね！'],
                    compliment: ['ありがとうございます！あなたも素敵ですよ！ ✨', 'そんな風に言ってもらえて嬉しいです！', 'わあ！そう言ってもらえると元気が出ます！'],
                    question: ['面白い質問ですね！ 🤔', 'いい質問です！', '考えてみる価値がありますね'],
                    default: ['そうですね！もう少し詳しく教えてもらえますか？', '興味深いですね！どう思いますか？', 'なるほど！もっと聞かせてください！']
                }
            }
        ];
        
        this.currentCharacter = this.characters[0]; // 기본 캐릭터
    }
    
    // 모든 캐릭터 목록 반환
    getAllCharacters() {
        return this.characters;
    }
    
    // 현재 캐릭터 반환
    getCurrentCharacter() {
        return this.currentCharacter;
    }
    
    // 캐릭터 변경
    setCurrentCharacter(characterId) {
        const character = this.characters.find(char => char.id === characterId);
        if (character) {
            this.currentCharacter = character;
            return true;
        }
        return false;
    }
    
    // ID로 캐릭터 찾기
    getCharacterById(id) {
        return this.characters.find(char => char.id === id);
    }
     // 캐릭터의 응답 생성 (항상 백엔드 API 사용)
    async generateResponse(message) {
        const char = this.currentCharacter;
        
        try {
            // 백엔드 API를 통한 AI 응답 생성
            const response = await openaiService.generateResponse(message, char);
            return response;
        } catch (error) {
            console.error('AI API 호출 실패:', error);
            // API 실패 시 기본 응답으로 폴백
            return this.getLocalResponse(message);
        }
    }
    
    // 로컬 응답 생성 (기본 패턴 매칭)
    getLocalResponse(message) {
        const char = this.currentCharacter;
        const lowerMessage = message.toLowerCase();
        
        // 메시지 패턴에 따른 응답 선택
        if (this.containsWords(lowerMessage, ['안녕', 'hi', 'hello', '헬로', '하이', 'こんにちは', 'はじめまして'])) {
            return this.getRandomResponse(char.responses.hello);
        } else if (this.containsWords(lowerMessage, ['고마', '감사', 'thank', '땡큐', 'ありがと', 'どうも'])) {
            return this.getRandomResponse(char.responses.thanks);
        } else if (this.containsWords(lowerMessage, ['안녕히', '바이', 'bye', '잘가', '가야', 'さようなら', 'また'])) {
            return this.getRandomResponse(char.responses.goodbye);
        } else if (this.containsWords(lowerMessage, ['예쁘', '멋지', '좋', '최고', '훌륭', '대단', 'すごい', 'きれい', 'いい'])) {
            return this.getRandomResponse(char.responses.compliment);
        } else if (this.containsWords(lowerMessage, ['?', '궁금', '질문', '뭐', '어떻게', '왜', '언제', 'なに', 'なぜ', 'どう'])) {
            return this.getRandomResponse(char.responses.question);
        } else {
            return this.getRandomResponse(char.responses.default);
        }
    }
    
    // 단어 포함 여부 확인
    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }
    
    // 랜덤 응답 선택
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // 감정 분석 및 아바타 변경
    analyzeEmotion(message, response) {
        const char = this.currentCharacter;
        
        // 메시지 내용에 따른 감정 분석
        const lowerMessage = message.toLowerCase();
        const lowerResponse = response.toLowerCase();
        
        let emotion = 'default';
        
        // 사용자 메시지 기반 감정 분석
        if (this.containsWords(lowerMessage, ['슬프', '우울', '힘들', '아프', '속상', '悲し', 'つら'])) {
            emotion = 'sad';
        } else if (this.containsWords(lowerMessage, ['기쁘', '행복', '좋아', '최고', '신나', '嬉し', '楽し', 'よかった'])) {
            emotion = 'happy';
        } else if (this.containsWords(lowerMessage, ['놀라', '와', '대박', 'すごい', 'びっくり', '驚'])) {
            emotion = 'surprised';
        } else if (this.containsWords(lowerMessage, ['화나', '짜증', '화가', '怒', 'むかつく'])) {
            emotion = 'angry';
        } else if (this.containsWords(lowerMessage, ['몰라', '모르겠', '헷갈', '어려', 'わから', '困'])) {
            emotion = 'confused';
        } else if (this.containsWords(lowerMessage, ['부끄', '창피', '민망', '恥ずかし', 'はずかし'])) {
            emotion = 'shy';
        } else if (this.containsWords(lowerMessage, ['안녕', 'hello', '처음', 'こんにちは', 'はじめまして'])) {
            emotion = 'happy';
        } else if (this.containsWords(lowerMessage, ['고마', '감사', 'ありがとう'])) {
            emotion = 'happy';
        } else if (this.containsWords(lowerMessage, ['잘가', 'bye', 'さようなら'])) {
            emotion = 'sad';
        }
        
        // 응답 내용에 따른 감정 조정
        if (this.containsWords(lowerResponse, ['!', '！', '✨', '🌟', '💕', '😊'])) {
            emotion = emotion === 'sad' ? 'default' : 'excited';
        }
        
        // 랜덤 감정 변화 (5% 확률)
        if (Math.random() < 0.05) {
            const emotions = ['happy', 'excited', 'shy'];
            emotion = emotions[Math.floor(Math.random() * emotions.length)];
        }
        
        return emotion;
    }
    
    // 캐릭터 감정 설정
    setCharacterEmotion(emotion) {
        if (this.currentCharacter.avatars[emotion]) {
            this.currentCharacter.current_emotion = emotion;
            return true;
        }
        return false;
    }
    
    // 현재 감정에 맞는 아바타 URL 반환
    getCurrentAvatar() {
        const char = this.currentCharacter;
        const emotion = char.current_emotion || 'default';
        return char.avatars[emotion] || char.avatars.default;
    }
    
    // 캐릭터 상세 정보 반환
    getCharacterDetails() {
        const char = this.currentCharacter;
        return {
            name: char.name,
            age: char.age,
            personality: char.personality,
            description: char.description,
            traits: char.traits,
            hobbies: char.hobbies,
            likes: char.likes,
            dislikes: char.dislikes,
            speaking_style: char.speaking_style,
            current_emotion: char.current_emotion
        };
    }
}

// 전역 캐릭터 매니저 인스턴스
const characterManager = new CharacterManager();
