import OpenAI from "openai";

/**
 * AI Service Configuration
 * 
 * Configures the OpenAI-compatible client interface to communicate directly with the Google Gemini API.
 * Designed to use GEMINI_API_KEY or GOOGLE_API_KEY exclusively, avoiding any need for OpenAI credentials.
 */

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";

if (!apiKey) {
  console.warn("WARNING: Neither GEMINI_API_KEY nor GOOGLE_API_KEY is configured. AI features will fail.");
}

// Always use gemini-3.5-flash by default for exceptionally fast and accurate resume generations
if (!process.env.OPENAI_MODEL) {
  process.env.OPENAI_MODEL = "gemini-3.5-flash";
}

const ai = new OpenAI({
  apiKey: apiKey || "placeholder_key",
  baseURL: baseURL,
});

export default ai;
