import React from 'react';
import { MapPin, Link as LinkIcon, Edit2, CheckCircle } from 'lucide-react';

const ProfileHeader = ({ user, onEdit }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <button
                    onClick={onEdit}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                    <Edit2 size={18} />
                </button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-start">
                    <div className="-mt-16 mb-4">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    </div>
                    <div className="mt-4 flex gap-3">
                        {/* Social Links could go here */}
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {user.name}
                        {user.verified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </h1>
                    <p className="text-gray-500 font-medium">{user.role}</p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                        {user.location && (
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                {user.location}
                            </div>
                        )}
                        {user.website && (
                            <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                <LinkIcon size={16} />
                                {user.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>

                    <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">
                        {user.bio}
                    </p>

                    {/* Verified Skills */}
                    <div className="mt-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Verified Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
