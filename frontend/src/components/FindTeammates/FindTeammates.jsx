import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import TeammateCard from './TeammateCard';
import { API_BASE_URL } from '../../config/api';

const FindTeammates = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        skills: [],
        availability: [],
        experience: []
    });
    const [teammates, setTeammates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTeammates = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams();

            if (searchQuery) queryParams.append('search', searchQuery);
            if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));
            if (filters.availability.length > 0) queryParams.append('availability', filters.availability.join(','));
            if (filters.experience.length > 0) queryParams.append('experience', filters.experience.join(','));

            const response = await fetch(`${API_BASE_URL}/api/user?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to fetch teammates');
            }

            const data = await response.json();
            setTeammates(data);
        } catch (err) {
            console.error('Error fetching teammates:', err);
            setError('Failed to load teammates. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTeammates();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, filters]);

    return (
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Find Teammates</h1>
                <p className="text-gray-500 mt-2">Discover talented developers, designers, and creators for your next project.</p>
            </div>

            <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 xl:col-span-1">
                    <FilterSidebar filters={filters} setFilters={setFilters} />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 xl:col-span-4">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, role, or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                        />
                    </div>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
                            {error}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {teammates.length > 0 ? (
                                teammates.map(user => (
                                    <TeammateCard key={user._id} user={user} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-lg font-medium text-gray-900">No teammates found</p>
                                    <p className="mt-1">Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindTeammates;
