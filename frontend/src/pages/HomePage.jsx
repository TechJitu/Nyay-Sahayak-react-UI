import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Search, MessageSquare, Building2, FileText, CheckCircle, XCircle, MessageCircle, ArrowRight, Zap, DollarSign, Clock, Shield, TrendingUp, FileCheck, Sparkles, Scale, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setDarkMode(!darkMode);
    };

    // Scroll reveal animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        const items = document.querySelectorAll('.reveal-item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-display transition-colors duration-300">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {/* Scroll Reveal Styles */}
            <style>{`
                .reveal-item > div:first-child {
                    opacity: 0;
                    transform: translateX(-50px);
                    transition: all 0.7s ease-out;
                }
                .reveal-item > div:last-child {
                    opacity: 0;
                    transform: translateX(50px);
                    transition: all 0.7s ease-out;
                }
                .reveal-item.revealed > div:first-child,
                .reveal-item.revealed > div:last-child {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                {/* Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 border border-gray-700 dark:bg-gray-800 dark:border-gray-600 mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                            NYAY SAHAYAK ACTIVE
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        Justice Decoded. <br />
                        <span className="text-primary relative inline-block">
                            Protection Activated.
                            <svg
                                className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40"
                                fill="none"
                                viewBox="0 0 200 9"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2.00025 6.99996C35.0538 3.52554 99.2555 -1.72124 198.001 2.50001"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="3"
                                />
                            </svg>
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        Your AI-powered legal companion. Get instant legal
                        answers with just your voice.
                    </p>

                    {/* Microphone Button */}
                    <div className="mt-12 flex flex-col items-center justify-center">
                        <div className="relative group cursor-pointer" onClick={() => navigate('/login')}>
                            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse-slow"></div>
                            <button className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-primary/50 shadow-2xl flex items-center justify-center transition-transform transform group-hover:scale-110 active:scale-95">
                                <Mic className="w-10 h-10 text-primary" />
                            </button>
                        </div>

                        {/* Wave Animation */}
                        <div className="h-12 flex items-center gap-1.5 mt-8">
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                            <div className="wave-bar"></div>
                        </div>

                        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-500">
                            Tap to speak or type your query below
                        </p>

                        {/* Search Input */}
                        <div className="mt-8 w-full max-w-xl mx-auto relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                className="block w-full pl-12 pr-16 py-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-lg"
                                placeholder="Ask: 'How do I file a consumer complaint?'"
                                type="text"
                                onFocus={() => navigate('/chat')}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <span className="text-xs text-gray-500 border border-gray-600 rounded px-2 py-1">
                                    Enter
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gradient-to-b from-amber-50/30 to-white dark:from-gray-900 dark:to-black relative overflow-hidden">
                {/* Background Legal Pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute top-10 left-10">
                        <Scale className="w-32 h-32 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div className="absolute bottom-10 right-10">
                        <Scale className="w-32 h-32 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <BookOpen className="w-48 h-48 text-gray-900 dark:text-gray-100" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary"></div>
                            <Scale className="w-8 h-8 text-primary" />
                            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary"></div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 font-serif">Empowering Citizens with AI</h2>
                        <p className="text-gray-600 dark:text-gray-400 italic">
                            "Streamlining the complexity of the Indian legal system"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 - Legal Document Style */}
                        <div className="group relative">
                            {/* Parchment/Document Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>

                            <div className="relative bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-amber-900/20 dark:border-primary/30 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                {/* Top Border - Legal Header */}
                                <div className="h-3 bg-gradient-to-r from-amber-900 via-primary to-amber-900 dark:from-primary/80 dark:via-primary dark:to-primary/80"></div>

                                {/* Official Stamp/Seal Corner */}
                                <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <MessageSquare className="w-8 h-8 text-primary" />
                                </div>

                                <div className="p-8 pt-6">
                                    {/* Document Title Bar */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <MessageSquare className="w-8 h-8 text-black" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-1 font-serif text-gray-900 dark:text-white">Smart Legal Chat</h3>
                                            <div className="h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                                        </div>
                                    </div>

                                    {/* Document Content */}
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                                        Interact with our AI trained on <strong className="text-amber-900 dark:text-primary">Indian Penal Code</strong> and <strong className="text-amber-900 dark:text-primary">Constitution</strong>. Get instant, accurate answers in any local language.
                                    </p>

                                    {/* Bottom Line */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-amber-900/10 dark:border-primary/10">
                                        <div className="flex-1 h-px bg-gradient-to-r from-amber-900/20 to-transparent dark:from-primary/20"></div>
                                        <Scale className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Legal Document Style */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>

                            <div className="relative bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-amber-900/20 dark:border-primary/30 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                <div className="h-3 bg-gradient-to-r from-amber-900 via-primary to-amber-900 dark:from-primary/80 dark:via-primary dark:to-primary/80"></div>

                                <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <Building2 className="w-8 h-8 text-primary" />
                                </div>

                                <div className="p-8 pt-6">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Building2 className="w-8 h-8 text-black" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-1 font-serif text-gray-900 dark:text-white">Digital Seva</h3>
                                            <div className="h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                                        Direct integration with government portals. Access <strong className="text-amber-900 dark:text-primary">e-Courts</strong>, file <strong className="text-amber-900 dark:text-primary">FIRs</strong>, and track case status without the bureaucracy.
                                    </p>

                                    <div className="flex items-center gap-2 pt-4 border-t border-amber-900/10 dark:border-primary/10">
                                        <div className="flex-1 h-px bg-gradient-to-r from-amber-900/20 to-transparent dark:from-primary/20"></div>
                                        <Scale className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Legal Document Style */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>

                            <div className="relative bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-amber-900/20 dark:border-primary/30 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                <div className="h-3 bg-gradient-to-r from-amber-900 via-primary to-amber-900 dark:from-primary/80 dark:via-primary dark:to-primary/80"></div>

                                <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <Mic className="w-8 h-8 text-primary" />
                                </div>

                                <div className="p-8 pt-6">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Mic className="w-8 h-8 text-black" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-1 font-serif text-gray-900 dark:text-white">Voice AI Assistant</h3>
                                            <div className="h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                                        Just say <strong className="text-amber-900 dark:text-primary">"Hey Sahayak"</strong> and speak your legal query in any language. Our AI responds instantly with accurate legal guidance.
                                    </p>

                                    <div className="flex items-center gap-2 pt-4 border-t border-amber-900/10 dark:border-primary/10">
                                        <div className="flex-1 h-px bg-gradient-to-r from-amber-900/20 to-transparent dark:from-primary/20"></div>
                                        <Scale className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Get Legal Help in <span className="text-primary">3 Simple Steps</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Your journey to legal clarity starts here
                        </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative max-w-3xl mx-auto">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-10 top-0 bottom-0 w-1">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary to-primary/0 animate-pulse"></div>
                        </div>

                        {/* Timeline Steps */}
                        <div className="space-y-16 relative">

                            {/* Step 1 */}
                            <div className="group relative flex items-start gap-8">
                                {/* Icon on the left */}
                                <div className="relative inline-block flex-shrink-0">
                                    {/* Outer Glow */}
                                    <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Pulse Rings */}
                                    <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping"></div>
                                    <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse"></div>

                                    {/* Main Circle */}
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary via-yellow-400 to-primary flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 transition-shadow duration-500 z-10">
                                        <MessageCircle className="w-9 h-9 text-black group-hover:scale-110 transition-transform duration-300" />
                                    </div>

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-lg z-20">
                                        <span className="text-xs font-bold text-primary">1</span>
                                    </div>
                                </div>

                                {/* Content on the right */}
                                <div className="flex-1 pt-4 transform transition-all duration-500 group-hover:translate-x-2">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                        Ask Your Question
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                        Type or speak your legal query in any language. Our AI understands multiple Indian languages and dialects.
                                    </p>

                                    {/* Decorative Bottom Line */}
                                    <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="group relative flex items-start gap-8">
                                {/* Icon on the left */}
                                <div className="relative inline-block flex-shrink-0">
                                    {/* Outer Glow */}
                                    <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Pulse Rings */}
                                    <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping"></div>
                                    <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse"></div>

                                    {/* Main Circle */}
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-primary to-blue-500 flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/50 transition-shadow duration-500 z-10">
                                        <Zap className="w-9 h-9 text-black group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                                    </div>

                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-lg z-20">
                                        <span className="text-xs font-bold text-primary">2</span>
                                    </div>
                                </div>

                                {/* Content on the right */}
                                <div className="flex-1 pt-4 transform transition-all duration-500 group-hover:translate-x-2">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                        Get Instant Answers
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                        Receive accurate legal guidance based on Indian laws, powered by AI trained on IPC and Constitution.
                                    </p>

                                    <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="group relative flex items-start gap-8">
                                {/* Icon on the left */}
                                <div className="relative inline-block flex-shrink-0">
                                    {/* Outer Glow */}
                                    <div className="absolute -inset-6 bg-gradient-to-r from-green-500/30 to-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Pulse Rings */}
                                    <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping"></div>
                                    <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse"></div>

                                    {/* Main Circle */}
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 via-primary to-green-500 flex items-center justify-center shadow-2xl group-hover:shadow-green-500/50 transition-shadow duration-500 z-10">
                                        <CheckCircle className="w-9 h-9 text-black group-hover:scale-110 transition-transform duration-300" />
                                    </div>

                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-lg z-20">
                                        <span className="text-xs font-bold text-primary">3</span>
                                    </div>
                                </div>

                                {/* Content on the right */}
                                <div className="flex-1 pt-4 transform transition-all duration-500 group-hover:translate-x-2">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                        Take Action
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                        File FIRs, access government portals, track cases, or connect with legal aid - all in one place.
                                    </p>

                                    <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 relative overflow-hidden bg-gray-50 dark:bg-[#0A0A0A]">
                {/* Background Effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Choose <span className="text-primary">Nyay Sahayak</span>?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Breaking free from the chains of traditional legal barriers
                        </p>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative max-w-6xl mx-auto">
                        {/* Center Vertical Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-red-500/0 via-red-500/30 to-primary/30 animate-pulse"></div>
                        </div>

                        {/* Comparison Items */}
                        <div className="space-y-24 md:space-y-32">

                            {/* Item 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative reveal-item">
                                <div className="md:text-right">
                                    <div className="inline-block md:ml-auto bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6 max-w-md">
                                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Financial Drain</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Draining hard-earned savings just to ask a simple question.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900 hidden md:flex z-10">
                                    <span className="text-black font-bold text-xl">VS</span>
                                </div>
                                <div className="md:text-left">
                                    <div className="inline-block bg-primary/10 dark:bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 max-w-md relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-yellow-600 rounded-2xl blur opacity-20"></div>
                                        <div className="relative flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-yellow-400 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <Sparkles className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary mb-2">Zero-Cost Clarity</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Instant, 24/7 legal guidance without the heavy price tag.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative reveal-item">
                                <div className="md:text-right">
                                    <div className="inline-block md:ml-auto bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6 max-w-md">
                                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Endless Delays</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Life put on hold for weeks waiting for basic paperwork.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900 hidden md:flex z-10">
                                    <span className="text-black font-bold text-xl">VS</span>
                                </div>
                                <div className="md:text-left">
                                    <div className="inline-block bg-primary/10 dark:bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 max-w-md relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-primary rounded-2xl blur opacity-20"></div>
                                        <div className="relative flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-primary to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <Zap className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary mb-2">Lightning Speed</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Auto-draft professional FIRs and contracts in seconds.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative reveal-item">
                                <div className="md:text-right">
                                    <div className="inline-block md:ml-auto bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6 max-w-md">
                                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <XCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Intimidation</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Confusing jargon designed to make you feel powerless.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900 hidden md:flex z-10">
                                    <span className="text-black font-bold text-xl">VS</span>
                                </div>
                                <div className="md:text-left">
                                    <div className="inline-block bg-primary/10 dark:bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 max-w-md relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-primary rounded-2xl blur opacity-20"></div>
                                        <div className="relative flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-primary to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <MessageSquare className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary mb-2">Knowledge is Power</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Complex laws decoded into your local language.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative reveal-item">
                                <div className="md:text-right">
                                    <div className="inline-block md:ml-auto bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6 max-w-md">
                                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Fear of Exploitation</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Vulnerable to manipulation due to lack of knowledge.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-primary flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900 hidden md:flex z-10">
                                    <span className="text-black font-bold text-xl">VS</span>
                                </div>
                                <div className="md:text-left">
                                    <div className="inline-block bg-primary/10 dark:bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 max-w-md relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-primary rounded-2xl blur opacity-20"></div>
                                        <div className="relative flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 via-primary to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <FileCheck className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary mb-2">The Upper Hand</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Back your stance with AI-driven research and citations.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item 5 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative reveal-item">
                                <div className="md:text-right">
                                    <div className="inline-block md:ml-auto bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6 max-w-md">
                                        <div className="flex md:flex-row-reverse items-start gap-4 md:text-right">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <TrendingUp className="w-6 h-6 text-white rotate-180" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Inaccessible Justice</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">The system feels like a luxury reserved only for the rich.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900 hidden md:flex z-10">
                                    <span className="text-black font-bold text-xl">VS</span>
                                </div>
                                <div className="md:text-left">
                                    <div className="inline-block bg-primary/10 dark:bg-primary/5 border-2 border-primary/30 rounded-2xl p-6 max-w-md relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-yellow-600 rounded-2xl blur opacity-20"></div>
                                        <div className="relative flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-yellow-400 to-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <Shield className="w-6 h-6 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary mb-2">Total Control</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">Navigate the legal system with confidence, not fear.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Security Section (Anchor for nav) */}
            <section id="security" className="py-12"></section>

            <Footer />
        </div>
    );
};


export default HomePage;
