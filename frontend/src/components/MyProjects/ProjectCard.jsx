import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MoreVertical, ArrowRight, Route } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Review': return 'bg-yellow-100 text-yellow-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{project.teamSize} members</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Due {project.dueDate}</span>
                </div>
                {Number(project.roadmapPhaseCount) > 0 ? (
                    <div className="flex items-center gap-1">
                        <Route size={14} />
                        <span>{Number(project.roadmapPhaseCount)} phases</span>
                    </div>
                ) : null}
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-500">{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs font-medium text-gray-500">
                    My Role: <span className="text-blue-600">{project.role}</span>
                </span>
                <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                    View Details
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
