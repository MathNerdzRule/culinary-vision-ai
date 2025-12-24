import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Volume2, ShoppingCart, CheckCircle2, AlertCircle, Clock, Flame } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CookingMode = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { addToShoppingList, shoppingList, recipeViewMode, setRecipeViewMode } = useAppContext();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (recipeViewMode === 'cooking') {
      speak(recipe.instructions[currentStep]);
    }
    return () => window.speechSynthesis.cancel();
  }, [currentStep, recipeViewMode]);

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;
  const missingIngredients = recipe.ingredients.filter(ing => !ing.isAvailable);

  const renderDetails = () => (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full space-y-12 pb-32">
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-sage-500 uppercase tracking-widest">About this Recipe</h3>
        <p className="text-xl md:text-2xl text-charcoal-700 dark:text-charcoal-200 leading-relaxed font-medium italic">
          "{recipe.rationale}"
        </p>
        <div className="flex flex-wrap gap-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sage-500/10 rounded-xl text-sage-500">
               <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider">Prep Time</p>
              <p className="text-charcoal-900 dark:text-white font-bold">{recipe.prepTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
               <Flame size={20} />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider">Calories</p>
              <p className="text-charcoal-900 dark:text-white font-bold">{recipe.calories} kcal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-charcoal-100 dark:bg-white/5 rounded-xl text-charcoal-500">
               <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider">Difficulty</p>
              <p className="text-charcoal-900 dark:text-white font-bold">{recipe.difficulty}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-sm font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest border-b border-charcoal-200 dark:border-white/5 pb-2">
            Ingredients & Portions
          </h3>
          <div className="space-y-4">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-charcoal-100 dark:border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ing.isAvailable ? 'bg-sage-500 shadow-[0_0_8px_rgba(76,175,80,0.5)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`} />
                  <span className="text-charcoal-900 dark:text-white font-medium">{ing.name}</span>
                </div>
                <span className="text-sage-600 dark:text-sage-400 font-bold">{ing.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest border-b border-charcoal-200 dark:border-white/5 pb-2">
            Suggested Kitchen Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.prepItems?.map((item, i) => (
              <span key={i} className="px-4 py-2 bg-charcoal-100 dark:bg-white/5 text-charcoal-700 dark:text-charcoal-300 rounded-xl text-sm font-medium border border-charcoal-200 dark:border-white/10">
                {item}
              </span>
            )) || (
              <p className="text-charcoal-400 italic text-sm">No specific tools listed.</p>
            )}
          </div>
          
          {missingIngredients.length > 0 && (
            <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-3">
                <AlertCircle size={18} />
                <h4 className="font-bold">Missing Ingredients</h4>
              </div>
              <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mb-4">You need these to complete the recipe:</p>
              <div className="flex flex-wrap gap-2">
                 {missingIngredients.map((ing, i) => (
                   <button 
                    key={i}
                    onClick={() => addToShoppingList(ing)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-charcoal-900 border border-charcoal-200 dark:border-white/10 rounded-lg text-xs hover:border-amber-500/50 transition-all font-bold"
                   >
                     {ing.name}
                     <ShoppingCart size={12} className="text-charcoal-400" />
                   </button>
                 ))}
              </div>
            </div>
          )}
        </section>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white dark:from-charcoal-950 via-white/80 dark:via-charcoal-950/80 to-transparent flex justify-center">
        <button 
          onClick={() => setRecipeViewMode('cooking')}
          className="btn-primary px-12 py-4 rounded-2xl shadow-2xl shadow-sage-500/30 flex items-center gap-3 text-lg"
        >
          <span className="font-bold">Start Cooking Now</span>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  const renderIngredients = () => (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-2xl mx-auto w-full space-y-8 pb-32">
       <div className="text-center space-y-2">
          <h3 className="text-sm font-bold text-sage-500 uppercase tracking-[0.3em]">Ingredient Checklist</h3>
          <p className="text-charcoal-500 dark:text-charcoal-400">Tap missing items to add to your shopping list</p>
       </div>
       <div className="glass-card p-4 md:p-8 space-y-4">
          {recipe.ingredients.map((ing, i) => {
            const isMissing = !ing.isAvailable;
            const inList = shoppingList.some(s => s.name === ing.name);
            
            return (
              <div 
                key={i} 
                onClick={() => isMissing && addToShoppingList(ing)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isMissing 
                    ? 'bg-amber-500/5 border-amber-500/10 cursor-pointer hover:border-amber-500/30' 
                    : 'bg-sage-500/5 border-sage-500/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                    isMissing 
                      ? 'bg-amber-500 shadow-amber-500/40' 
                      : 'bg-sage-500 shadow-sage-500/40'
                  }`} />
                  <div>
                    <span className={`text-lg font-bold ${isMissing ? 'text-charcoal-900 dark:text-white' : 'text-charcoal-400 dark:text-charcoal-500'}`}>
                      {ing.name}
                    </span>
                    {isMissing && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-tighter">
                        {inList ? 'Added to List' : 'Tap to Add to Shopping List'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sage-600 dark:text-sage-400 font-black text-xl">{ing.amount}</span>
                  {isMissing && (
                    <div className={`p-2 rounded-lg transition-colors ${inList ? 'bg-sage-500 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
                      {inList ? <CheckCircle2 size={18} /> : <ShoppingCart size={18} />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
       </div>
       <div className="flex flex-col items-center gap-6 pt-8">
          <button 
            onClick={() => setRecipeViewMode('cooking')}
            className="btn-primary px-10 py-4 shadow-xl shadow-sage-500/20 flex items-center gap-2"
          >
            <span>Start Cooking This</span>
            <ChevronRight size={24} />
          </button>
          <button 
            onClick={() => setRecipeViewMode('details')}
            className="text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white transition-all text-sm font-bold uppercase tracking-widest flex items-center gap-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </button>
       </div>
    </div>
  );

  const renderCooking = () => (
    <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
      {/* ... (renderCooking logic remains same) ... */}
      <div className="lg:col-span-2 p-8 md:p-16 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl"
          >
            <span className="text-sage-500 font-bold uppercase tracking-[0.2em] text-sm mb-6 block">Instruction</span>
            <h3 className="text-3xl md:text-5xl font-bold text-charcoal-900 dark:text-white leading-tight mb-8">
              {recipe.instructions[currentStep]}
            </h3>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn-secondary flex items-center gap-2 px-8 py-4 disabled:opacity-20"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === recipe.instructions.length - 1}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 disabled:opacity-20"
          >
            <span>Next Step</span>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="bg-charcoal-50/50 dark:bg-charcoal-900/30 lg:border-l border-charcoal-200 dark:border-white/5 p-8 overflow-y-auto hidden lg:block">
        <div className="mb-10">
          <h4 className="text-sm font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest mb-6 border-b border-charcoal-200 dark:border-white/5 pb-2">
            Remaining Ingredients
          </h4>
          <div className="space-y-4">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ing.isAvailable ? 'bg-sage-500' : 'bg-charcoal-300 dark:bg-charcoal-600'}`} />
                  <span className={ing.isAvailable ? 'text-charcoal-700 dark:text-charcoal-200' : 'text-charcoal-400 dark:text-charcoal-500'}>
                    {ing.name}
                  </span>
                </div>
                <span className="text-xs text-charcoal-400 dark:text-charcoal-500 font-medium">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50 dark:bg-charcoal-950 flex flex-col transition-colors duration-300"
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-charcoal-200 dark:border-white/5 bg-white/70 dark:bg-charcoal-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (recipeViewMode === 'cooking') setRecipeViewMode('details');
              else if (recipeViewMode === 'ingredients') setRecipeViewMode('details');
              else onClose();
            }} 
            className="p-2 hover:bg-charcoal-100 dark:hover:bg-white/5 rounded-full text-charcoal-500 dark:text-charcoal-400 transition-colors"
          >
            {(recipeViewMode === 'cooking' || recipeViewMode === 'ingredients') ? <ChevronLeft size={24} /> : <X size={24} />}
          </button>
          <div>
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-white capitalize">{recipe.name}</h2>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400 capitalize">
              {recipeViewMode === 'cooking' ? `Step ${currentStep + 1} of ${recipe.instructions.length}` : recipeViewMode}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {recipeViewMode === 'cooking' && (
            <button 
              onClick={() => speak(recipe.instructions[currentStep])}
              className={`p-3 rounded-xl transition-all ${isSpeaking ? 'bg-sage-500 text-white' : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300'}`}
            >
              <Volume2 size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Only in cooking) */}
      {recipeViewMode === 'cooking' && (
        <div className="h-1.5 w-full bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden">
          <motion.div 
            className="h-full bg-sage-500 shadow-[0_0_15px_rgba(76,175,80,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
           key={recipeViewMode}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="flex-1 overflow-hidden flex flex-col"
        >
          {recipeViewMode === 'details' && renderDetails()}
          {recipeViewMode === 'ingredients' && renderIngredients()}
          {recipeViewMode === 'cooking' && renderCooking()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
