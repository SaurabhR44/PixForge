import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const POLLINATIONS_API_KEY = "sk_Z9eOw0cvQX9ZLglAXow0mCdxuBn3Bp1G";

//! Middlewares
app.use(express.json());
app.use(cors());

// Health Check
app.get("/api/health", (req, res) => res.send("PixForge Serverless Backend is live!"));

// Generate Image Route (Serverless)
app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;

    try {
        const seed = Math.floor(Math.random() * 1000000);
        const externalUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

        console.log(`Generating (Serverless): ${prompt}`);

        // On Vercel, we return the Pollinations URL directly (or we could proxy the buffer)
        // To keep it simple and high-performance, we return the authenticated URL or proxy it.
        // However, the proxy is safer for avoiding client-side 502s.

        const response = await axios({
            url: externalUrl,
            method: 'GET',
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Bearer ${POLLINATIONS_API_KEY}`,
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 60000
        });

        // We don't save to FS on Vercel. We return the image directly or a base64 string.
        // For the "Gallery" to work, we'll suggest using localStorage for the history on the client.

        res.set('Content-Type', 'image/jpeg');
        res.send(response.data);

    } catch (error) {
        console.error(`Vercel API Error: ${error.message}`);
        res.status(500).json({ message: "Generation failed.", error: error.message });
    }
});

// Mock Images Route for serverless (history is mostly client-side now)
app.get("/api/images", (req, res) => {
    res.json([]); // Client will combine this with its own localStorage gallery
});

// Special handler for Express in Vercel
export default app;
