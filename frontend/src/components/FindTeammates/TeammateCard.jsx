import React from 'react';
import { UserPlus, Star, MapPin } from 'lucide-react';

const TeammateCard = ({ user }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{user.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{user.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full text-xs font-bold text-green-700">
                    <Star size={12} className="fill-current" />
                    {user.matchScore}%
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                {user.bio}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {user.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-medium border border-gray-100">
                        {skill}
                    </span>
                ))}
                {user.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg font-medium border border-gray-100">+{user.skills.length - 3}</span>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div className="flex items-center text-xs text-gray-400 gap-1">
                    <MapPin size={12} />
                    {user.location}
                </div>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    <UserPlus size={16} />
                    Connect
                </button>
            </div>
        </div>
    );
};

export default TeammateCard;
