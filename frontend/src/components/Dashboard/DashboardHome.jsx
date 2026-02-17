import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, Users, Star, ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';

const DashboardHome = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Active Projects', value: '3', icon: <Folder className="text-blue-600" />, trend: '+1 this week' },
        { label: 'Project Invites', value: '5', icon: <Users className="text-purple-600" />, trend: '2 new today' },
        { label: 'Profile Views', value: '42', icon: <TrendingUp className="text-green-600" />, trend: '+24% vs last week' },
    ];

    const suggestedMatches = [
        { title: 'EcoTrack SaaS', role: 'Frontend Dev', match: '98%', skills: ['React', 'Tailwind'] },
        { title: 'DeFi Dashboard', role: 'Full Stack', match: '95%', skills: ['Node.js', 'Web3'] },
        { title: 'AI Content Gen', role: 'UI Designer', match: '92%', skills: ['Figma', 'UX'] },
    ];

    const activeProjects = [
        { title: 'CollabSphere', role: 'Lead Frontend', status: 'In Progress', progress: 75 },
        { title: 'TaskMaster', role: 'Contributor', status: 'Review', progress: 90 },
        { title: 'Portfolio v2', role: 'Owner', status: 'Planning', progress: 20 },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex! 👋</h1>
                    <p className="text-gray-500">Here's what's happening with your projects today.</p>
                </div>
                <button
                    onClick={() => navigate('/create-project')}
                    className="hidden md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Star className="w-4 h-4 mr-2" />
                    Create New Project
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.includes('+') || stat.trend.includes('new') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Projects (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Projects */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Active Projects</h2>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {activeProjects.map((project, index) => (
                                    <div
                                        key={index}
                                        onClick={() => navigate(`/project/${index + 1}`)}
                                        className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                                {project.title.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{project.title}</div>
                                                <div className="text-sm text-gray-500">{project.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden sm:block w-32">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="text-gray-700 font-medium">{project.progress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                project.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {project.status}
                                            </span>
                                            <button className="text-gray-400 hover:text-blue-600">
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Skill Gap Alerts */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Skill Gap Alerts</h2>
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-orange-900">Missing TypeScript Proficiency</h3>
                                <p className="text-sm text-orange-700 mt-1">
                                    2 projects you're interested in require TypeScript. Consider taking a quick verification test to boost your match score.
                                </p>
                                <button className="mt-3 text-sm font-medium text-orange-700 hover:text-orange-800 underline">
                                    Take Verification Test
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Suggestions (1/3 width) */}
                <div className="space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Suggested Matches</h2>
                            <button className="text-gray-400 hover:text-gray-600">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {suggestedMatches.map((match, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    onClick={() => navigate(`/project/${index + 10}`)}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{match.title}</h3>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                            {match.match}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{match.role}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {match.skills.map(skill => (
                                            <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
