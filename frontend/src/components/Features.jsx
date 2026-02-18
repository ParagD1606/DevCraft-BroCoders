import React from 'react';
import { ShieldCheck, Zap, Users, Code, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
        title: 'Verified Skills',
        description: 'Our AI verifies candidate skills through GitHub analysis and real-world project context.',
        color: 'bg-blue-50',
    },
    {
        icon: <Zap className="w-6 h-6 text-amber-600" />,
        title: 'Smart Matchmaking',
        description: 'Get matched with projects that fit your exact expertise and career goals instantly.',
        color: 'bg-amber-50',
    },
    {
        icon: <Users className="w-6 h-6 text-purple-600" />,
        title: 'Real-Time Collaboration',
        description: 'Integrated tools for seamless communication and project management.',
        color: 'bg-purple-50',
    },
    {
        icon: <Code className="w-6 h-6 text-emerald-600" />,
        title: 'Repo Analysis',
        description: 'Deep dive into code quality and contribution history to ensure high standards.',
        color: 'bg-emerald-50',
    },
    {
        icon: <Globe className="w-6 h-6 text-cyan-600" />,
        title: 'Global Talent',
        description: 'Connect with developers from around the world without borders.',
        color: 'bg-cyan-50',
    },
    {
        icon: <Cpu className="w-6 h-6 text-rose-600" />,
        title: 'AI Insights',
        description: 'Data-driven insights to help you build better teams and shipping faster.',
        color: 'bg-rose-50',
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent opacity-50"></div>

            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">CollabSphere?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            We're redefining how talent meets opportunity with intelligent, context-aware technology designed for modern dev teams.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
