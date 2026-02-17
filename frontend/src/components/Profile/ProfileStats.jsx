import React from 'react';
import { Github, Star, GitCommit, GitPullRequest } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileStats = () => {
    // Mock data for visualization
    const contributions = [
        4, 2, 5, 8, 3, 0, 4,
        6, 8, 12, 4, 2, 6,
        3, 5, 8, 2, 0, 4,
        7, 3, 5, 9, 2, 6
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    GitHub Stats
                </h3>
                <span className="text-xs font-medium text-gray-500">Last 30 Days</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <Star size={14} />
                        <span className="text-xs">Stars</span>
                    </div>
                    <div className="font-bold text-gray-900">128</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <GitCommit size={14} />
                        <span className="text-xs">Commits</span>
                    </div>
                    <div className="font-bold text-gray-900">432</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                        <GitPullRequest size={14} />
                        <span className="text-xs">PRs</span>
                    </div>
                    <div className="font-bold text-gray-900">24</div>
                </div>
            </div>

            {/* Contribution Graph Placeholder */}
            <div>
                <div className="text-xs text-gray-500 mb-2">Contribution Activity</div>
                <div className="flex items-end gap-1 h-24">
                    {contributions.map((count, index) => (
                        <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            animate={{ height: `${(count / 12) * 100}%` }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex-1 rounded-t-sm ${count === 0 ? 'bg-gray-100' :
                                    count < 4 ? 'bg-green-200' :
                                        count < 8 ? 'bg-green-400' :
                                            'bg-green-600'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileStats;
