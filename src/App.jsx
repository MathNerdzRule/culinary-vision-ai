import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CameraSystem } from './components/CameraSystem';
import { RecipeList } from './components/RecipeList';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { useAppContext, AppProvider } from './context/AppContext';
import { analyzeIngredients } from './services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, Loader2, Menu, ChefHat } from 'lucide-react';

const Dashboard = ({ onOpenMenu }) => {
  const { 
    fridgeImage, setFridgeImage, 
    pantryImage, setPantryImage, 
    dietaryPreferences,
    setRecipes,
    isAnalyzing, setIsAnalyzing,
    setActiveRecipe,
    recipes
  } = useAppContext();

  const handleAnalyze = async () => {
    if (!fridgeImage && !pantryImage) {
      alert("Please capture or upload at least one image (Fridge or Pantry).");
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await analyzeIngredients(fridgeImage, pantryImage, dietaryPreferences);
      setRecipes(data.recipes);
      // Wait a moment for the scroll effect to be smooth
      setTimeout(() => {
        const recipeSection = document.getElementById('recipes-section');
        if (recipeSection) recipeSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(error.message || "Failed to analyze ingredients. Check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-16">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center mb-6">
        <button onClick={onOpenMenu} className="p-2 text-charcoal-400 hover:text-white">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <ChefHat size={20} className="text-sage-500" />
          <span className="font-bold text-white text-sm">Culinary Vision</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-500/10 text-sage-400 border border-sage-500/20 text-sm font-bold uppercase tracking-widest mb-4"
        >
          <Sparkles size={16} />
          <span>AI-Powered Culinary Assistant</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
          What's in your <br />
          <span className="text-sage-500">Kitchen today?</span>
        </h1>
        <p className="text-charcoal-400 text-lg md:text-xl max-w-2xl mx-auto">
          Take a photo of your fridge and pantry. Our Chef AI will scan your ingredients and suggest the perfect meal.
        </p>
      </section>

      {/* Input Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CameraSystem 
          label="Fridge" 
          image={fridgeImage} 
          onImageCapture={setFridgeImage} 
          onImageClear={() => setFridgeImage(null)} 
        />
        <CameraSystem 
          label="Pantry" 
          image={pantryImage} 
          onImageCapture={setPantryImage} 
          onImageClear={() => setPantryImage(null)} 
        />
      </section>

      {/* Action Section */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!fridgeImage && !pantryImage)}
          className="btn-primary flex items-center gap-3 px-12 py-5 text-xl font-bold group relative disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>Analyzing Ingredients...</span>
            </>
          ) : (
            <>
              <Scan size={24} className="group-hover:rotate-12 transition-transform" />
              <span>Generate Recipes</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>

      {/* Recipes Section */}
      {(recipes.length > 0 || isAnalyzing) && (
        <section id="recipes-section" className="pt-10 border-t border-white/5 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Suggested for You</h2>
            <div className="text-sm text-charcoal-400">Total {recipes.length} matches</div>
          </div>
          <RecipeList 
            recipes={recipes} 
            onRecipeSelect={setActiveRecipe} 
            isLoading={isAnalyzing} 
          />
        </section>
      )}
    </div>
  );
};

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeRecipe, setActiveRecipe } = useAppContext();

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col lg:flex-row">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <main className="flex-1 lg:ml-64 min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard onOpenMenu={() => setIsSidebarOpen(true)} />
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="lg:hidden p-6 border-b border-white/5 flex items-center justify-between">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-charcoal-400">
                  <Menu size={24} />
                </button>
                <span className="font-bold text-white">Shopping List</span>
                <div className="w-10" />
              </div>
              <ShoppingList />
            </motion.div>
          )}
          
          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-6xl mx-auto py-10 px-6">
                <div className="lg:hidden flex items-center justify-between mb-8">
                   <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-charcoal-400">
                    <Menu size={24} />
                  </button>
                  <span className="font-bold text-white">Recipes</span>
                  <div className="w-10" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-10">All Recipes</h2>
                <RecipeList recipes={[]} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeRecipe && (
          <CookingMode 
            recipe={activeRecipe} 
            onClose={() => setActiveRecipe(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
