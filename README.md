# 🤖 ラスク AI 챗봇

스마트폰에 최적화된 AI 캐릭터 ラスク와의 대화형 웹 애플리케이션입니다.

## ✨ 주요 기능

- **📱 모바일 최적화**: 스마트폰 해상도에 맞춘 반응형 디자인
- **🤖 실제 AI 대화**: OpenAI GPT API 연동으로 자연스러운 대화
- **🎭 감정 인식 아바타**: AI 감정 분석으로 실시간 아바타 변경
- **🎨 캐릭터 커스터마이징**: 상세한 캐릭터 설정 (나이, 성격, 취미 등)
- **🔐 안전한 API 관리**: 로컬/백엔드 이중 보안 시스템
- **💬 실시간 채팅**: 자연스러운 대화 인터페이스
- **🌏 다국어 지원**: 한국어/일본어 인터페이스
- **♿ 접근성**: 스크린 리더 및 키보드 네비게이션 지원

## 🎯 AI 캐릭터

### � ラスク (Rask)
- **성격**: 상냥하고 친근한 AI 캐릭터
- **특징**: 따뜻하고 도움을 주는 성향
- **언어**: 일본어 기반의 자연스러운 대화

## 🚀 시작하기

### 필수 요구사항
- 모던 웹 브라우저 (Chrome, Safari, Firefox, Edge)
- 인터넷 연결

### 설치 및 실행

1. **프로젝트 클론**
   ```bash
   git clone <repository-url>
   cd ruskchan
   ```

2. **이미지 파일 준비**
   - `images/` 폴더에 ラスク 캐릭터 아바타 이미지를 추가하세요
   - 파일명: `rask.png`
   - 자세한 내용은 `images/README.md`를 참조하세요

3. **웹 서버 실행**
   ```bash
   # Python 3가 설치된 경우
   python -m http.server 8000
   
   # 또는 Node.js가 설치된 경우
   npx serve .
   ```

4. **브라우저에서 열기**
   - http://localhost:8000 접속

## 📱 모바일 최적화

이 애플리케이션은 **모바일 퍼스트** 원칙으로 설계되었습니다:

- 터치 친화적인 UI 요소
- 스마트폰 화면에 최적화된 레이아웃
- 세로 모드 우선 디자인
- 빠른 로딩과 부드러운 애니메이션

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox/Grid, 애니메이션
- **Vanilla JavaScript**: 프레임워크 없는 순수 JS
- **웹 표준**: 접근성 및 성능 최적화

## 📂 프로젝트 구조

```
ruskchan/
├── index.html              # 메인 HTML 파일
├── css/
│   └── style.css           # 스타일시트
├── js/
│   ├── main.js            # 메인 애플리케이션
│   ├── chatbot.js         # 채팅봇 로직
│   └── characters.js      # 캐릭터 관리
├── images/                # 이미지 리소스
│   └── README.md         # 이미지 가이드
└── .github/
    └── copilot-instructions.md
```

## 💡 사용법

### 기본 사용법
1. **메시지 입력**: 하단의 입력창에 메시지 작성
2. **대화 시작**: 전송 버튼 또는 Enter 키로 메시지 전송
3. **자연스러운 대화**: ラスク와 자유롭게 대화 (한국어/일본어 지원)

### AI 모드 사용법
1. **설정 열기**: 우상단의 ⚙️ 버튼 클릭
2. **API 키 입력**: OpenAI API 키를 입력하고 저장
3. **AI 대화**: 실제 AI와 자연스러운 대화 가능
4. **로컬 모드**: API 키 없이도 기본 패턴 응답으로 사용 가능

## 🎨 커스터마이징

### ラスク 캐릭터 수정
`js/characters.js` 파일에서 ラスク의 성격이나 응답을 수정할 수 있습니다:

```javascript
{
    id: 'rask',
    name: 'ラスク',
    personality: '캐릭터 설명 수정',
    // ...응답 패턴 수정
}
```

