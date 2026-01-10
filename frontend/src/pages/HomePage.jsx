import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Search, MessageSquare, Building2, FileText, CheckCircle, XCircle } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-display transition-colors duration-300">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

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
                        Your AI-powered legal companion. Draft documents, file reports, and get instant legal
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
            <section id="features" className="py-24 bg-gray-50 dark:bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Empowering Citizens with AI</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Streamlining the complexity of the Indian legal system.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group relative p-8 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/5">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                <MessageSquare className="w-8 h-8 text-gray-700 dark:text-white group-hover:text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Smart Legal Chat</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Interact with our AI trained on Indian Penal Code and Constitution. Get instant,
                                accurate answers in any local language.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative p-8 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/5">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                <Building2 className="w-8 h-8 text-gray-700 dark:text-white group-hover:text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Digital Seva</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Direct integration with government portals. Access e-Courts, file FIRs, and track
                                case status without the bureaucracy.
                            </p>
                        </div>

                        <div className="group relative p-8 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/5">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                <Mic className="w-8 h-8 text-gray-700 dark:text-white group-hover:text-black" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Voice AI Assistant</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Just say "Hey Sahayak" and speak your legal query in any language. Our AI responds instantly with accurate legal guidance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Get Legal Help in <span className="text-primary">3 Simple Steps</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Your journey to legal clarity starts here
                        </p>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black font-bold text-2xl shadow-xl transform hover:scale-110 transition-transform">
                                        1
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Ask Your Question</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Type or speak your legal query in any language
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black font-bold text-2xl shadow-xl transform hover:scale-110 transition-transform">
                                        2
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Get Instant Answers</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Receive accurate legal guidance based on Indian laws
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-black font-bold text-2xl shadow-xl transform hover:scale-110 transition-transform">
                                        3
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Take Action</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    File FIRs, access portals, or get legal aid
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Traditional Process */}
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                                    <XCircle className="w-7 h-7" />
                                    Traditional Legal Process
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <span>Expensive consultation fees just for basic advice.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <span>Weeks of waiting for document drafting.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <span>Complex legal jargon that is hard to understand.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Nyay Sahayak Way */}
                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-yellow-600 rounded-2xl blur opacity-25"></div>
                                <div className="relative p-8 rounded-2xl bg-background-light dark:bg-surface-dark border border-primary/30 shadow-2xl">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <CheckCircle className="w-7 h-7 text-primary" />
                                        The Nyay Sahayak Way
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>
                                                <strong>Free & Instant</strong> access to legal information via AI.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>
                                                <strong>One-Click</strong> document generation ready for print.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>
                                                <strong>Simplified language</strong> translated to your dialect.
                                            </span>
                                        </li>
                                    </ul>

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
