import React from 'react';
import { Clock, Flame, BarChart3, ChevronRight, CheckCircle2, ChevronDown, ChefHat, Heart, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import { motion } from 'framer-motion';

export const RecipeCard = ({ recipe }) => {
  const { favorites, toggleFavorite, setActiveRecipe, setRecipeViewMode } = useAppContext();
  const isFavorite = favorites.some(f => f.name === recipe.name);

  const handleSelect = (mode) => {
    setRecipeViewMode(mode);
    setActiveRecipe(recipe);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden border border-charcoal-200 dark:border-white/5 hover:border-sage-500/30 transition-all duration-300 group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <span 
              onClick={() => handleSelect('cooking')}
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex w-fit cursor-pointer hover:brightness-110 transition-all ${
              recipe.difficulty === 'Easy' ? 'bg-sage-500/20 text-sage-600 dark:text-sage-400' :
              recipe.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
              'bg-red-500/20 text-red-600 dark:text-red-400'
            }`}>
              {recipe.difficulty}
            </span>
            <h3 
              onClick={() => handleSelect('details')}
              className="text-xl font-bold text-charcoal-900 dark:text-white group-hover:text-sage-500 transition-colors cursor-pointer"
            >
              {recipe.name}
            </h3>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-charcoal-50 dark:bg-white/5 text-charcoal-400 dark:text-charcoal-500 hover:text-red-500'
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>


        <p 
          onClick={() => handleSelect('details')}
          className="text-sm text-charcoal-500 dark:text-charcoal-400 italic mb-6 line-clamp-2 cursor-pointer"
        >
          "{recipe.rationale}"
        </p>

        <div className="flex items-center gap-6 text-xs text-charcoal-500 dark:text-charcoal-300">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-sage-500" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-amber-500" />
            <span>{recipe.calories} kcal</span>
          </div>
          <div 
            onClick={() => handleSelect('ingredients')}
            className="flex items-center gap-2 cursor-pointer hover:text-sage-500 transition-colors"
          >
            <BarChart3 size={14} className="text-sage-500" />
            <span className="font-bold underline decoration-sage-500/30 underline-offset-4">{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
      </div>
      
      <div className="bg-charcoal-50 dark:bg-white/5 px-6 py-3 flex justify-between items-center border-t border-charcoal-200 dark:border-white/5">
        <button 
          onClick={() => handleSelect('details')}
          className="text-[10px] font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest hover:text-sage-500 transition-colors"
        >
          View Details
        </button>
        
        <button 
          onClick={() => handleSelect('cooking')}
          className="text-[10px] font-black text-sage-600 dark:text-sage-400 uppercase tracking-widest hover:text-sage-500 transition-colors flex items-center gap-1 group/btn"
        >
          Let's Cook
          <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export const RecipeList = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-64 animate-pulse-slow bg-charcoal-100 dark:bg-white/5" />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-charcoal-400 dark:text-charcoal-500">
        <ChefHat size={48} className="mb-4 opacity-20" />
        <p>No recipes generated yet. Scan your kitchen to begin!</p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
};
