// 메인 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 애플리케이션 초기화
    initializeApp();
});

// 애플리케이션 초기화 함수
function initializeApp() {
    console.log('AI 캐릭터 챗봇 애플리케이션 시작...');
    
    // 채팅봇 인스턴스 생성
    chatbot = new Chatbot();
    
    // PWA 지원 확인
    checkPWASupport();
    
    // 성능 최적화
    optimizePerformance();
    
    // 에러 핸들링 설정
    setupErrorHandling();
    
    // 접근성 개선
    improveAccessibility();
    
    console.log('애플리케이션 초기화 완료!');
}

// PWA 지원 확인 및 설정
function checkPWASupport() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // 서비스 워커는 향후 구현 예정
            console.log('PWA 지원 가능');
        });
    }
    
    // 앱 설치 프롬프트 처리
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // 설치 버튼 표시 (향후 구현)
        console.log('앱 설치 가능');
    });
}

// 성능 최적화
function optimizePerformance() {
    // 이미지 지연 로딩
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 메모리 정리
    window.addEventListener('beforeunload', () => {
        // 정리 작업
        if (chatbot) {
            chatbot.hideTypingIndicator();
        }
    });
}

// 에러 핸들링 설정
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('JavaScript 에러:', event.error);
        showErrorMessage('애플리케이션에서 오류가 발생했습니다.');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promise 거부:', event.reason);
        showErrorMessage('네트워크 오류가 발생했습니다.');
    });
}

// 에러 메시지 표시
function showErrorMessage(message) {
    // 토스트 메시지 생성
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 접근성 개선
function improveAccessibility() {
    // 키보드 네비게이션 개선
    document.addEventListener('keydown', (e) => {
        // ESC 키로 설정 모달 닫기
        if (e.key === 'Escape') {
            const modal = document.querySelector('.settings-modal.active');
            if (modal && chatbot) {
                chatbot.closeSettingsModal();
            }
        }
        
        // 다른 키보드 단축키들을 여기에 추가할 수 있음
    });
    
    // 스크린 리더 지원
    addScreenReaderSupport();
}

// Tab 키 트래핑
function trapTabKey(e, element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// 스크린 리더 지원
function addScreenReaderSupport() {
    // ARIA 라벨 추가
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        chatContainer.setAttribute('role', 'log');
        chatContainer.setAttribute('aria-live', 'polite');
        chatContainer.setAttribute('aria-label', '채팅 메시지');
    }
    
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.setAttribute('aria-label', '메시지 입력');
    }
    
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.setAttribute('aria-label', '메시지 전송');
    }
}

// 유틸리티 함수들
const utils = {
    // 디바이스 타입 확인
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // 터치 디바이스 확인
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // 온라인 상태 확인
    isOnline: () => {
        return navigator.onLine;
    },
    
    // 로컬 스토리지 지원 확인
    hasLocalStorage: () => {
        try {
            const test = '__localStorageTest__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // 데이터 저장
    saveData: (key, data) => {
        if (utils.hasLocalStorage()) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('데이터 저장 실패:', e);
                return false;
            }
        }
        return false;
    },
    
    // 데이터 로드
    loadData: (key) => {
        if (utils.hasLocalStorage()) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('데이터 로드 실패:', e);
                return null;
            }
        }
        return null;
    },
    
    // 디바운스 함수
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 쓰로틀 함수
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 네트워크 상태 모니터링
window.addEventListener('online', () => {
    console.log('온라인 상태로 변경됨');
    document.getElementById('characterStatus').textContent = '☁️ Netlify 백엔드 연결';
});

window.addEventListener('offline', () => {
    console.log('오프라인 상태로 변경됨');
    document.getElementById('characterStatus').textContent = '❌ 오프라인 (백엔드 연결 안 됨)';
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
