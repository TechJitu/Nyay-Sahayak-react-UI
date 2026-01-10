import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Shield, Lock, FileCheck, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black border-t border-gray-200 dark:border-gray-800 pt-20 pb-8 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

                    {/* Brand & About */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md"></div>
                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black font-bold text-xl shadow-lg">
                                    N
                                </div>
                            </div>
                            <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                Nyay Sahayak
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            Making justice accessible, affordable, and understandable for every Indian citizen through AI-powered legal assistance.
                        </p>

                        {/* Trust Badges */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>256-bit Encryption</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Lock className="w-4 h-4 text-blue-500" />
                                <span>Secure & Private</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Why Choose Us
                                </a>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Get Started
                                </Link>
                            </li>
                            <li>
                                <a href="#contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Meet the Developers</h4>
                        <div className="space-y-4">
                            <a
                                href="https://github.com/zubershk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-primary/10 dark:hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                                    Z
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">@zubershk</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Developer</p>
                                </div>
                                <Github className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>

                            <a
                                href="https://github.com/techJitu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-primary/10 dark:hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                                    T
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">@techJitu</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Developer</p>
                                </div>
                                <Github className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </a>

                            <a
                                href="https://github.com/TechJitu/Nyay-Sahayak-react-UI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-yellow-500/10 hover:from-primary/20 hover:to-yellow-500/20 border border-primary/30 hover:border-primary/50 transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                                    <Github className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">View Repository</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Star us on GitHub</p>
                                </div>
                                <svg className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                            © 2025 Nyay Sahayak. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
