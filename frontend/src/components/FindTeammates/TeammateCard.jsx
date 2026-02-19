import React from 'react';
import { UserPlus, MapPin, Briefcase, Clock } from 'lucide-react';

const TeammateCard = ({ user, onViewDetails }) => {
    // Default avatar if none provided
    const avatarUrl = user.avatar || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onViewDetails?.(user)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onViewDetails?.(user);
                }
            }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={avatarUrl}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{user.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{user.role || 'Developer'}</p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                {user.bio || 'No bio available.'}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {user.skills && user.skills.length > 0 ? (
                    <>
                        {user.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-medium border border-gray-100">
                                {skill}
                            </span>
                        ))}
                        {user.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg font-medium border border-gray-100">+{user.skills.length - 3}</span>
                        )}
                    </>
                ) : (
                    <span className="text-xs text-gray-400 italic">No skills listed</span>
                )}
            </div>

            <div className="mt-auto space-y-3">
                {typeof user.semanticScore === 'number' ? (
                    <div className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-1 inline-flex items-center gap-1">
                        Smart match score: {(user.semanticScore * 100).toFixed(1)}%
                    </div>
                ) : null}

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Briefcase size={12} />
                        {user.experienceLevel || 'Junior'}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {user.availabilityStatus || 'Part-time'}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                        <MapPin size={12} />
                        {user.location || 'Remote'}
                    </div>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            alert(`Connect request sent to ${user.name}!`);
                        }}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <UserPlus size={16} />
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeammateCard;
