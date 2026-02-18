import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="grid lg:grid-cols-2 gap-12 2xl:gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                            v2.0 is now live
                        </div>
                        <h1 className="text-5xl lg:text-7xl 2xl:text-8xl font-bold text-gray-900 leading-tight mb-6">
                            Skill Matching, <br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Reimagined.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                            CollabSphere uses context-aware AI to connect the right talent with the right projects. Stop searching, start building.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30">
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:border-gray-300 shadow-sm">
                                View Projects
                            </button>
                        </div>
                        <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image / Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl p-4 md:p-8">
                            {/* Mock Dashboard UI */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <div className="h-4 w-32 bg-gray-100 rounded mb-2"></div>
                                            <div className="h-3 w-20 bg-gray-50 rounded"></div>
                                        </div>
                                        <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-3 w-24 bg-gray-100 rounded mb-1.5"></div>
                                                    <div className="h-2 w-16 bg-gray-50 rounded"></div>
                                                </div>
                                                <div className="h-6 w-16 bg-green-50 rounded-full text-xs text-green-600 flex items-center justify-center">
                                                    9{8 - i}% Match
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Float Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Skill Verified</div>
                                        <div className="text-xs text-gray-500">React.js Expert</div>
                                    </div>
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
