import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock3, Filter, Loader2, Search, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const ProjectBazaar = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('all');

    const fetchBazaar = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/project/bazaar`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch Project Bazaar');
            }
            setItems(Array.isArray(data.items) ? data.items : []);
        } catch (fetchError) {
            setError(fetchError.message || 'Failed to fetch Project Bazaar');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBazaar();
    }, []);

    const availableSkills = useMemo(() => {
        const skills = new Set();
        items.forEach((item) => {
            (item.skills || []).forEach((skill) => {
                const normalized = String(skill || '').trim();
                if (normalized) skills.add(normalized);
            });
        });
        return ['all', ...Array.from(skills).sort((a, b) => a.localeCompare(b)).slice(0, 12)];
    }, [items]);

    const filteredItems = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return items.filter((item) => {
            if (selectedSkill !== 'all') {
                const hasSkill = (item.skills || []).some(
                    (skill) => String(skill).trim().toLowerCase() === selectedSkill.toLowerCase()
                );
                if (!hasSkill) return false;
            }

            if (!normalizedSearch) return true;

            const corpus = [
                item.projectTitle,
                item.projectDescription,
                item.projectCategory,
                item.roleTitle,
                item.owner?.name,
                ...(item.skills || []),
            ]
                .join(' ')
                .toLowerCase();

            return corpus.includes(normalizedSearch);
        });
    }, [items, search, selectedSkill]);

    return (
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Project Bazaar</h1>
                    <p className="text-gray-500 mt-2">
                        Structured feed of open project roles posted by founders and team leads.
                    </p>
                </div>
                <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2">
                    {filteredItems.length} role{filteredItems.length !== 1 ? 's' : ''} available
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        type="text"
                        placeholder="Search by project, role, skill, or owner"
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide flex items-center gap-1">
                        <Filter size={12} />
                        Skill
                    </span>
                    {availableSkills.map((skill) => (
                        <button
                            key={skill}
                            type="button"
                            onClick={() => setSelectedSkill(skill)}
                            className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap ${selectedSkill === skill
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700'
                                }`}
                        >
                            {skill === 'all' ? 'All Skills' : skill}
                        </button>
                    ))}
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="min-h-[30vh] flex items-center justify-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading bazaar feed...
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 text-gray-500 rounded-2xl p-12 text-center">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    No open roles found for this filter.
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-5">
                    {filteredItems.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">
                                        {item.projectCategory || 'General'}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900">{item.roleTitle}</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">in {item.projectTitle}</p>
                                </div>
                                {Number(item.durationHours) > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                                        <Clock3 size={12} />
                                        {item.durationHours}h
                                    </span>
                                ) : null}
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {item.projectDescription}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {(item.skills || []).map((skill) => (
                                    <span
                                        key={`${item.id}-${skill}`}
                                        className="px-2 py-1 text-xs font-medium rounded-md bg-gray-50 border border-gray-200 text-gray-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>Posted by {item.owner?.name || 'Project Owner'}</p>
                                    <p className="inline-flex items-center gap-1">
                                        <Users size={12} />
                                        {item.spots} spot{item.spots > 1 ? 's' : ''} open
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate(`/project/${item.projectId}`)}
                                    className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    View Project
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectBazaar;
