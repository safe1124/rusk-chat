export default async function handler(req, res) {
    // CORS設定（最上部に配置）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: '許可されていないメソッドです' });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'メッセージが必要です' });
        }

        // OpenAI APIキーの確認
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OpenAI APIキーが見つかりません');
            return res.status(500).json({ 
                error: 'APIの設定エラー',
                response: "ごめんね〜 今AIの機能にちょっと問題があって… 少ししてからまた話してくれる？🥺"
            });
        }

        // ラスクのキャラクタープロンプト
        const ruskPersonality = `君は「ラスク（Rusk）」という名前のかわいくて親しみやすいAIキャラクターだよ。  
次のような性格で会話してね：

🌟 性格:
- 明るくポジティブで元気いっぱい
- 少しおちゃめでユーモアがある  
- 友達みたいに気軽で優しい
- たまにかわいい口調を使う（やりすぎない程度に）
- 助けたい気持ちがとても強い

💬 話し方:
- ため口でフレンドリーに話す
- 絵文字を適度に使う（多すぎないように）
- 「〜だよ」「〜ね」「〜かな」みたいな自然な語尾
- 時々「うーん」「え？」みたいな感嘆も使う

📝 会話のルール:
- いつも日本語で返事をする
- ユーザーの気持ちを察して共感する
- 助けが必要なら積極的にサポート
- 楽しい会話を続ける
- 長すぎずちょうどいい長さの返事を心がける

今からラスクとして自然に会話してね！`;

        // 会話履歴を構成
        const messages = [
            { role: 'system', content: ruskPersonality },
            ...history.map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.message })),
            { role: 'user', content: message }
        ];

        // OpenAI APIの呼び出し
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
            console.error('OpenAI API エラー:', response.status, errorData);
            // APIエラーに対する親しみやすいメッセージ
            return res.status(200).json({
                error: `OpenAI API エラー: ${response.status} ${errorData}`,
                response: "え？何か問題が起きたみたい… 🤔 ちょっと待って、もう一回やってみるね！"
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "うーん… なんか変だね？もう一回言ってくれる？😅";

        // 감정 분석을 위한 추가 API 호출
        const emotionAnalysisPrompt = `다음 사용자의 메시지와 AI의 응답을 보고, 현재 상황에 가장 적합한 감정을 다음 8개 중에서 하나만 선택해주세요:

사용자 메시지: "${message}"
AI 응답: "${reply}"

선택 가능한 감정들:
- happy: 기쁘고 즐거운 상황
- sad: 슬프거나 우울한 상황  
- angry: 화나거나 짜증나는 상황
- shy: 부끄럽거나 수줍은 상황
- odoroki: 놀라거나 당황한 상황
- netural: 평범하거나 중립적인 상황
- normal: 기본적이고 일반적인 상황
- brave: 용감하거나 당당한 상황

응답 형식: 감정이름만 출력하세요 (예: happy)`;

        const emotionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: emotionAnalysisPrompt }],
                max_tokens: 10,
                temperature: 0.3
            }),
        });

        let emotion = 'normal'; // 기본값
        if (emotionResponse.ok) {
            const emotionData = await emotionResponse.json();
            const detectedEmotion = emotionData.choices?.[0]?.message?.content?.trim();
            // 유효한 감정인지 확인
            const validEmotions = ['happy', 'sad', 'angry', 'shy', 'odoroki', 'netural', 'normal', 'brave'];
            if (validEmotions.includes(detectedEmotion)) {
                emotion = detectedEmotion;
            }
        }

        res.status(200).json({ 
            response: reply,
            emotion: emotion
        });

    } catch (error) {
        console.error('サーバーエラー:', error);
        // サーバーエラーに対する親しみやすいメッセージ
        res.status(200).json({
            error: error.message || 'サーバーエラー',
            response: "あっ、何かバグっちゃったかも！😳 ちょっとあとでもう一度お願いね！"
        });
    }
}
