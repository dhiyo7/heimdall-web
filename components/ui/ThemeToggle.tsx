import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem('theme');
            if (stored === 'dark') return 'dark';
            if (stored === 'light') return 'light';
            return 'light'; // Default to light ignoring system preference
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white transition-all duration-300 focus:outline-none shadow-sm group"
            aria-label="Toggle Dark Mode"
        >
            <div className="transition-transform duration-500 group-hover:rotate-[360deg]">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
        </button>
    );
};
