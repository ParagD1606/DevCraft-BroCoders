import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, SlidersHorizontal, UserPlus } from 'lucide-react';
import ProjectHeader from './ProjectHeader';
import SkillGapHighlight from './SkillGapHighlight';
import OpenRolesList from './OpenRolesList';
import TeamGrid from './TeamGrid';
import { API_BASE_URL } from '../../config/api';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Contributor');
    const [inviting, setInviting] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');
    const [progressDraft, setProgressDraft] = useState(0);
    const [progressSaving, setProgressSaving] = useState(false);
    const [progressError, setProgressError] = useState('');
    const [progressSuccess, setProgressSuccess] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError('');

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/project/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch project');
                }

                setProject(data.project || null);
            } catch (fetchError) {
                setError(fetchError.message || 'Failed to fetch project');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    useEffect(() => {
        if (project && Number.isFinite(Number(project.progress))) {
            setProgressDraft(Number(project.progress));
        }
    }, [project?.progress]);

    const handleInvite = async (event) => {
        event.preventDefault();
        setInviteError('');
        setInviteSuccess('');

        const normalizedEmail = inviteEmail.trim().toLowerCase();
        if (!normalizedEmail) {
            setInviteError('Enter an email address to invite.');
            return;
        }

        setInviting(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/project/${id}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    role: inviteRole,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send invite');
            }

            setInviteSuccess('Invitation sent successfully.');
            setInviteEmail('');
        } catch (actionError) {
            setInviteError(actionError.message || 'Failed to send invitation');
        } finally {
            setInviting(false);
        }
    };

    const handleSaveProgress = async () => {
        setProgressError('');
        setProgressSuccess('');
        setProgressSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/project/${id}/progress`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ progress: Number(progressDraft) }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update progress');
            }

            setProject(data.project || project);
            setProgressSuccess('Progress updated.');
        } catch (actionError) {
            setProgressError(actionError.message || 'Failed to update progress');
        } finally {
            setProgressSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto min-h-[40vh] flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading project...
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error || 'Project not found'}
                </div>
            </div>
        );
    }

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
                            {project.fullDescription || project.shortDescription}
                        </div>
                    </div>

                    <OpenRolesList roles={project.roles} />
                </div>

                {/* Right Column - Team & Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                            Project Progress
                        </h3>

                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Completion</span>
                            <span className="font-semibold text-gray-900">{Math.round(Number(project.progress) || 0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${Math.round(Number(project.progress) || 0)}%` }}
                            />
                        </div>

                        {project.isOwner ? (
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={progressDraft}
                                    onChange={(event) => setProgressDraft(Number(event.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-500">Set to {Math.round(progressDraft)}%</div>
                                    <button
                                        type="button"
                                        onClick={handleSaveProgress}
                                        disabled={progressSaving}
                                        className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {progressSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                                {progressError ? (
                                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
                                        {progressError}
                                    </div>
                                ) : null}
                                {progressSuccess ? (
                                    <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-md p-2">
                                        {progressSuccess}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="text-xs text-gray-500">
                                Only the project owner can edit progress.
                            </div>
                        )}
                    </div>

                    {project.isOwner ? (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-blue-600" />
                                Invite Team Member
                            </h3>

                            <form onSubmit={handleInvite} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        User Email
                                    </label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(event) => setInviteEmail(event.target.value)}
                                        placeholder="teammate@example.com"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Role In Project
                                    </label>
                                    <input
                                        type="text"
                                        value={inviteRole}
                                        onChange={(event) => setInviteRole(event.target.value)}
                                        placeholder="Contributor"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {inviteError ? (
                                    <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
                                        {inviteError}
                                    </div>
                                ) : null}

                                {inviteSuccess ? (
                                    <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-md p-2">
                                        {inviteSuccess}
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={inviting}
                                    className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {inviting ? 'Sending Invite...' : 'Send Invite'}
                                </button>
                            </form>
                        </div>
                    ) : null}

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
