import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useAppContext();

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-charcoal-100 dark:bg-charcoal-900/50 rounded-xl border border-charcoal-200 dark:border-white/5">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`relative flex items-center justify-center p-2 rounded-lg transition-all duration-300 group ${
              isActive ? 'text-sage-500' : 'text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200'
            }`}
            title={t.label}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 bg-white dark:bg-charcoal-800 rounded-lg shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={18} className="relative z-10" />
          </button>
        );
      })}
    </div>
  );
};