### 스타일 변경
`css/style.css`에서 색상, 폰트, 레이아웃을 자유롭게 수정할 수 있습니다.

## 🔧 향후 개발 계획

- [ ] PWA (Progressive Web App) 지원
- [ ] 음성 인식 및 TTS 기능
- [ ] 채팅 기록 저장/내보내기
- [ ] 대화 컨텍스트 개선
- [ ] GPT-4 모델 지원
- [ ] ラスク 캐릭터 개선
- [ ] 테마 변경 기능
- [ ] 오프라인 모드 개선

## 🤝 기여하기

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 📞 지원

- **이슈**: GitHub Issues를 통해 버그 리포트 및 기능 요청
- **문서**: 프로젝트 Wiki 참조
- **업데이트**: Release 페이지에서 최신 버전 확인

## 🔑 OpenAI API 설정

### API 키 발급
1. [OpenAI Platform](https://platform.openai.com/api-keys)에 접속
2. 계정 생성 및 로그인
3. "Create new secret key" 클릭
4. API 키 복사 (sk-...로 시작)

### API 키 설정
1. 웹사이트 우상단의 ⚙️ 버튼 클릭
2. "OpenAI API 설정" 섹션에서 API 키 입력
3. "저장" 버튼 클릭
4. "테스트" 버튼으로 연결 확인

### 요금 정보
- GPT-3.5-turbo: $0.002/1K tokens (매우 저렴)
- GPT-4: $0.03/1K tokens
- 일반적인 채팅 1회당 약 $0.001-0.01

### 보안
- API 키는 브라우저의 로컬 스토리지에만 저장
- 서버로 전송되지 않음
- 언제든지 설정에서 삭제 가능

## 🎭 감정 기반 아바타 시스템

### 감정 인식
AI가 대화 내용을 실시간으로 분석하여 다음 감정들을 인식합니다:
- 😊 **기쁨**: 칭찬, 좋은 소식, 긍정적인 대화
- 😢 **슬픔**: 위로가 필요한 내용, 작별 인사
- 🤩 **흥분**: 놀라운 소식, 감탄사가 많은 응답
- 😕 **혼란**: 어려운 질문, 모르겠다는 표현
- 😠 **화남**: 불만, 짜증 표현 (드물게)
- 😲 **놀람**: 예상치 못한 소식, 충격적인 내용
- 😳 **부끄러움**: 칭찬받을 때, 수줍은 상황

### 아바타 변경
- 실시간으로 감정에 맞는 아바타로 자동 변경
- 헤더, 채팅 메시지, 타이핑 인디케이터 모든 아바타 동기화
- 부드러운 트랜지션 효과

## 🛡️ 보안 시스템 (온라인 배포)

### 3단계 보안 레벨

#### 🟢 Level 1: 개발 환경
- 로컬 스토리지에 API 키 저장
- 브라우저에서 직접 OpenAI API 호출
- 개발 및 테스트 용도

#### 🟡 Level 2: 프로덕션 (클라이언트)
- API 키 로컬 저장 시 보안 경고 표시
- 마스킹 처리로 키 보호
- 사용자 책임하에 사용

#### 🔴 Level 3: 프로덕션 (백엔드)
- 서버사이드 API 키 관리
- JWT 토큰 기반 인증
- Rate Limiting 및 CORS 보호
- 최고 수준의 보안

### 백엔드 배포 가이드

1. **Vercel 배포** (권장)
   ```bash
   cd backend
   vercel --prod
   ```

2. **환경 변수 설정**
   ```env
   OPENAI_API_KEY=your_api_key
   JWT_SECRET=your_secret
   ALLOWED_ORIGINS=https://your-domain.com
   ```

3. **프론트엔드 설정 수정**
   ```javascript
   // js/environment.js에서 백엔드 URL 업데이트
   return 'https://your-backend.vercel.app';
   ```

---

💻 **ラスクとの 즐거운 대화를 즐기세요!** 🚀

