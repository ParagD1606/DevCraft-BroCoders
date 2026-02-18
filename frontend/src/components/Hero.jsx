import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-100/60 to-purple-100/60 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-50/50 to-pink-50/50 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute top-1/3 left-10 w-64 h-64 bg-yellow-50/40 rounded-full blur-[80px]"></div>
            </div>

            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="grid lg:grid-cols-2 gap-12 2xl:gap-20 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-700 text-sm font-medium mb-8 hover:shadow-md transition-shadow cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                            </span>
                            v2.0 is now live
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-7xl 2xl:text-8xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-8">
                            Skill Matching, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                                Reimagined.
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                            CollabSphere uses context-aware AI to connect you with the perfect team. Stop searching, start building your dream project today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/20 active:scale-95"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/projects')}
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95"
                            >
                                <Play className="mr-2 w-5 h-5 fill-gray-700" size={20} />
                                View Demo
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Free for developers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>AI-powered matching</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image / Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative lg:h-[600px] flex items-center justify-center"
                    >
                        {/* Decorative blobs behind image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>

                        <div className="relative w-full max-w-lg lg:max-w-none">
                            {/* Main Glass Card */}
                            <div className="relative rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-blue-900/10 p-4 sm:p-6 lg:p-8 transform transition-transform hover:scale-[1.02] duration-500">
                                {/* Window Controls */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                </div>

                                {/* Mock UI Content */}
                                <div className="bg-white/50 rounded-xl border border-white/60 overflow-hidden">
                                    {/* Header */}
                                    <div className="h-14 border-b border-gray-100/50 flex items-center justify-between px-6 bg-white/40">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                                <Sparkles size={18} />
                                            </div>
                                            <div className="h-2.5 w-24 bg-gray-200 rounded-full"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
                                            <div className="h-4 w-12 bg-blue-100 rounded-full"></div>
                                        </div>

                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="group flex items-center gap-4 p-3 rounded-xl bg-white/60 border border-white/60 hover:border-blue-200 hover:bg-white/80 transition-all cursor-default shadow-sm hover:shadow-md">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 1 ? 'bg-indigo-100 text-indigo-600' :
                                                        i === 2 ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
                                                    }`}>
                                                    {['JD', 'AS', 'MR'][i - 1]}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-2.5 w-24 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>
                                                    <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                                        {99 - (i * 4)}% Match
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements - Verified Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-12 -right-8 w-48 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Skill Verified</div>
                                        <div className="text-xs text-gray-500">React.js Expert</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Elements - Active Users */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 z-20 flex items-center gap-4"
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                                    ))}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">500+</div>
                                    <div className="text-xs text-gray-500">Active Builders</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
