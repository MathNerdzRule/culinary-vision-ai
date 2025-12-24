import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Leaf, Flame, WheatOff, MilkOff, Carrot, ShoppingCart, Home, ChefHat, X, AlertCircle, Cloud } from 'lucide-react';


import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from './ThemeSwitcher';

const DIETARY_OPTIONS = [
  { id: 'Vegan', label: 'Vegan', icon: Leaf },
  { id: 'Vegetarian', label: 'Vegetarian', icon: Carrot },
  { id: 'GP', label: 'Gastroparesis', icon: AlertCircle },

  { id: 'Keto', label: 'Keto', icon: Flame },
  { id: 'Gluten-Free', label: 'Gluten-Free', icon: WheatOff },
  { id: 'Dairy-Free', label: 'Dairy-Free', icon: MilkOff },

];

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { 
    dietaryPreferences, 
    setDietaryPreferences, 
    ourGroceriesLists, 
    selectedListId, 
    setSelectedListId 
  } = useAppContext();

  const togglePreference = (id) => {
    setDietaryPreferences(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-charcoal-900 border-r border-charcoal-200 dark:border-white/5 p-6 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-500 rounded-xl flex items-center justify-center shadow-lg shadow-sage-500/20">
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-br from-charcoal-900 to-charcoal-500 dark:from-white dark:to-charcoal-400 bg-clip-text text-transparent">
              Culinary Vision
            </h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-charcoal-400">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 mb-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-sage-500/10 text-sage-600 dark:text-sage-400 border border-sage-500/20' 
                  : 'text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-50 dark:hover:bg-white/5 hover:text-charcoal-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
          <div>
            <h2 className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider mb-4 px-4">
              Dietary Preferences
            </h2>
            <div className="space-y-1">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => togglePreference(option.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    dietaryPreferences.includes(option.id)
                      ? 'bg-sage-500/10 text-sage-600 dark:text-sage-400 border border-sage-500/20'
                      : 'text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <option.icon size={18} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {dietaryPreferences.includes(option.id) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-sage-500 shadow-[0_0_8px_rgba(76,175,80,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {ourGroceriesLists.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 mb-4">
                <Cloud size={14} className="text-sage-500" />
                <h2 className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider">
                  Sync Destination
                </h2>
              </div>
              <div className="px-4">
                <select
                  value={selectedListId || ''}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full bg-charcoal-50 dark:bg-charcoal-800 border-none rounded-xl text-sm p-3 text-charcoal-700 dark:text-white focus:ring-2 focus:ring-sage-500/50 outline-none cursor-pointer appearance-none transition-all"
                >
                  {ourGroceriesLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-charcoal-400 dark:text-charcoal-500 mt-2">
                  Syncing to: <span className="text-sage-500">{ourGroceriesLists.find(l => l.id === selectedListId)?.name}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-charcoal-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-4 px-4">
             <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider">Appearance</span>
          </div>
          <ThemeSwitcher />
        </div>
      </aside>

    </>
  );
};

