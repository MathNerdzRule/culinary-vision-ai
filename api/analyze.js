import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { kitchenImages = [], dietaryPreferences } = req.body;
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
      Analyze the provided images of a kitchen (which may include the fridge, pantry, spice rack, freezer, or counters) to identify ingredients.
      Multiple images have been provided to show different areas and angles. Scan them all carefully.
      Suggest 3-5 creative recipes that can be made primarily with these ingredients.
      
      Dietary Preferences: ${dietaryPreferences?.join(", ") || "None"}
      
      ${dietaryPreferences?.includes('GP') ? `
      CRITICAL: The user has Gastroparesis (GP). All recipes MUST follow these strict guidelines:
      1. LOW FIBER: Avoid raw vegetables, skins, seeds, nuts, and whole grains. Pureed or well-cooked vegetables only.
      2. LOW FAT: Limit oils, butter, and high-fat meats.
      3. EASY DIGESTION: Focus on soft foods, liquid-based dishes, or highly processed refined grains that leave the stomach quickly.
      4. SMALL PORTIONS: Design recipes that are gentle on a delayed-emptying stomach.
      ` : ''}

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
      ...kitchenImages.map(img => ({ 
        inlineData: { 
          data: img.split(',')[1], 
          mimeType: img.split(';')[0].split(':')[1] || "image/jpeg" 
        } 
      })),
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
