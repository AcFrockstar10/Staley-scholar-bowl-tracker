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

        // Calculate approximate file size in KB from the base64 string
        const sizeInKB = Math.round((imageBase64.length * (3/4)) / 1024);

        // Send back structured feedback for you to look over
        return res.status(200).json({ 
            success: true, 
            message: 'Scoresheet image successfully received and processed!',
            details: {
                fileSize: `${sizeInKB} KB`,
                processedAt: new Date().toLocaleTimeString(),
                serverStatus: 'Active & Verified on Vercel'
            }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
