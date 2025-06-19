# AI 챗봇 백엔드 서버 (Vercel/Netlify 배포용)

이 폴더에는 안전한 API 키 관리를 위한 백엔드 서버 코드가 포함되어 있습니다.

## 🚀 배포 옵션

### Option 1: Vercel (권장)
```bash
# 1. Vercel 계정 생성 및 CLI 설치
npm i -g vercel

# 2. 백엔드 폴더로 이동
cd backend

# 3. 배포
vercel --prod
```

### Option 2: Netlify Functions
```bash
# 1. Netlify 계정 생성
# 2. netlify.toml 설정
# 3. 환경 변수 설정
# 4. Git 연동 배포
```

## 🔐 환경 변수 설정

배포 후 다음 환경 변수를 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📁 백엔드 구조

```
backend/
├── api/
│   ├── session.js      # 세션 관리
│   ├── chat.js         # 채팅 API
│   └── validate.js     # 토큰 검증
├── utils/
│   ├── auth.js         # 인증 유틸리티
│   └── openai.js       # OpenAI 클라이언트
└── package.json
```

## 🛡️ 보안 특징

- JWT 토큰 기반 인증
- API 키 서버 사이드 보관
- CORS 설정
- Rate Limiting
- 요청 검증

## 📝 API 엔드포인트

- `POST /api/session` - 세션 생성
- `POST /api/chat` - 채팅 요청
- `GET /api/session/validate` - 세션 검증
- `POST /api/session/end` - 세션 종료
