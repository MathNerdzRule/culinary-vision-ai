import { MOCK_RECIPES } from "./mockData";

export const analyzeIngredients = async (fridgeImages, pantryImages, dietaryPreferences) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fridgeImages,
        pantryImages,
        dietaryPreferences,
      }),
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze ingredients');
    }

    const data = await response.json();

    // Handle Demo Mode returned from server
    if (data.isDemo) {
      console.warn("Running in Demo Mode: No API Key configured on server.");
      // Simulate extra delay for effect if needed, but the server already responded
      return { recipes: MOCK_RECIPES, isDemo: true };
    }

    return { recipes: data.recipes, isDemo: false };
  } catch (error) {
    console.error("Analysis Service Error:", error);
    throw error;
  }
};

