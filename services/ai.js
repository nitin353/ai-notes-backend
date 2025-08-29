const { GoogleGenerativeAI } = require('@google/generative-ai');

async function summarizeText(text, opts = { length: 'short' }) {
  const prompt = `Summarize the following text into concise study notes (${opts.length}). 
Use bullet points where appropriate:\n\n${text}`;

  // Gemini implementation only
  const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

  // Recommended model for text tasks
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = { summarizeText };