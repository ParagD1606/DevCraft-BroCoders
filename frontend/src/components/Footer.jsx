import React from 'react';
import { Twitter, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="grid md:grid-cols-12 gap-12 mb-16">
                    {/* Brand & Description */}
                    <div className="md:col-span-5">
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
                            CollabSphere
                        </h2>
                        <p className="text-gray-400 max-w-sm text-lg leading-relaxed mb-8">
                            Empowering developers and creators to find their perfect team with context-aware AI matchmaking. Build better, together.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all duration-300">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">How It Works</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Projects</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Newsletter - New Addition */}
                    <div className="md:col-span-3">
                        <h3 className="text-lg font-bold text-white mb-6">Stay Updated</h3>
                        <p className="text-gray-400 mb-4 text-sm">
                            Subscribe to our newsletter for the latest dev trends.
                        </p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
                            />
                            <button
                                type="button"
                                className="absolute right-1.5 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} CollabSphere. All rights reserved.
                    </p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
