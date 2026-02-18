import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

const OpenRolesList = ({ roles }) => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={24} />
                Open Positions
            </h3>

            {roles.length === 0 ? (
                <div className="text-gray-500 text-sm bg-gray-50 border border-gray-100 rounded-xl p-4">
                    No roles are open for this project yet.
                </div>
            ) : (
                <div className="grid gap-4">
                    {roles.map((role) => (
                    <div
                        key={role.id}
                        className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-gray-50/50 hover:bg-white"
                    >
                        <div className="mb-4 md:mb-0">
                            <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                {role.title}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(role.skills || []).map(skill => (
                                    <span key={skill} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-xs rounded font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-900">{role.commitment || 'Flexible'}</div>
                                <div className="text-xs text-gray-500">{role.spots} spot{role.spots > 1 ? 's' : ''} left</div>
                            </div>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center"
                                onClick={() => alert(`Applied to ${role.title}!`)}
                            >
                                Apply Now
                                <ArrowRight size={16} className="ml-1 opacity-70" />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OpenRolesList;
