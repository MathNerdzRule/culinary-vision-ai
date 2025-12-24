import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fridgeImage, pantryImage, dietaryPreferences } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return res.status(200).json({ 
      isDemo: true,
      message: "Running in Demo Mode: No API Key configured on server."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are Chef AI, a friendly and expert culinary assistant.
      Analyze the provided images (one of a fridge, one of a pantry) to identify ingredients.
      Suggest 3-5 creative recipes that can be made primarily with these ingredients.
      
      Dietary Preferences: ${dietaryPreferences?.join(", ") || "None"}
      
      For each recipe, provide:
      - Name
      - Difficulty (Easy, Medium, Hard)
      - Prep Time
      - Approximate Calories
      - A brief rationale for why you suggested it (max 2 sentences).
      - Ingredients list, specifying if they are likely available based on the images.
      - Step-by-step instructions.
      
      Return the response in strict JSON format matching this schema:
      {
        "recipes": [
          {
            "name": "Recipe Name",
            "difficulty": "Easy",
            "prepTime": "20 mins",
            "calories": 350,
            "rationale": "...",
            "ingredients": [{ "name": "...", "amount": "...", "isAvailable": true }],
            "instructions": ["Step 1", "Step 2"]
          }
        ]
      }
    `;

    const parts = [
      { text: prompt },
      ...(fridgeImage ? [{ inlineData: { data: fridgeImage.split(',')[1], mimeType: "image/jpeg" } }] : []),
      ...(pantryImage ? [{ inlineData: { data: pantryImage.split(',')[1], mimeType: "image/jpeg" } }] : []),
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text);
    
    return res.status(200).json({ ...data, isDemo: false });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
