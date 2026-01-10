import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xl">
                            N
                        </div>
                        <span className="font-bold text-xl tracking-tight">Nyay Sahayak</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#features">
                            Features
                        </a>
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#how-it-works">
                            How it Works
                        </a>
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#security">
                            Security
                        </a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate('/chat')}
                            className="hidden sm:block bg-primary hover:bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-lg transition-all transform hover:scale-105"
                        >
                            Start for Free
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
