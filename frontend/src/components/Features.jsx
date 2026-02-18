import React from 'react';
import { ShieldCheck, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
        title: 'Verified Skills',
        description: 'Our AI verifies candidate skills through GitHub analysis and real-world project context.',
    },
    {
        icon: <Zap className="w-8 h-8 text-indigo-600" />,
        title: 'Smart Matchmaking',
        description: 'Get matched with projects that fit your exact expertise and career goals instantly.',
    },
    {
        icon: <Users className="w-8 h-8 text-purple-600" />,
        title: 'Real-Time Collaboration',
        description: 'Integrated tools for seamless communication and project management.',
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose CollabSphere?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We're redefining how talent meets opportunity with intelligent, context-aware technology.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 2xl:gap-10">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
