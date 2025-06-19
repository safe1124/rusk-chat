// Vercel Serverless Function for OpenAI API calls
export default async function handler(req, res) {
    console.log('API 요청 받음:', {
        method: req.method,
        url: req.url,
        origin: req.headers.origin
    });

    // CORS 헤더 설정 (더 구체적으로)
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS 요청 처리됨');
        return res.status(200).end();
    }

    // GET 요청 처리 (테스트용)
    if (req.method === 'GET') {
        console.log('GET 요청 처리됨');
        return res.status(200).json({ 
            message: 'API가 정상적으로 작동하고 있습니다!',
            timestamp: new Date().toISOString(),
            method: 'GET'
        });
    }

    // POST 요청만 허용
    if (req.method !== 'POST') {
        console.log('POST가 아닌 요청:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 환경 변수에서 API 키 가져오기
        const apiKey = process.env.OPENAI_API_KEY;
        console.log('API 키 확인:', apiKey ? '존재함' : '없음');
        
        if (!apiKey) {
            console.log('API 키가 설정되지 않음');
            return res.status(200).json({ 
                message: 'API 키가 설정되지 않아 fallback 응답을 사용합니다. こんにちは！ラスクです~ 😊',
                fallback: true
            });
        }

        const { messages, character } = req.body;
        console.log('요청 데이터:', { messagesCount: messages?.length, character });

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

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
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ 
                error: 'OpenAI API error',
                details: errorData
            });
        }

        const data = await response.json();
        
        // 응답 반환
        res.status(200).json({
            message: data.choices[0].message.content,
            usage: data.usage
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
