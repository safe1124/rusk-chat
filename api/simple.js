export default function handler(req, res) {
    // 모든 요청에 대해 CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // 간단한 응답만 우선 제공
    if (req.method === 'GET') {
        return res.status(200).json({
            message: "API 서버가 정상적으로 작동하고 있습니다!",
            timestamp: new Date().toISOString()
        });
    }
    
    if (req.method === 'POST') {
        // 라스크 캐릭터의 기본 응답들
        const ruskResponses = [
            "こんにちは！ラスクです~ 오늘 기분이 어떠세요? 😊",
            "そうですね！정말 재미있는 이야기네요! ✨",
            "わあ！저도 그런 얘기 들으면 기분이 좋아져요~ 💕",
            "ありがとうございます！언제든 이야기해주세요! 🌟",
            "えーっと...그게 무슨 뜻인지 잘 모르겠어요 😅",
            "そうそう！저도 그렇게 생각해요! 😄"
        ];
        
        const randomResponse = ruskResponses[Math.floor(Math.random() * ruskResponses.length)];
        
        return res.status(200).json({
            message: randomResponse,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
