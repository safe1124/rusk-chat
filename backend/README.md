# Backend for AI Character Chatbot

이 폴더는 안전한 OpenAI API 키 관리를 위한 백엔드 서버리스 함수들을 포함합니다.

## 🚀 Vercel 배포 및 API 키 설정

### 1단계: 프로젝트 배포

```bash
# 백엔드 폴더로 이동하세요
cd backend

# Vercel에 배포 (브라우저에서 로그인 필요)
npx vercel --prod
```

### 2단계: 환경 변수 설정 (중요!)

#### ✅ 방법 A: Vercel 웹사이트에서 설정 (추천)

1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **배포된 프로젝트 선택**
3. **Settings** 탭 → **Environment Variables** 메뉴
4. **Add New** 버튼 클릭하여 다음 변수 추가:
   ```
   Name: OPENAI_API_KEY
   Value: sk-proj-xxxxxxxxxxxxxxxxx (실제 API 키)
   Environment: Production, Preview, Development (모두 체크)
   ```
5. **Save** 버튼 클릭

#### 방법 B: Vercel CLI로 설정

```bash
vercel env add OPENAI_API_KEY
# 프롬프트에서 API 키 입력 및 환경 선택
```

### 3단계: 재배포 (환경 변수 적용암)

```bash
vercel --prod
```

### 4단계: 프론트엔드 설정 업데이트

배포된 백엔드 URL을 메모하고, 프론트엔드 `js/config.js` 파일을 업데이트:

```javascript
const config = {
    backend: {
        url: 'https://your-project-name.vercel.app'  // 실제 배포된 URL로 변경
    }
};
```

## � 로컬 개발

1. **환경 변수 파일 생성**:
```bash
cp .env.example .env
# .env 파일을 열어서 실제 OpenAI API 키 입력
```

2. **로컬 개발 서버 실행**:
```bash
npx vercel dev
```

## 📋 API 엔드포인트

- `POST /api/chat` - OpenAI API를 통한 채팅 응답
  - 요청: `{ messages: Array, character: Object }`
  - 응답: `{ message: string, usage: Object }`

## 🔒 보안 체크리스트

✅ API 키가 환경 변수에 설정되었는지 확인
✅ `.env` 파일이 `.gitignore`에 포함되었는지 확인  
✅ 프론트엔드 도메인이 CORS에서 허용되는지 확인
✅ 배포 후 API 엔드포인트가 정상 작동하는지 테스트

## 🆘 문제 해결

**API 키 오류가 나는 경우:**
1. Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
2. 재배포 후 변경사항이 적용되었는지 확인
3. API 키가 'sk-proj-'로 시작하는 올바른 형식인지 확인

**CORS 오류가 나는 경우:**
1. 프론트엔드 도메인이 백엔드 CORS 설정에 포함되었는지 확인
2. HTTPS 사용 여부 확인

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
