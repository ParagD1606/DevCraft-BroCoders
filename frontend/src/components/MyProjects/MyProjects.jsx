import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';

const MyProjects = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');

    const tabs = [
        { id: 'active', label: 'Active Projects' },
        { id: 'pending', label: 'Pending' },
        { id: 'completed', label: 'Completed' }
    ];

    // Mock Data
    const projects = [
        {
            id: 1,
            title: 'EcoTrack SaaS Platform',
            status: 'In Progress',
            role: 'Frontend Lead',
            description: 'A sustainability tracking platform for small businesses to monitor carbon footprint.',
            teamSize: 4,
            dueDate: 'Dec 20, 2024',
            progress: 75,
            type: 'active'
        },
        {
            id: 2,
            title: 'DeFi Dashboard',
            status: 'Review',
            role: 'Contributor',
            description: 'Web3 dashboard for tracking decentralized finance investments and liquidity pools.',
            teamSize: 3,
            dueDate: 'Nov 15, 2024',
            progress: 90,
            type: 'active'
        },
        {
            id: 3,
            title: 'AI Content Generator',
            status: 'Pending',
            role: 'Pending Approval',
            description: 'Generating blog posts and social media captions using GPT-4.',
            teamSize: 2,
            dueDate: 'Jan 10, 2025',
            progress: 0,
            type: 'pending'
        },
        {
            id: 4,
            title: 'Portfolio Website v1',
            status: 'Completed',
            role: 'Owner',
            description: 'Personal portfolio website showcasing projects and skills.',
            teamSize: 1,
            dueDate: 'Oct 01, 2024',
            progress: 100,
            type: 'completed'
        }
    ];

    const filteredProjects = projects.filter(p => p.type === activeTab);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                    <p className="text-gray-500 mt-2">Manage and track all your collaborative work.</p>
                </div>
                <button
                    onClick={() => navigate('/create-project')}
                    className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={20} className="mr-2" />
                    New Project
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl w-fit mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white shadow-sm rounded-lg"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map(project => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            layout
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
                    >
                        <Folder size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No projects found in this category.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
