exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: '허용되지 않은 메소드입니다' })
        };
    }

    try {
        console.log('Received body:', event.body); // 요청 본문 로깅

        const { message, history = [] } = JSON.parse(event.body);

        if (!message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: '메시지가 필요합니다' })
            };
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API 설정 에러' })
            };
        }

        // OpenAI API 호출 로직
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 100,
                temperature: 0.7
            })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                reply: data.choices[0].text,
                history: [...history, { message, reply: data.choices[0].text }]
            })
        };
    } catch (error) {
        console.error('Error occurred:', error.message); // 에러 메시지 로깅
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
};
