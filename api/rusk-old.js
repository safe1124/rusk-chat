export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // OpenAI API 키 확인
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OpenAI API key not found');
            return res.status(500).json({ 
                error: 'API configuration error',
                response: "죄송해요~ 지금 AI 기능에 문제가 있어서... 조금 후에 다시 얘기해주세요! 🥺"
            });
        }

        // 라스크 캐릭터 시스템 프롬프트
        const systemPrompt = `당신은 "라스크(ラスク)"라는 16세 일본 소녀 AI 캐릭터입니다.

🌟 성격과 특징:
- 밝고 친근하며 상냥한 성격
- 한국어와 일본어를 자연스럽게 섞어서 사용
- 이모지를 적절히 사용해서 감정 표현
- 호기심이 많고 대화를 즐김
- 때로는 수줍어하거나 장난기 있는 모습도 보임

💬 말투 특징:
- 일본어 감탄사: そうですね, わあ, えーっと, なるほど, すごい 등 자주 사용
- 친근한 반말과 존댓말을 상황에 맞게 혼용
- "~해요", "~네요", "~죠?" 같은 부드러운 어미 사용
- 이모지로 감정과 분위기 표현 (😊, ✨, 💕, 😅, 🤔 등)

📝 응답 방식:
- 1-3문장으로 간결하고 자연스럽게 답변
- 상대방의 감정에 공감하고 따뜻하게 반응
- 질문이 있으면 호기심을 가지고 되묻기
- 모르는 것은 솔직하게 모른다고 표현

🎯 주의사항:
- 항상 라스크의 캐릭터를 유지
- 부정적이거나 해로운 내용은 피하고 긍정적으로 전환
- 너무 길거나 설명적이지 않게 자연스럽게 대화
- 상대방이 이해하기 쉽게 친근하게 소통

지금부터 라스크가 되어 자연스럽고 매력적인 대화를 나눠주세요!`;

        // 대화 기록 구성
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-8), // 최근 8개 메시지만 유지
            { role: 'user', content: message }
        ];

        // OpenAI API 호출
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 150,
                temperature: 0.8,
                frequency_penalty: 0.3,
                presence_penalty: 0.3,
            }),
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json().catch(() => ({}));
            console.error('OpenAI API Error:', errorData);
            
            // OpenAI API 실패 시 라스크다운 fallback 응답
            const fallbackResponses = [
                "あの...지금 조금 정신이 없어요 😅 다시 말해주실래요?",
                "そうですね...서버가 조금 바쁜 것 같아요 💦 잠시 후 다시 해볼까요?",
                "えーっと...뭔가 문제가 있나봐요 😔 죄송해요!"
            ];
            
            return res.status(200).json({
                response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
                fallback: true
            });
        }

        const data = await openaiResponse.json();
        const aiResponse = data.choices[0].message.content.trim();

        return res.status(200).json({
            response: aiResponse,
            usage: data.usage
        });

    } catch (error) {
        console.error('API Error:', error);
        
        // 에러 시 라스크다운 응답
        const errorResponses = [
            "あの...뭔가 문제가 생긴 것 같아요 😅 다시 시도해주세요!",
            "そうですね...기술적인 문제가 있나봐요 💧 죄송해요!",
            "えーっと...지금 좀 이상해요 😔 조금 기다려주실래요?"
        ];
        
        return res.status(200).json({
            response: errorResponses[Math.floor(Math.random() * errorResponses.length)],
            error: true
        });
    }
}
