import { GoogleGenerativeAI } from "@google/generative-ai";
import { MOCK_RECIPES } from "./mockData";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const analyzeIngredients = async (fridgeImage, pantryImage, dietaryPreferences) => {
  // Demo Mode logic: If no API key is provided, return mock data after a delay
  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.warn("Running in Demo Mode: No API Key detected.");
    // Simulate network/AI delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter mock recipes slightly based on dietary preferences if they exist
    // For simplicity in demo, we return the standard set
    return { recipes: MOCK_RECIPES };
  }

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
    
    Dietary Preferences: ${dietaryPreferences.join(", ") || "None"}
    
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

  try {
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing ingredients:", error);
    throw error;
  }
};
