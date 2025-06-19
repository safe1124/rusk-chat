// 채팅봇 클래스
class Chatbot {
    constructor() {
        console.log("Chatbot 인스턴스 생성");
        this.character = null;
        this.messages = [];
        this.domElements = {};
        this.backend = window.backend;
        this.settingsManager = window.settingsManager;

        this.initialize();
    }

    // 초기화
    initialize() {
        this.cacheDOMElements();
        this.bindEvents();
        this.loadInitialCharacter();
        this.loadChatHistory();
        this.updateUI();
        console.log("Chatbot 초기화 완료");
    }

    // DOM 요소 캐싱
    cacheDOMElements() {
        this.domElements = {
            chatContainer: document.getElementById('chatContainer'),
            chatMessages: document.getElementById('chatMessages'),
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            characterAvatar: document.getElementById('characterAvatar'),
            characterName: document.getElementById('characterName'),
            characterStatus: document.getElementById('characterStatus'),
            typingIndicator: document.getElementById('typingIndicator'),
            charCount: document.getElementById('charCount'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings'),
            backendStatus: document.getElementById('backendStatus'),
            currentEmotion: document.getElementById('currentEmotion')
        };
    }

    // 이벤트 바인딩
    bindEvents() {
        this.domElements.sendBtn.addEventListener('click', () => this.sendMessage());
        this.domElements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.domElements.messageInput.addEventListener('input', () => this.updateCharCount());

        // 설정 버튼 이벤트는 settings.js에서 처리
    }

    // 초기 캐릭터 로드
    loadInitialCharacter() {
        if (window.characterManager) {
            this.character = window.characterManager.getCharacterById('rusk');
            this.updateCharacterInfo();
        } else {
            console.error("CharacterManager를 찾을 수 없습니다.");
        }
    }

    // 캐릭터 정보 UI 업데이트
    updateCharacterInfo() {
        if (this.character) {
            this.domElements.characterName.textContent = this.character.name;
            this.domElements.characterAvatar.src = this.character.avatars.default;
            // 타이핑 인디케이터 아바타도 업데이트
            const typingAvatar = this.domElements.typingIndicator.querySelector('img');
            if(typingAvatar) typingAvatar.src = this.character.avatars.default;
        }
    }

    // 채팅 기록 로드
    loadChatHistory() {
        const savedMessages = utils.loadData('chatHistory');
        if (savedMessages) {
            this.messages = savedMessages;
            this.messages.forEach(msg => this.addMessageToUI(msg.role, msg.content));
        }
    }

    // 채팅 기록 저장
    saveChatHistory() {
        utils.saveData('chatHistory', this.messages);
    }

    // 메시지 전송
    async sendMessage() {
        const messageText = this.domElements.messageInput.value.trim();
        if (!messageText) return;

        this.addMessageToUI('user', messageText);
        this.messages.push({ role: 'user', content: messageText });
        this.saveChatHistory();

        this.domElements.messageInput.value = '';
        this.updateCharCount();
        this.showTypingIndicator();

        try {
            const responseText = await this.backend.sendMessage(this.messages);
            this.addMessageToUI('assistant', responseText);
            this.messages.push({ role: 'assistant', content: responseText });
            this.saveChatHistory();
        } catch (error) {
            console.error('메시지 전송 실패:', error);
            this.addMessageToUI('system', `오류: ${error.message}`);
        }

        this.hideTypingIndicator();
    }

    // UI에 메시지 추가
    addMessageToUI(role, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${role}-message`);

        if (role === 'user') {
            messageElement.innerHTML = `<div class="message-bubble">${content}</div>`;
        } else if (role === 'assistant') {
            messageElement.innerHTML = `
                <img src="${this.character.avatars.default}" alt="${this.character.name}" class="message-avatar">
                <div class="message-bubble">${content}</div>
            `;
        } else { // system
             messageElement.innerHTML = `<div class="message-bubble system-bubble">${content}</div>`;
        }

        this.domElements.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    // 타이핑 인디케이터 표시/숨김
    showTypingIndicator() {
        this.domElements.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.domElements.typingIndicator.style.display = 'none';
    }

    // 스크롤을 맨 아래로
    scrollToBottom() {
        this.domElements.chatContainer.scrollTop = this.domElements.chatContainer.scrollHeight;
    }

    // 글자 수 카운트 업데이트
    updateCharCount() {
        const currentLength = this.domElements.messageInput.value.length;
        const maxLength = this.domElements.messageInput.maxLength;
        this.domElements.charCount.textContent = `${currentLength}/${maxLength}`;
        this.domElements.sendBtn.disabled = currentLength === 0;
    }

    // 전체 UI 상태 업데이트
    updateUI() {
        this.updateCharacterInfo();
        this.updateCharCount();
    }
}

// 전역 채팅봇 인스턴스
let chatbot;
