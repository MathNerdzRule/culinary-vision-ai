import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CameraSystem } from './components/CameraSystem';
import { RecipeList } from './components/RecipeList';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { useAppContext, AppProvider } from './context/AppContext';
import { analyzeIngredients } from './services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, Loader2, Menu, ChefHat, CheckCircle2, AlertCircle, Cloud } from 'lucide-react';

const Dashboard = ({ onOpenMenu }) => {
  const { 
    fridgeImage, setFridgeImage, 
    pantryImage, setPantryImage, 
    dietaryPreferences,
    setRecipes,
    isAnalyzing, setIsAnalyzing,
    setActiveRecipe,
    recipes,
    isDemo, setIsDemo
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
      setIsDemo(data.isDemo);
      
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
        <button onClick={onOpenMenu} className="p-2 text-charcoal-400 dark:hover:text-white hover:text-charcoal-900">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <ChefHat size={20} className="text-sage-500" />
          <span className="font-bold text-charcoal-900 dark:text-white text-sm">Culinary Vision</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6 py-10">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-500/10 text-sage-600 dark:text-sage-400 border border-sage-500/20 text-sm font-bold uppercase tracking-widest"
          >
            <Sparkles size={16} />
            <span>AI-Powered Culinary Assistant</span>
          </motion.div>
          
          {isDemo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-amber-600 dark:text-amber-500/80 uppercase tracking-tighter border border-amber-500/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(255,191,0,0.1)]"
            >
              Demo Mode Active
            </motion.div>
          )}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-charcoal-900 dark:text-white leading-tight">
          What's in your <br />
          <span className="text-sage-500">Kitchen today?</span>
        </h1>
        <p className="text-charcoal-500 dark:text-charcoal-400 text-lg md:text-xl max-w-2xl mx-auto">
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
        <section id="recipes-section" className="pt-10 border-t border-charcoal-200 dark:border-white/5 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white">Suggested for You</h2>
            <div className="text-sm text-charcoal-500 dark:text-charcoal-400">Total {recipes.length} matches</div>
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
  const { activeRecipe, setActiveRecipe, syncStatus, isSyncing } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300">
      {/* OurGroceries Sync Toast */}
      <AnimatePresence>
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 glass-card border-sage-500/50 shadow-2xl shadow-sage-500/20"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${syncStatus.includes('Failed') ? 'bg-red-500/20 text-red-500' : 'bg-sage-500/20 text-sage-500'}`}>
              {syncStatus.includes('Failed') ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-charcoal-900 dark:text-white leading-none">OurGroceries Sync</span>
              <span className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1">{syncStatus}</span>
            </div>
          </motion.div>
        )}

        {isSyncing && !syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 glass-card border-charcoal-200 dark:border-white/10"
          >
             <Loader2 className="animate-spin text-sage-500" size={18} />
             <span className="text-sm font-medium text-charcoal-900 dark:text-white">Syncing with OurGroceries...</span>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="lg:hidden p-6 border-b border-charcoal-200 dark:border-white/5 flex items-center justify-between">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-charcoal-500 dark:text-charcoal-400">
                  <Menu size={24} />
                </button>
                <span className="font-bold text-charcoal-900 dark:text-white">Shopping List</span>
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
                   <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-charcoal-500 dark:text-charcoal-400">
                    <Menu size={24} />
                  </button>
                  <span className="font-bold text-charcoal-900 dark:text-white">Recipes</span>
                  <div className="w-10" />
                </div>
                <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-10">All Recipes</h2>
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
