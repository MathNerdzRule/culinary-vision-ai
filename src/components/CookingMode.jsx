import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Volume2, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CookingMode = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { addToShoppingList, shoppingList } = useAppContext();
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
    speak(recipe.instructions[currentStep]);
    return () => window.speechSynthesis.cancel();
  }, [currentStep]);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-charcoal-950 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-white/5 bg-charcoal-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-charcoal-400">
            <X size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">{recipe.name}</h2>
            <p className="text-sm text-charcoal-400">Step {currentStep + 1} of {recipe.instructions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => speak(recipe.instructions[currentStep])}
            className={`p-3 rounded-xl transition-all ${isSpeaking ? 'bg-sage-500 text-white' : 'bg-charcoal-800 text-charcoal-300'}`}
          >
            <Volume2 size={24} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-charcoal-900 overflow-hidden">
        <motion.div 
          className="h-full bg-sage-500 shadow-[0_0_15px_rgba(76,175,80,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* Step Text */}
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
              <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
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
        <div className="bg-charcoal-900/30 border-l border-white/5 p-8 overflow-y-auto hidden lg:block">
          <div className="mb-10">
            <h4 className="text-sm font-bold text-charcoal-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
              Ingredients for this step
            </h4>
            <div className="space-y-4">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${ing.isAvailable ? 'bg-sage-500' : 'bg-charcoal-600'}`} />
                    <span className={ing.isAvailable ? 'text-charcoal-200' : 'text-charcoal-500'}>
                      {ing.name}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-500 font-medium">{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {missingIngredients.length > 0 && (
            <div className="glass-card bg-amber-500/5 border-amber-500/20 p-6">
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <AlertCircle size={20} />
                <h4 className="font-bold">Missing Ingredients</h4>
              </div>
              <p className="text-xs text-amber-500/70 mb-4">
                You might not have these in your kitchen. Add them to your shopping list?
              </p>
              <div className="space-y-2">
                {missingIngredients.map((ing, i) => (
                  <button
                    key={i}
                    onClick={() => addToShoppingList(ing)}
                    disabled={shoppingList.some(s => s.name === ing.name)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-charcoal-900 border border-white/5 hover:border-amber-500/30 transition-all text-left"
                  >
                    <span className="text-sm text-charcoal-200">{ing.name}</span>
                    {shoppingList.some(s => s.name === ing.name) ? (
                      <CheckCircle2 size={16} className="text-sage-500" />
                    ) : (
                      <ShoppingCart size={16} className="text-charcoal-400 hover:text-amber-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
