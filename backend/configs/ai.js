/**
 * AI Service Configuration
 * 
 * Interacts directly with the official REST APIs (Groq or xAI Grok) using native fetch.
 * Emulates the OpenAI SDK interface so it can be used as a drop-in replacement
 * in the controller files without modifying any existing completion logic.
 */

const ai = {
  chat: {
    completions: {
      create: async ({ model, messages, response_format }) => {
        const apiKey = process.env.GROQ_API_KEY || process.env.XAI_API_KEY || process.env.GROK_API_KEY;

        if (!apiKey) {
          throw new Error("AI API key is not configured. Please configure GROQ_API_KEY in your .env file.");
        }

        const isGroq = apiKey.startsWith("gsk_");
        
        // Standardize the model name based on provider
        let modelName = model;
        if (isGroq) {
          if (!modelName || modelName.toLowerCase().startsWith("gemini") || modelName.toLowerCase().startsWith("grok")) {
            modelName = "llama-3.3-70b-versatile";
          }
        } else {
          if (!modelName || modelName.toLowerCase().startsWith("gemini")) {
            modelName = "grok-2-1212";
          }
        }

        const url = isGroq 
          ? "https://api.groq.com/openai/v1/chat/completions" 
          : "https://api.x.ai/v1/chat/completions";

        const reqBody = {
          model: modelName,
          messages: messages
        };

        if (response_format && response_format.type === "json_object") {
          reqBody.response_format = { type: "json_object" };
        }

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify(reqBody)
        });

        if (!res.ok) {
          const errText = await res.text();
          let parsedErr;
          try {
            parsedErr = JSON.parse(errText);
          } catch (e) {}
          const providerName = isGroq ? "Groq" : "xAI";
          throw new Error(parsedErr?.error?.message || `${providerName} API returned status ${res.status}: ${errText}`);
        }

        const data = await res.json();
        return data;
      }
    }
  }
};

export default ai;
