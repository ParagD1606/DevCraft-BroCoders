import React from 'react';

const SkillBreakdown = ({ skills }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Match Breakdown</h3>

            <div className="space-y-5">
                {skills.map((skill) => (
                    <div key={skill.name}>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                            <span className="text-xs font-bold text-gray-900">{skill.match}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${skill.match >= 80 ? 'bg-green-500' :
                                        skill.match >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                                    }`}
                                style={{ width: `${skill.match}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Identified Gaps</h4>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">
                        Docker (Required)
                    </span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium border border-orange-100">
                        GraphQL (Recommended)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SkillBreakdown;
