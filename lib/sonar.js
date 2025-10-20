const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
// Update to correct Perplexity endpoint for chat completions
const API_URL = "https://api.perplexity.ai/chat/completions";

export async function querySonar(
  prompt,
  systemPrompt = "You are a helpful assistant."
) {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key is missing");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        // tools: [{ type: "web" }, { type: "youtube" }], // <-- Enable tools
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    // Perplexity returns { choices: [{ message: { content }, ... }] }
    const data = await response.json();
    // Citations may not be present in the same way; adapt as needed
    return {
      text: data.choices?.[0]?.message?.content || "",
      citations: data.choices?.[0]?.message?.citations || [],
      tool_outputs: data.choices?.[0]?.message?.tool_outputs || [],
    };
  } catch (error) {
    console.error("Error querying Perplexity API:", error);
    throw error;
  }
}

// Example: How to call Perplexity API (Sonar) in Node.js/JavaScript
async function exampleChatCompletion() {
  const API_KEY = process.env.PERPLEXITY_API_KEY;
  const API_URL = "https://api.perplexity.ai/chat/completions";
  const messages = [
    {
      role: "system",
      content:
        "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user.",
    },
    {
      role: "user",
      content: "How many stars are in the universe?",
    },
  ];

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages,
    }),
  });

  const data = await response.json();
  console.log(data);
}
