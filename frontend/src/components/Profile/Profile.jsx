import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import AvailabilityCalendar from './AvailabilityCalendar';
import EditProfileModal from './EditProfileModal';
import { ArrowRight, Folder } from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: 'Alex Johnson',
        role: 'Senior Full Stack Developer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Passionate about building scalable web applications and exploring new technologies. I love open source and collaborating with diverse teams to solve complex problems.',
        location: 'San Francisco, CA',
        website: 'https://alexj.dev',
        verified: true,
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
        interests: ['SaaS', 'Web3', 'AI/ML'],
        githubConnected: true,
        availability: {
            'Mon': ['morning', 'evening'],
            'Wed': ['evening'],
            'Fri': ['afternoon']
        }
    });

    const projects = [
        { title: 'EcoTrack SaaS', role: 'Lead Architect', description: 'A sustainability tracking platform for small businesses.' },
        { title: 'DeFi Dashboard', role: 'Contributor', description: 'Real-time cryptocurrency portfolio tracker with Web3 integration.' },
        { title: 'AI Content Gen', role: 'Frontend Lead', description: 'Generative AI tool for marketing copy and social media posts.' },
    ];

    return (
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto space-y-6">
            <ProfileHeader user={user} onEdit={() => setIsEditing(true)} />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Stats & Availability */}
                <div className="space-y-6">
                    <ProfileStats />
                    <AvailabilityCalendar availability={user.availability} />
                </div>

                {/* Right Column - Projects */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Past Projects</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                View All <ArrowRight size={16} className="ml-1" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {projects.map((project, index) => (
                                <div key={index} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <Folder size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </h4>
                                            <p className="text-sm text-blue-600 font-medium mb-1">{project.role}</p>
                                            <p className="text-sm text-gray-600">{project.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSave={setUser}
                />
            )}
        </div>
    );
};

export default Profile;
