import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

const app = express();
const PORT = 9000;
const DB_FILE = path.resolve("db.json");
const IMAGES_DIR = path.resolve("generated_images");

// USER API KEY
const POLLINATIONS_API_KEY = "sk_Z9eOw0cvQX9ZLglAXow0mCdxuBn3Bp1G";

// Ensure images directory exists
try {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
} catch (e) { }

// --- Minimalist JSON Database -----
const getDB = async () => {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveDB = async (data) => {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
};

//! Cors
const corsOptions = {
  origin: ["http://localhost:5174", "http://localhost:5173"],
};

//!Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use("/local-images", express.static(IMAGES_DIR));

//!Route
app.get("/", (req, res) => res.send("Premium Backend with API Key is live!"));

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  const id = `img-${Date.now()}`;
  const localFileName = `${id}.jpg`;
  const localFilePath = path.join(IMAGES_DIR, localFileName);
  const localUrl = `http://localhost:9000/local-images/${localFileName}`;

  try {
    const seed = Math.floor(Math.random() * 1000000);
    // Official Gen Gateway URL
    const externalUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

    console.log(`Generating authenticated image via official gateway for: ${prompt}`);

    const response = await axios({
      url: externalUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${POLLINATIONS_API_KEY}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 60000
    });

    // Check if we actually got an image
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('image')) {
      throw new Error(`Invalid response from API: ${contentType}`);
    }

    await fs.writeFile(localFilePath, response.data);

    const imageCreated = {
      prompt,
      url: localUrl,
      public_id: id,
      createdAt: new Date(),
    };

    const db = await getDB();
    db.push(imageCreated);
    await saveDB(db);

    res.json(imageCreated);
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    res.status(500).json({
      message: "Generation failed. Please check your API key or try again.",
      error: error.message
    });
  }
});

//!List images route
app.get("/images", async (req, res) => {
  try {
    const images = await getDB();
    res.json(images);
  } catch (error) {
    res.json({ message: "Error fetching images" });
  }
});

//!Start the server
app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
