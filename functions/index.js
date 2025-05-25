const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

exports.recommendProducts = functions.https.onCall(async (data, context) => {
  const { age, occupation } = data;

  const prompt = `Suggest financial products for a person who is ${age} years old and works as a ${occupation}. Return 3 suggestions.`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const suggestions = response.data.choices[0].message.content.trim();
  return { suggestions };
});
