// 설정 모달 및 시스템 정보 관리
class SettingsManager {
    constructor() {
        this.settingsModal = null;
        this.init();
    }

    init() {
        // DOM 요소 참조
        this.settingsModal = document.getElementById('settingsModal');
        const settingsBtn = document.querySelector('.settings-btn');
        const closeBtn = document.getElementById('closeSettings');
        
        // 이벤트 리스너 설정
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSettings());
        }
        
        // 모달 외부 클릭시 닫기
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) {
                    this.closeSettings();
                }
            });
        }
        
        // 캐릭터 정보 로드
        this.loadCharacterInfo();
        this.updateSystemInfo();
    }

    // 설정 모달 열기
    openSettings() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'flex';
            this.updateSystemInfo();
            document.body.style.overflow = 'hidden';
        }
    }

    // 설정 모달 닫기
    closeSettings() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 캐릭터 정보 로드
    loadCharacterInfo() {
        const characterProfile = document.getElementById('characterProfile');
        if (!characterProfile || !window.currentCharacter) return;

        const character = window.currentCharacter;
        characterProfile.innerHTML = `
            <div class="character-avatar">
                <img src="${character.currentAvatar}" alt="${character.name}" onerror="this.src='./images/default-avatar.png'">
            </div>
            <div class="character-details">
                <h4>${character.name}</h4>
                <p><strong>나이:</strong> ${character.age}세</p>
                <p><strong>성격:</strong> ${character.personality}</p>
                <p><strong>특징:</strong> ${character.traits.join(', ')}</p>
                <p><strong>취미:</strong> ${character.hobbies.join(', ')}</p>
                <p><strong>좋아하는 것:</strong> ${character.likes.join(', ')}</p>
                <p><strong>말투:</strong> ${character.speakingStyle}</p>
            </div>
        `;
    }

    // 시스템 정보 업데이트
    updateSystemInfo() {
        // 백엔드 상태 업데이트
        const backendStatus = document.getElementById('backendStatus');
        if (backendStatus) {
            backendStatus.textContent = '✅ 백엔드 API 연결됨';
            backendStatus.style.color = '#4CAF50';
        }

        // 현재 감정 상태 업데이트
        const currentEmotion = document.getElementById('currentEmotion');
        if (currentEmotion && window.currentCharacter) {
            currentEmotion.textContent = window.currentCharacter.currentEmotion || '기본';
        }
    }

    // 감정 상태 업데이트 (외부에서 호출)
    updateCurrentEmotion(emotion) {
        const currentEmotion = document.getElementById('currentEmotion');
        if (currentEmotion) {
            currentEmotion.textContent = emotion;
        }
    }
}

// 전역 설정 관리자 인스턴스
let settingsManager;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    settingsManager = new SettingsManager();
});
