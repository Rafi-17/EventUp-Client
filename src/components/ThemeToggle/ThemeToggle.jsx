import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';

const ThemeToggle = ({ className = "" }) => {
    const { darkMode, toggleTheme } = useTheme();
    const { user } = useAuth(); 

    

    return (
        <div 
            onClick={toggleTheme} // The onClick handler is on this div
            className={`flex items-center justify-between w-full`}
        >
            {user && <span className='text-sm font-medium'>Theme</span>}
            <button
                // This button no longer needs an onClick handler
                className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full 
                bg-gray-800 hover:bg-gray-700 dark:bg-gray-300 dark:hover:bg-gray-200 
                transition-colors duration-200 ${className}`}
                aria-label="Toggle theme"
            >
                {darkMode ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                    <Moon className="h-4 w-4 text-gray-200" />
                )}
            </button>
        </div>
    );
};

export default ThemeToggle;