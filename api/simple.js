exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
    };

    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: "API 서버가 정상적으로 작동하고 있습니다!",
                timestamp: new Date().toISOString()
            })
        };
    }

    if (event.httpMethod === 'POST') {
        const ruskResponses = [
            "안녕하세요! 라스크입니다~ 오늘 기분이 어떠세요? 😊",
            "정말 재미있는 이야기네요! ✨",
            "와! 저도 그런 얘기 들으면 기분이 좋아져요~ 💕",
            "감사합니다! 언제든 이야기해주세요! 🌟",
            "에~ 그게 무슨 뜻인지 잘 모르겠어요 😅",
            "그렇죠! 저도 그렇게 생각해요! 😄"
        ];

        const randomResponse = ruskResponses[Math.floor(Math.random() * ruskResponses.length)];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: randomResponse,
                fallback: true,
                timestamp: new Date().toISOString()
            })
        };
    }

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
