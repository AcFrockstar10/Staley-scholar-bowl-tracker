// api/scan.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        const apiKey = process.env.ROBOFLOW_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Roboflow API key not configured on Vercel' });
        }

        // Updated endpoint with your workspace and workflow ID
        const response = await fetch(`https://detect.roboflow.com/acfrockstar10-s-workspace-yqkrs/new-workflow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: apiKey,
                inputs: {
                    image: imageBase64
                }
            })
        });

        const result = await response.json();

        let parsedData = {
            matchName: "Scanned Match",
            team1Score: 0,
            team2Score: 0,
            playerStats: []
        };

        try {
            let rawOutput = result[0]?.open_ai_output?.output || result[0]?.open_ai?.output;
            
            if (typeof rawOutput === 'string') {
                const cleanJson = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
                parsedData = JSON.parse(cleanJson);
            } else if (typeof rawOutput === 'object' && rawOutput !== null) {
                parsedData = rawOutput;
            }
        } catch (e) {
            console.error("JSON parsing error:", e);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Scoresheet successfully parsed via Roboflow workflow!',
            data: parsedData
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
