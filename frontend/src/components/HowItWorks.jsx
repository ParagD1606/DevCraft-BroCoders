import React from 'react';
import { UserPlus, Briefcase, Rocket, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: <UserPlus className="w-8 h-8 text-white" />,
        title: 'Create Profile',
        description: 'Sign up and sync your GitHub to automatically verify your skills and experience.',
        color: 'from-blue-500 to-blue-600',
        shadow: 'shadow-blue-500/30',
        delay: 0,
    },
    {
        icon: <Briefcase className="w-8 h-8 text-white" />,
        title: 'Get Matched',
        description: 'Our AI analyzes your profile to find projects that match your expertise perfectly.',
        color: 'from-indigo-500 to-indigo-600',
        shadow: 'shadow-indigo-500/30',
        delay: 0.2,
    },
    {
        icon: <Rocket className="w-8 h-8 text-white" />,
        title: 'Start Building',
        description: 'Join a team, collaborate in real-time, and ship amazing products together.',
        color: 'from-purple-500 to-purple-600',
        shadow: 'shadow-purple-500/30',
        delay: 0.4,
    },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            How CollabSphere Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Three simple steps to launch your next big project.
                        </p>
                    </motion.div>
                </div>

                <div className="relative grid md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 z-0 rounded-full"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: step.delay }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-8">
                                <div
                                    className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl ${step.shadow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out`}
                                >
                                    {step.icon}
                                </div>
                                <div className={`absolute -inset-4 bg-gradient-to-br ${step.color} opacity-20 blur-xl rounded-full -z-10 group-hover:opacity-30 transition-opacity`}></div>

                                <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 font-bold text-gray-400">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-lg text-gray-600 max-w-xs mx-auto leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
