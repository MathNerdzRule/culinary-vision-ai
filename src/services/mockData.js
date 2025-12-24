export const MOCK_RECIPES = [
  {
    name: "Summer Garden Frittata",
    difficulty: "Easy",
    prepTime: "15 mins",
    calories: 320,
    rationale: "I've detected eggs, spinach, and bell peppers in your fridge. This frittata is a perfect way to use these fresh ingredients before they wilt.",
    ingredients: [
      { name: "Large Eggs", amount: "6", isAvailable: true },
      { name: "Fresh Spinach", amount: "2 cups", isAvailable: true },
      { name: "Bell Peppers", amount: "1 medium", isAvailable: true },
      { name: "Feta Cheese", amount: "1/4 cup", isAvailable: false },
      { name: "Olive Oil", amount: "1 tbsp", isAvailable: true }
    ],
    instructions: [
      "Whisk the eggs in a medium bowl with a pinch of salt and pepper.",
      "Heat olive oil in a non-stick oven-safe skillet over medium heat.",
      "Sauté diced bell peppers until softened, then add spinach until wilted.",
      "Pour the whisked eggs over the vegetables and sprinkle with feta if using.",
      "Cook for 3-4 minutes until edges are set, then transfer to a broiler for 2 minutes until golden on top."
    ],
    prepItems: ["Medium mixing bowl", "Whisk", "Non-stick oven-safe skillet", "Spatula"]
  },
  {
    name: "Tuscan White Bean Stew",
    difficulty: "Medium",
    prepTime: "25 mins",
    calories: 410,
    rationale: "Using the canned cannellini beans from your pantry and the kale from your fridge, this hearty stew is both nutritious and zero-waste.",
    ingredients: [
      { name: "Cannellini Beans", amount: "2 cans", isAvailable: true },
      { name: "Kale", amount: "1 bunch", isAvailable: true },
      { name: "Vegetable Broth", amount: "4 cups", isAvailable: false },
      { name: "Garlic", amount: "3 cloves", isAvailable: true },
      { name: "Red Pepper Flakes", amount: "1/2 tsp", isAvailable: true }
    ],
    instructions: [
      "In a large pot, sauté minced garlic and red pepper flakes in olive oil until fragrant.",
      "Add the drained beans and vegetable broth, bringing to a gentle simmer.",
      "Use a wooden spoon to smash some of the beans against the side of the pot to thicken the broth.",
      "Stir in the chopped kale and cook until tender, about 5-8 minutes.",
      "Season with salt, pepper, and a squeeze of lemon if available."
    ],
    prepItems: ["Large pot", "Wooden spoon", "Chef's knife", "Cutting board"]
  },
  {
    name: "Honey Garlic Glazed Carrots",
    difficulty: "Easy",
    prepTime: "20 mins",
    calories: 180,
    rationale: "You have a surplus of carrots in the crisper drawer. This sweet and savory glaze makes them a star side dish or a light lunch.",
    ingredients: [
      { name: "Whole Carrots", amount: "1 lb", isAvailable: true },
      { name: "Honey", amount: "2 tbsp", isAvailable: true },
      { name: "Butter", amount: "1 tbsp", isAvailable: true },
      { name: "Fresh Parsley", amount: "for garnish", isAvailable: false },
      { name: "Garlic Powder", amount: "1/2 tsp", isAvailable: true }
    ],
    instructions: [
      "Peel and slice carrots into diagonal 1-inch pieces.",
      "Steam or boil carrots until just tender, about 5-7 minutes.",
      "In a small skillet, melt butter and whisk in honey and garlic powder.",
      "Add the carrots to the skillet and toss to coat thoroughly.",
      "Cook over medium-high heat for 3-4 minutes until the glaze thickens and carrots start to caramelize."
    ],
    prepItems: ["Small skillet", "Whisk", "Peeler", "Chef's knife", "Large pot (for boiling)"]
  }
];
