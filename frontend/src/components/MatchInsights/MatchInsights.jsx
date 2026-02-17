import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import CompatibilityScore from './CompatibilityScore';
import SkillBreakdown from './SkillBreakdown';
import AvailabilityChart from './AvailabilityChart';

const MatchInsights = () => {
    // Mock Data
    const overallScore = 85;
    const skills = [
        { name: 'React & Frontend', match: 95 },
        { name: 'Node.js & Backend', match: 70 },
        { name: 'UI/UX Principles', match: 88 },
        { name: 'DevOps & CI/CD', match: 40 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Match Insights</h1>
                    <p className="text-gray-500 mt-2">AI-driven analysis of your compatibility with current projects.</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 self-start md:self-auto">
                    <Sparkles size={16} />
                    AI Analysis Updated Today
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Score Column */}
                <div className="lg:col-span-1">
                    <CompatibilityScore score={overallScore} />
                </div>

                {/* AI Recommendations - Spans 2 cols on lg */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Sparkles className="text-yellow-300" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">AI Recommendation</h2>
                        </div>
                        <p className="text-blue-100 text-lg mb-6 leading-relaxed max-w-2xl">
                            You are a strong match for <strong className="text-white">EcoTrack SaaS</strong> platform.
                            Your frontend skills overlap 95% with their requirements.
                            However, improving your <strong className="text-white">Docker</strong> knowledge could increase your match score by 15%.
                        </p>
                        <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2 shadow-sm">
                            View Project Details
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Breakdown Row */}
                <div className="lg:col-span-2">
                    <SkillBreakdown skills={skills} />
                </div>
                <div className="lg:col-span-1">
                    <AvailabilityChart />
                </div>
            </div>
        </div>
    );
};

export default MatchInsights;
