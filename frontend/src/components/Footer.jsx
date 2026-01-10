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

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-all duration-300 hover:scale-110"
                                aria-label="Telegram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.773 13.87l-2.88-.903c-.626-.196-.642-.626.13-.93l11.25-4.34c.52-.19.976.128.8.93z" />
                                </svg>
                            </a>
                            <a
                                href="https://github.com/TechJitu/Nyay-Sahayak-react-UI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black dark:hover:bg-primary dark:hover:text-black transition-all duration-300 hover:scale-110"
                                aria-label="GitHub"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
