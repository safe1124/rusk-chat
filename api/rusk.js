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
        const { messages } = JSON.parse(event.body);
        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'messages 배열이 필요합니다' })
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
        // OpenAI Chat API 호출
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'OpenAI API error', details: data })
            };
        }
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                content: data.choices[0].message.content,
                usage: data.usage
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error', message: error.message })
        };
    }
};
