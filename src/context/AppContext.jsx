import React, { createContext, useContext, useState, useEffect } from 'react';
import { ourGroceriesService } from '../services/ourGroceries';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });
  const [fridgeImage, setFridgeImage] = useState(null);
  const [pantryImage, setPantryImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isDemo, setIsDemo] = useState(false);


  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addToShoppingList = async (item) => {
    // Add to local list immediately for UI responsiveness
    setShoppingList(prev => {
      if (prev.find(i => i.name === item.name)) return prev;
      return [...prev, { ...item, id: Date.now(), completed: false, synced: false }];
    });

    // Try to sync with OurGroceries
    setIsSyncing(true);
    try {
      await ourGroceriesService.addItem(item.name);
      setShoppingList(prev => prev.map(i => 
        i.name === item.name ? { ...i, synced: true } : i
      ));
      setSyncStatus(`Added ${item.name} to OurGroceries!`);
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (error) {
      console.error('Failed to sync with OurGroceries:', error);
      setSyncStatus('Failed to sync with OurGroceries. Check settings.');
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
    }
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
      shoppingList, addToShoppingList, removeFromShoppingList, toggleShoppingListItem, clearCompleted,
      fridgeImage, setFridgeImage,
      pantryImage, setPantryImage,
      isAnalyzing, setIsAnalyzing,
      activeRecipe, setActiveRecipe,
      isSyncing, syncStatus,
      isDemo, setIsDemo
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
