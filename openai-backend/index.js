const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Ensure 'OpenAI' is capitalized here
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- TEMPORARY DEBUGGING ---
const loadedKey = process.env.OPENAI_API_KEY;
if (loadedKey) {
  console.log(`[DEBUG] Loaded API Key starts with: ${loadedKey.substring(0, 10)} and ends with: ${loadedKey.substring(loadedKey.length - 4)}`);
  console.log(`[DEBUG] Full loaded key (first 10 for check): ${loadedKey.substring(0, 10)}...`); // Be careful logging full keys
} else {
  console.log("[DEBUG] OPENAI_API_KEY is NOT LOADED in process.env!");
}

// --- Crucial: OpenAI API Key Check & Instantiation ---
// 1. Check if the API key is loaded (for early debugging)
if (!process.env.OPENAI_API_KEY) {
  console.error(
    "FATAL ERROR: OPENAI_API_KEY is not defined in your .env file."
  );
  // You might want the application to exit if the key is absolutely critical for startup
  // process.exit(1);
}

// 2. Instantiate the OpenAI client with the API key
//    CRITICAL: Ensure 'OpenAI' is capitalized (it's a class name)
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (e) {
  console.error("Failed to initialize OpenAI SDK:", e);
  // If OpenAI SDK can't initialize, the server can't function for its main purpose
  // process.exit(1); // Or handle this state appropriately
}


app.post('/recommend', async (req, res) => {
  // Ensure OpenAI client was initialized
  if (!openai) {
    console.error("OpenAI client not initialized. Cannot process request.");
    return res.status(500).json({ error: "OpenAI service is not configured properly on the server." });
  }

  const { age, occupation } = req.body;

  // --- Basic Input Validation ---
  if (age === undefined || occupation === undefined) {
    return res.status(400).json({ error: "Age and occupation are required." });
  }
  // Your frontend sends age as a number due to parseInt(age)
  if (typeof age !== 'number' || age <= 0) {
    return res.status(400).json({ error: "Age must be a positive number." });
  }
  if (typeof occupation !== 'string' || occupation.trim() === '') {
    return res.status(400).json({ error: "Occupation must be a non-empty string." });
  }

  const prompt = `Suggest the top 3 financial products for someone aged ${age} working as a ${occupation}.`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // Adjust temperature as needed for creativity vs. factuality
    });

    // --- Check OpenAI Response Structure ---
    if (chat.choices && chat.choices.length > 0 && chat.choices[0].message && chat.choices[0].message.content) {
      const result = chat.choices[0].message.content.trim();
      res.json({ suggestions: result });
    } else {
      console.error("OpenAI API Error: Unexpected response structure", JSON.stringify(chat, null, 2));
      res.status(500).json({ error: "Failed to get a valid response from OpenAI." });
    }

  } catch (err) {
    // --- Detailed Error Logging and Response ---
    console.error("--- OpenAI API Call Failed ---"); // Make the log stand out
    console.error("Timestamp:", new Date().toISOString());
    console.error("Request Body:", req.body);
    console.error("Generated Prompt:", prompt);
    console.error("Error Object:", err); // This logs the full error from OpenAI SDK or other issues

    if (err instanceof OpenAI.APIError) {
      // This handles errors specifically from the OpenAI API (e.g., auth, rate limits)
      res.status(err.status || 500).json({
        error: `OpenAI API Error: ${err.name} - ${err.message}`,
        details: err.code || err.type, // Provides more specific OpenAI error codes if available
      });
    } else {
      // Handles other unexpected errors (network issues, bugs before API call, etc.)
      res.status(500).json({ error: "An unexpected server error occurred." });
    }
  }
});

const PORT = process.env.PORT || 5000; // Use environment variable for port if available
app.listen(PORT, () => {
  console.log(`✅ OpenAI server running on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn("Warning: OPENAI_API_KEY is not set. OpenAI features will fail.");
  }
});