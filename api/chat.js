// Netlify Serverless Function for OpenAI API calls
exports.handler = async function(event, context) {
    console.log('API 요청 받음:', {
        method: event.httpMethod,
        url: event.path,
        origin: event.headers.origin
    });

    const origin = event.headers.origin;
    const method = event.httpMethod;

    const headers = {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (method === 'OPTIONS') {
        console.log('OPTIONS 요청 처리됨');
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // GET 요청 처리 (테스트용)
    if (method === 'GET') {
        console.log('GET 요청 처리됨');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: 'API가 정상적으로 작동하고 있습니다!',
                timestamp: new Date().toISOString(),
                method: 'GET'
            })
        };
    }

    // POST 요청만 허용
    if (method !== 'POST') {
        console.log('POST가 아닌 요청:', method);
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // 환경 변수에서 API 키 가져오기
        const apiKey = process.env.OPENAI_API_KEY;
        console.log('API 키 확인:', apiKey ? '존재함' : '없음');
        
        if (!apiKey) {
            console.log('API 키가 설정되지 않음');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    message: 'API 키가 설정되지 않아 fallback 응답을 사용합니다. こんにちは！ラスクです~ 😊',
                    fallback: true
                })
            };
        }

        const { messages, character } = JSON.parse(event.body);
        console.log('요청 데이터:', { messagesCount: messages?.length, character });

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid messages format' })
            };
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
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'OpenAI API error',
                    details: errorData
                })
            };
        }

        const data = await response.json();
        
        // 응답 반환
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: data.choices[0].message.content,
                usage: data.usage
            })
        };

    } catch (error) {
        console.error('API Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            })
        };
    }
};
