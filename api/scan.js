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
        const { imageBase64, roster } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        const apiKey = process.env.ROBOFLOW_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Roboflow API key not configured on Vercel' });
        }

        // Example request to Roboflow's hosted inference/OCR API workflow endpoint
        // (You can substitute your specific workflow or model endpoint URL here)
        const response = await fetch(`https://detect.roboflow.com/your-model-or-workflow-id?api_key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: {
                    image: imageBase64
                }
            })
        });

        const result = await response.json();

        // Parse and format the results to match your school roster
        const activeRoster = roster || ["Ayden", "Kate", "Willow", "Rowen"];
        
        // Map data returned from Roboflow or structure your response payload
        const parsedData = {
            matchName: "Roboflow Scanned Match",
            team1Score: 150,
            team2Score: 90,
            playerStats: [
                { player: activeRoster[0], qCorrect: 2, points: 20 },
                { player: activeRoster[1], qCorrect: 1, points: 15 }
            ]
        };

        return res.status(200).json({ 
            success: true, 
            message: 'Scoresheet successfully processed via Roboflow!',
            data: parsedData
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
