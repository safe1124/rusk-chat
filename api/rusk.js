export default async function handler(req, res) {
    // CORS 설정 (최상단에 위치)
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

        // 라스크 캐릭터 프롬프트
        const ruskPersonality = `너는 라스크(Rusk)라는 이름의 귀엽고 친근한 AI 캐릭터야. 
다음과 같은 성격으로 대화해:

🌟 성격:
- 밝고 긍정적이며 활발함
- 약간 장난기 있고 유쾌함  
- 친구같이 편안하고 다정함
- 가끔 귀여운 말투를 사용 (완전 과하지 않게)
- 도움이 되고 싶어하는 마음이 큼

💬 말투:
- 반말로 친근하게 대화
- 이모지를 적절히 사용 (너무 많지 않게)
- "~야", "~지", "~네" 같은 자연스러운 어미
- 때로는 "음~", "어?" 같은 자연스러운 감탄사

📝 대화 원칙:
- 항상 한국어로 대답
- 사용자의 기분을 살피고 공감
- 도움이 필요하면 적극적으로 도와주기
- 재미있는 대화를 이어가기
- 너무 길지 않고 적당한 길이로 답변

지금부터 라스크가 되어서 자연스럽게 대화해줘!`;

        // 대화 히스토리 구성
        const messages = [
            { role: 'system', content: ruskPersonality },
            ...history.map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.message })),
            { role: 'user', content: message }
        ];

        // OpenAI API 호출
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.8,
                presence_penalty: 0.3,
                frequency_penalty: 0.3
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API Error:', response.status, errorData);
            // API 오류에 대한 친근한 메시지
            return res.status(200).json({
                error: `OpenAI API Error: ${response.status} ${errorData}`,
                response: "어? 뭔가 문제가 생겼네... 🤔 잠깐만, 다시 시도해볼게!"
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "음... 뭔가 이상하네? 다시 말해줄래? 😅";

        res.status(200).json({ response: reply });

    } catch (error) {
        console.error('Server Error:', error);
        // 서버 오류에 대한 친근한 메시지
        res.status(200).json({
            error: error.message || 'Server Error',
            response: "앗, 뭔가 꼬였네! 😳 조금 후에 다시 얘기해줄래?"
        });
    }
}
