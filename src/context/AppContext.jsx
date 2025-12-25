import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });
  const [kitchenImages, setKitchenImages] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [recipeViewMode, setRecipeViewMode] = useState('details'); // 'details', 'ingredients', 'cooking'
  const [isDemo, setIsDemo] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.name === recipe.name);
      if (exists) return prev.filter(f => f.name !== recipe.name);
      return [...prev, recipe];
    });
  };

  const addImage = (imageData) => {
    setKitchenImages(prev => [...prev, imageData]);
  };

  const removeImage = (index) => {
    setKitchenImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setKitchenImages([]);
  };



  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t) => {
      root.classList.remove('light', 'dark');
      
      if (t === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes if set to 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);



  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addToShoppingList = (item) => {
    setShoppingList(prev => {
      if (prev.find(i => i.name === item.name)) return prev;
      return [...prev, { ...item, id: Date.now(), completed: false }];
    });
  };

  const removeFromShoppingList = (id) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  const toggleShoppingListItem = (id) => {
    setShoppingList(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const clearCompleted = () => {
    setShoppingList(prev => prev.filter(i => !i.completed));
  };

  return (
    <AppContext.Provider value={{
      dietaryPreferences, setDietaryPreferences,
      recipes, setRecipes,
      favorites, toggleFavorite,
      shoppingList, addToShoppingList, removeFromShoppingList, toggleShoppingListItem, clearCompleted,
      kitchenImages, addImage, removeImage, clearImages,
      isAnalyzing, setIsAnalyzing,
      activeRecipe, setActiveRecipe,
      recipeViewMode, setRecipeViewMode,
      isDemo, setIsDemo,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
