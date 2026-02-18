import React, { useEffect, useMemo, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import AvailabilityCalendar from './AvailabilityCalendar';
import EditProfileModal from './EditProfileModal';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [repos, setRepos] = useState([]);
    const [reposLoading, setReposLoading] = useState(false);

    const readStoredUser = () => {
        try {
            return JSON.parse(localStorage.getItem('authUser') || '{}');
        } catch (_error) {
            return {};
        }
    };

    const fallbackAvatar = useMemo(() => {
        const authUser = readStoredUser();
        return (
            authUser.avatar ||
            'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        );
    }, []);

    const normalizeUser = (profile) => ({
        ...profile,
        avatar: profile.avatar || fallbackAvatar,
        verified: Boolean(profile.onboardingCompleted),
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        interests: Array.isArray(profile.interests) ? profile.interests : [],
        availability: profile.availability || {},
    });

    const fetchProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to load profile');
            }

            const normalized = normalizeUser(data);
            setUser(normalized);
            localStorage.setItem(
                'authUser',
                JSON.stringify({
                    ...readStoredUser(),
                    ...normalized,
                })
            );
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRepos = async () => {
        if (!user?.githubConnected) return;

        setReposLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/user/github/repos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRepos(data);
            }
        } catch (error) {
            console.error("Failed to fetch repos", error);
        } finally {
            setReposLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (user?.githubConnected) {
            fetchRepos();
        }
    }, [user?.githubConnected]);

    const handleSave = async (updatedUser) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: updatedUser.name,
                age: Number(updatedUser.age) || undefined,
                qualifications: updatedUser.qualifications,
                role: updatedUser.role,
                bio: updatedUser.bio,
                location: updatedUser.location,
                website: updatedUser.website,
                skills: updatedUser.skills || [],
                interests: updatedUser.interests || [],
                availability: updatedUser.availability || {},
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }

        const normalized = normalizeUser(data.user);
        setUser(normalized);
        localStorage.setItem(
            'authUser',
            JSON.stringify({
                ...readStoredUser(),
                ...normalized,
            })
        );
    };

    if (loading) {
        return (
            <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto min-h-[50vh] flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading profile...
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {error || 'Unable to load profile'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto space-y-6">
            <ProfileHeader user={user} onEdit={() => setIsEditing(true)} />

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Stats & Availability */}
                <div className="space-y-6">
                    <ProfileStats user={user} />
                    <AvailabilityCalendar availability={user.availability} />
                </div>

                {/* Right Column - Interests & GitHub */}
                <div className="lg:col-span-2 space-y-6">
                    {/* GitHub Repositories */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <span className="p-1.5 bg-gray-100 rounded-lg">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c-2.433-.927-4.131-3.292-4.131-6.04 0-3.568 2.894-6.462 6.462-6.462s6.462 2.894 6.462 6.462c0 2.748-1.698 5.112-4.132 6.039v-3.293c0-1.12.394-1.85.823-2.222-2.671-.297-5.478-1.313-5.478-5.921 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.118-3.176 0 0 1.006-.322 3.297 1.23 2.292-.266 3.298-.266 3.006.404.957-.266 1.983-.399 3.003-.404 2.293 1.552 3.301 1.23 3.301 1.23.652 1.652.241 2.873.117 3.176.767.84 1.236 1.911 1.236 3.221 0 4.597-2.805 5.624-5.467 5.931.344.299.654.829.761 1.604.686.307 2.423.837 3.493-.997 0 0 .634-1.153 1.839-1.237-1.089.745-.316 2.054-1.333 1.756-.705 1.956-6.666 4.908-6.666 1.416v2.234c0 .316.194.688.793.577 4.77-1.587 8.207-6.085 8.207-11.387 0-6.627-5.373-12-12-12z" /></svg>
                                </span>
                                GitHub Repositories
                            </h3>
                            {user.githubConnected && (
                                <a
                                    href={`https://github.com/${user.githubUsername}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                    View Profile
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </a>
                            )}
                        </div>

                        {user.githubConnected ? (
                            reposLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : repos.length > 0 ? (
                                <div className="space-y-4">
                                    {repos.map((repo) => (
                                        <div key={repo.id} onClick={() => window.open(repo.html_url, '_blank')} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                                        {repo.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{repo.description || "No description available"}</p>

                                                    <div className="flex items-center gap-4">
                                                        {repo.language && (
                                                            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                                {repo.language}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                            {repo.stargazers_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl">
                                    <p className="text-gray-500">No public repositories found</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c-2.433-.927-4.131-3.292-4.131-6.04 0-3.568 2.894-6.462 6.462-6.462s6.462 2.894 6.462 6.462c0 2.748-1.698 5.112-4.132 6.039v-3.293c0-1.12.394-1.85.823-2.222-2.671-.297-5.478-1.313-5.478-5.921 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.118-3.176 0 0 1.006-.322 3.297 1.23 2.292-.266 3.298-.266 3.006.404.957-.266 1.983-.399 3.003-.404 2.293 1.552 3.301 1.23 3.301 1.23.652 1.652.241 2.873.117 3.176.767.84 1.236 1.911 1.236 3.221 0 4.597-2.805 5.624-5.467 5.931.344.299.654.829.761 1.604.686.307 2.423.837 3.493-.997 0 0 .634-1.153 1.839-1.237-1.089.745-.316 2.054-1.333 1.756-.705 1.956-6.666 4.908-6.666 1.416v2.234c0 .316.194.688.793.577 4.77-1.587 8.207-6.085 8.207-11.387 0-6.627-5.373-12-12-12z" /></svg>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">Connect GitHub</h4>
                                <p className="text-gray-500 text-sm mb-4">Link your account to showcase your repositories</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                    Go to Settings
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 text-lg mb-4">Project Interests</h3>
                        <p className="text-gray-500 text-sm mb-5">
                            These were selected during onboarding and are used for matching.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {user.interests.length ? (
                                user.interests.map((interest) => (
                                    <span
                                        key={interest}
                                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                                    >
                                        {interest}
                                    </span>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No interests added yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Profile;
