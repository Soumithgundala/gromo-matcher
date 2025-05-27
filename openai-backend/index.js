const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/recommend', async (req, res) => {
  const { age, occupation } = req.body;
  const prompt = `Suggest the top 3 financial products for someone aged ${age} working as a ${occupation}.`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = chat.choices[0].message.content.trim();
    res.json({ suggestions: result });
  } catch (err) {
    console.error("OpenAI API Error:", err);
    res.status(500).json({ error: "OpenAI API call failed." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ OpenAI server running on http://localhost:${PORT}`);
});
