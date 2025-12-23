import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const RECIPE_SCHEMA = {
  type: "object",
  properties: {
    recipes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
          prepTime: { type: "string" },
          calories: { type: "number" },
          rationale: { type: "string" },
          ingredients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                amount: { type: "string" },
                isAvailable: { type: "boolean" }
              },
              required: ["name", "isAvailable"]
            }
          },
          instructions: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["name", "difficulty", "prepTime", "calories", "rationale", "ingredients", "instructions"]
      }
    }
  },
  required: ["recipes"]
};

export const analyzeIngredients = async (fridgeImage, pantryImage, dietaryPreferences) => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      // responseSchema: RECIPE_SCHEMA, // Some environments might not support strict schema yet in the SDK
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
