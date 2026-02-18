import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from './ProjectHeader';
import SkillGapHighlight from './SkillGapHighlight';
import OpenRolesList from './OpenRolesList';
import TeamGrid from './TeamGrid';

const ProjectDetails = () => {
    const { id } = useParams();

    // Mock Data (In a real app, fetch based on ID)
    const project = {
        id: 1,
        title: 'EcoTrack SaaS Platform',
        status: 'Recruiting',
        shortDescription: 'A sustainability tracking platform for small businesses to monitor and reduce their carbon footprint.',
        fullDescription: `EcoTrack is designed to democratize sustainability analytics for SMEs. We are building a React-based dashboard that connects to utility APIs to visualize energy consumption in real-time. 
    
    The backend is powered by Node.js and PostgreSQL, with specific microservices for data normalization and ML-based anomaly detection. We are looking for passionate developers who care about the environment and want to use their skills for good.`,
        category: 'SaaS / Greentech',
        startDate: 'March 1, 2024',
        missingSkills: ['TypeScript'], // Simulating a skill gap for the current user
        roles: [
            { id: 101, title: 'Senior Frontend Dev', skills: ['React', 'TypeScript', 'D3.js'], commitment: '10h/week', spots: 1 },
            { id: 102, title: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL'], commitment: '15h/week', spots: 2 },
        ],
        team: [
            { id: 1, name: 'Sarah Chen', role: 'Project Lead', isLead: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
            { id: 2, name: 'Mike Ross', role: 'UI Designer', isLead: false, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' },
            { id: 3, name: 'Jessica Lee', role: 'Frontend Dev', isLead: false, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' },
            { id: 4, name: 'David Kim', role: 'DevOps', isLead: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
        ]
    };

    return (
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto space-y-6">
            <ProjectHeader project={project} />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2">
                    <SkillGapHighlight missingSkills={project.missingSkills} />

                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About the Project</h3>
                        <div className="prose prose-blue max-w-none text-gray-600 space-y-4 whitespace-pre-line">
                            {project.fullDescription}
                        </div>
                    </div>

                    <OpenRolesList roles={project.roles} />
                </div>

                {/* Right Column - Team & Info */}
                <div className="space-y-6">
                    <TeamGrid members={project.team} />

                    {/* Quick Links / Resources Placeholder */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-blue-600">
                            <li><a href="#" className="hover:underline">Project Roadmap</a></li>
                            <li><a href="#" className="hover:underline">Design System</a></li>
                            <li><a href="#" className="hover:underline">API Documentation</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
