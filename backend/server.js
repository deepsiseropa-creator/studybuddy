const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

app.post("/api/ai", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                answer: "Please enter a question."
            });
        }

        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: question
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error("Groq AI Error:", error);

        res.status(500).json({
            answer: "Sorry, I couldn't process your question."
        });
    }
});

app.get("/", (req, res) => {
    res.send("StudyBuddy backend is running 🚀");
});

app.listen(PORT, () => {
    console.log(`StudyBuddy backend running at http://localhost:${PORT}`);
});