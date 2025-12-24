import { MOCK_RECIPES } from "./mockData";

const compressImage = async (base64Str, maxWidth = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export const analyzeIngredients = async (kitchenImages, dietaryPreferences) => {
  try {
    // Compress images to stay under Vercel's 4.5MB payload limit
    const compressedImages = await Promise.all(
      kitchenImages.map(img => compressImage(img))
    );

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kitchenImages: compressedImages,
        dietaryPreferences,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze ingredients');
    }

    const data = await response.json();

    if (data.isDemo) {
      return { recipes: MOCK_RECIPES, isDemo: true };
    }

    return { recipes: data.recipes, isDemo: false };
  } catch (error) {
    console.error("Analysis Service Error:", error);
    throw error;
  }
};


