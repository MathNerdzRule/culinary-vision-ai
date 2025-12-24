import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, Circle, ShoppingBag, Plus, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ShoppingList = () => {
  const { shoppingList, removeFromShoppingList, toggleShoppingListItem, clearCompleted, syncStatus, isSyncing } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-2">Shopping List</h2>
          <p className="text-charcoal-500 dark:text-charcoal-400">Total {shoppingList.length} items needed for your recipes</p>
        </div>
        {shoppingList.some(i => i.completed) && (
          <button 
            onClick={clearCompleted}
            className="text-sm font-medium text-sage-600 dark:text-sage-500 hover:text-sage-500 flex items-center gap-2"
          >
            Clear Completed
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {shoppingList.length > 0 ? (
            <div className="divide-y divide-charcoal-100 dark:divide-white/5">
              {shoppingList.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-4 group hover:bg-charcoal-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleShoppingListItem(item.id)}
                      className={`transition-colors ${item.completed ? 'text-sage-500' : 'text-charcoal-300 dark:text-charcoal-600 group-hover:text-charcoal-500 dark:group-hover:text-charcoal-400'}`}
                    >
                      {item.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.completed ? 'text-charcoal-300 dark:text-charcoal-500 line-through' : 'text-charcoal-900 dark:text-white'}`}>
                          {item.name}
                        </span>
                        {item.synced ? (
                          <Cloud size={14} className="text-sage-500" title="Synced with OurGroceries" />
                        ) : (
                          <CloudOff size={14} className="text-charcoal-400 dark:text-charcoal-500" title="Not synced" />
                        )}
                      </div>
                      {item.amount && (
                        <span className="text-xs text-charcoal-400 dark:text-charcoal-500">{item.amount}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromShoppingList(item.id)}
                    className="p-2 text-charcoal-300 dark:text-charcoal-600 hover:text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-charcoal-50 dark:bg-charcoal-800 flex items-center justify-center text-charcoal-300 dark:text-charcoal-400 mb-6">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Your list is empty</h3>
              <p className="text-charcoal-500 dark:text-charcoal-400 max-w-xs mx-auto">
                Missing ingredients from your favorite recipes will appear here.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>

  );
};
