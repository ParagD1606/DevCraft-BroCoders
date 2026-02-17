import React from 'react';
import { UserPlus, Briefcase, Rocket } from 'lucide-react';

const steps = [
    {
        icon: <UserPlus className="w-6 h-6 text-white" />,
        title: 'Create Profile',
        description: 'Sign up and sync your GitHub to automatically verify your skills and experience.',
        color: 'bg-blue-600',
    },
    {
        icon: <Briefcase className="w-6 h-6 text-white" />,
        title: 'Get Matched',
        description: 'Our AI analyzes your profile to find projects that match your expertise perfectly.',
        color: 'bg-indigo-600',
    },
    {
        icon: <Rocket className="w-6 h-6 text-white" />,
        title: 'Start Building',
        description: 'Join a team, collaborate in real-time, and ship amazing products together.',
        color: 'bg-purple-600',
    },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        How CollabSphere Works
                    </h2>
                    <p className="text-xl text-gray-600">
                        Three simple steps to launch your next big project.
                    </p>
                </div>

                <div className="relative grid md:grid-cols-3 gap-8">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center">
                            <div
                                className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300`}
                            >
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
