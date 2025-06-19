// 채팅봇 클래스
class Chatbot {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.typingDelay = 1000; // 기본 타이핑 지연시간
        this.maxTypingDelay = 3000; // 최대 타이핑 지연시간
        
        this.initializeElements();
        this.bindEvents();
        this.loadWelcomeMessage();
    }
    
    // DOM 요소 초기화
    initializeElements() {
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.charCount = document.getElementById('charCount');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.characterAvatar = document.getElementById('characterAvatar');
        this.characterName = document.getElementById('characterName');
        this.characterStatus = document.getElementById('characterStatus');
        this.attachmentBtn = document.getElementById('attachmentBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.testApiBtn = document.getElementById('testApi');
        this.clearApiBtn = document.getElementById('clearApi');
    }
    
    // 이벤트 리스너 바인딩
    bindEvents() {
        // 메시지 입력 관련
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // 첨부파일 버튼 (향후 구현)
        this.attachmentBtn.addEventListener('click', () => this.handleAttachment());
        
        // 설정 관련
        this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
        
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.testApiBtn.addEventListener('click', () => this.testApiKey());
        this.clearApiBtn.addEventListener('click', () => this.clearApiSettings());
        
        // 자동 리사이즈
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // 설정 UI 초기화
        this.initializeSettings();
    }
    
    // 캐릭터 UI 업데이트
    updateCharacterUI() {
        const character = characterManager.getCurrentCharacter();
        const currentAvatar = characterManager.getCurrentAvatar();
        
        this.characterAvatar.src = currentAvatar;
        this.characterAvatar.onerror = () => {
            this.characterAvatar.src = character.avatars.default || 'images/default-avatar.png';
        };
        this.characterName.textContent = character.name;
        
        // 타이핑 인디케이터 아바타도 업데이트
        const typingAvatar = this.typingIndicator.querySelector('.typing-avatar img');
        if (typingAvatar) {
            typingAvatar.src = currentAvatar;
            typingAvatar.onerror = () => {
                typingAvatar.src = character.avatars.default || 'images/default-avatar.png';
            };
        }
        
        // 환영 메시지 아바타도 업데이트
        const welcomeAvatar = this.chatMessages.querySelector('.intro-avatar');
        if (welcomeAvatar) {
            welcomeAvatar.src = currentAvatar;
            welcomeAvatar.onerror = () => {
                welcomeAvatar.src = character.avatars.default || 'images/default-avatar.png';
            };
        }
    }
    
    // 입력 변화 처리
    handleInputChange() {
        const value = this.messageInput.value;
        const length = value.length;
        
        // 글자 수 업데이트
        this.charCount.textContent = `${length}/1000`;
        
        // 전송 버튼 활성화/비활성화
        this.sendBtn.disabled = length === 0 || length > 1000;
        
        // 글자 수 색상 변경
        if (length > 900) {
            this.charCount.style.color = length > 1000 ? '#ef4444' : '#f59e0b';
        } else {
            this.charCount.style.color = '#9ca3af';
        }
    }
    
    // 키 입력 처리
    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }
    
    // 텍스트영역 자동 리사이즈
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
    }
    
    // 첨부파일 처리 (향후 구현)
    handleAttachment() {
        // TODO: 파일 첨부 기능 구현
        console.log('첨부파일 기능은 향후 구현 예정입니다.');
    }
    
    // 환영 메시지 로드
    loadWelcomeMessage() {
        // 초기 UI 설정
        this.updateCharacterUI();
    }
    
    // 메시지 전송
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // 사용자 메시지 추가
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.handleInputChange();
        this.autoResizeTextarea();
        
        // AI 응답 생성
        this.generateBotResponse(message);
    }
    
    // 메시지 추가
    addMessage(sender, content, timestamp = new Date()) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const timeString = timestamp.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let messageHTML = '';
        
        if (sender === 'user') {
            messageHTML = `
                <div class="message-content">
                    ${this.escapeHtml(content)}
                    <div class="message-time">${timeString}</div>
                </div>
                <img src="images/user-avatar.png" alt="사용자" class="message-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHg9IjgiIHk9IjgiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K'">
            `;
        } else {
            const character = characterManager.getCurrentCharacter();
            const currentAvatar = characterManager.getCurrentAvatar();
            messageHTML = `
                <img src="${currentAvatar}" alt="${character.name}" class="message-avatar" onerror="this.src='${character.avatars.default || 'images/default-avatar.png'}'">
                <div class="message-content">
                    ${this.escapeHtml(content)}
                    <div class="message-time">${timeString}</div>
                </div>
            `;
        }
        
        messageDiv.innerHTML = messageHTML;
        
        // 환영 메시지 제거 (첫 메시지일 때)
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // 메시지 기록
        this.messages.push({
            sender,
            content,
            timestamp
        });
    }
    
    // 설정 관련 메서드들
    initializeSettings() {
        if (this.apiKeyInput) {
            // 기존 API 키 표시 (마스킹)
            if (apiConfig.apiKey) {
                this.apiKeyInput.value = '*'.repeat(20) + apiConfig.apiKey.slice(-8);
            }
        }
        
        this.updateSettingsUI();
        this.updateConnectionStatus();
    }
    
    // 설정 UI 업데이트
    updateSettingsUI() {
        // 캐릭터 프로필 업데이트
        this.updateCharacterProfile();
        
        // 보안 정보 업데이트
        this.updateSecurityInfo();
        
        // 환경 정보 업데이트
        this.updateEnvironmentInfo();
    }
    
    // 캐릭터 프로필 업데이트
    updateCharacterProfile() {
        const profileElement = document.getElementById('characterProfile');
        if (!profileElement) return;
        
        const character = characterManager.getCharacterDetails();
        const currentAvatar = characterManager.getCurrentAvatar();
        
        profileElement.innerHTML = `
            <div class="character-card-large">
                <img src="${currentAvatar}" alt="${character.name}" class="character-avatar-large" onerror="this.src='images/default-avatar.png'">
                <div class="character-info-detailed">
                    <h4>${character.name} (${character.age}세)</h4>
                    <p class="character-desc">${character.description}</p>
                    <div class="character-traits">
                        <strong>성격:</strong> ${character.traits.join(', ')}
                    </div>
                    <div class="character-hobbies">
                        <strong>취미:</strong> ${character.hobbies.join(', ')}
                    </div>
                    <div class="character-emotion">
                        <strong>현재 감정:</strong> <span id="emotionDisplay">${this.getEmotionText(character.current_emotion)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 감정 텍스트 변환
    getEmotionText(emotion) {
        const emotionMap = {
            happy: '😊 기쁨',
            sad: '😢 슬픔',
            excited: '🤩 흥분',
            confused: '😕 혼란',
            angry: '😠 화남',
            surprised: '😲 놀람',
            shy: '😳 부끄러움',
            default: '😐 기본'
        };
        return emotionMap[emotion] || emotionMap.default;
    }
    
    // 보안 정보 업데이트
    updateSecurityInfo() {
        const securityInfo = apiConfig.getSecurityInfo();
        const warningElement = document.getElementById('securityWarning');
        
        if (warningElement) {
            if (securityInfo.isProduction && !securityInfo.useBackend) {
                warningElement.style.display = 'block';
            } else {
                warningElement.style.display = 'none';
            }
        }
        
        // 보안 수준 표시
        const securityLevelElement = document.getElementById('securityLevel');
        if (securityLevelElement) {
            const levelColors = {
                'High': '#22c55e',
                'Medium': '#f59e0b',
                'Low': '#ef4444'
            };
            securityLevelElement.textContent = securityInfo.securityLevel;
            securityLevelElement.style.color = levelColors[securityInfo.securityLevel];
        }
    }
    
    // 환경 정보 업데이트
    updateEnvironmentInfo() {
        const envInfoElement = document.getElementById('envInfo');
        if (envInfoElement) {
            envInfoElement.textContent = envConfig.isProduction ? '프로덕션' : '개발';
        }
        
        const emotionElement = document.getElementById('currentEmotion');
        if (emotionElement) {
            const character = characterManager.getCurrentCharacter();
            emotionElement.textContent = this.getEmotionText(character.current_emotion);
        }
    }
    
    openSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    async saveSettings() {
        if (!this.apiKeyInput) return;
        
        const apiKey = this.apiKeyInput.value.trim();
        
        // 마스킹된 키가 아닐 때만 저장
        if (apiKey && !apiKey.startsWith('*')) {
            if (!apiConfig.validateApiKey(apiKey)) {
                this.showToast('올바른 OpenAI API 키 형식이 아닙니다.', 'error');
                return;
            }
            
            apiConfig.setApiKey(apiKey);
            this.showToast('API 키가 저장되었습니다!', 'success');
            
            // 대화 기록 초기화
            openaiService.clearHistory();
        }
        
        this.updateConnectionStatus();
        this.closeSettingsModal();
    }
    
    async testApiKey() {
        if (!apiConfig.isReady()) {
            this.showToast('먼저 API 키를 저장해주세요.', 'warning');
            return;
        }
        
        try {
            this.showToast('API 키를 테스트 중입니다...', 'info');
            await openaiService.testApiKey();
            this.showToast('API 키가 정상적으로 작동합니다!', 'success');
        } catch (error) {
            this.showToast(`API 키 테스트 실패: ${error.message}`, 'error');
        }
    }
    
    clearApiSettings() {
        apiConfig.clearConfig();
        openaiService.clearHistory();
        if (this.apiKeyInput) {
            this.apiKeyInput.value = '';
        }
        this.updateConnectionStatus();
        this.showToast('설정이 초기화되었습니다.', 'info');
    }
    
    updateConnectionStatus() {
        const statusElement = document.getElementById('characterStatus');
        if (statusElement) {
            if (apiConfig.isReady()) {
                statusElement.textContent = 'AI 연결됨';
                statusElement.style.color = '#22c55e';
            } else {
                statusElement.textContent = '로컬 모드';
                statusElement.style.color = '#f59e0b';
            }
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // AI 응답 생성
    async generateBotResponse(userMessage) {
        this.showTypingIndicator();
        
        try {
            // 캐릭터 매니저를 통해 응답 생성 (이제 비동기)
            const response = await characterManager.generateResponse(userMessage);
            
            // 타이핑 지연 시뮬레이션
            const delay = Math.min(
                this.typingDelay + (response.length * 30),
                this.maxTypingDelay
            );
            
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage('bot', response);
                
                // 감정에 따른 아바타 변경 후 UI 업데이트
                this.updateCharacterUI();
            }, Math.max(delay, 1000)); // 최소 1초 대기
            
        } catch (error) {
            console.error('응답 생성 실패:', error);
            this.hideTypingIndicator();
            
            // 오류 시 기본 응답
            const fallbackResponse = characterManager.getLocalResponse('오류가 발생했습니다.');
            this.addMessage('bot', fallbackResponse);
            
            this.showToast('응답 생성 중 오류가 발생했습니다.', 'error');
        }
    }
    
    // 타이핑 인디케이터 표시
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }
    
    // 타이핑 인디케이터 숨기기
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('active');
    }
    
    // 스크롤을 맨 아래로
    scrollToBottom() {
        setTimeout(() => {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }, 100);
    }
    
    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 채팅 기록 초기화
    clearChat() {
        this.messages = [];
        this.chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="character-intro">
                    <img src="${characterManager.getCurrentCharacter().avatar}" alt="캐릭터" class="intro-avatar">
                    <div class="intro-text">
                        <h3>こんにちは! 👋</h3>
                        <p>${characterManager.getCurrentCharacter().greeting}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 메시지 기록 내보내기 (향후 구현)
    exportChat() {
        const chatData = {
            character: characterManager.getCurrentCharacter().name,
            messages: this.messages,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
}

// 전역 채팅봇 인스턴스
let chatbot;
