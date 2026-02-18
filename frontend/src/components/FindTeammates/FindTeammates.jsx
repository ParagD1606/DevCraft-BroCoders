import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FilterSidebar from './FilterSidebar';
import TeammateCard from './TeammateCard';

const FindTeammates = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        skills: [],
        availability: [],
        experience: []
    });

    // Mock Data
    const teammates = [
        {
            id: 1,
            name: 'Sarah Chen',
            role: 'Frontend Developer',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            matchScore: 98,
            bio: 'React enthusiast with 5 years of experience. I love building intuitive UIs and working with design systems.',
            skills: ['React', 'TypeScript', 'Tailwind', 'Figma'],
            location: 'San Francisco, CA',
            availability: 'Full-time',
            experience: 'Senior'
        },
        {
            id: 2,
            name: 'Michael Ross',
            role: 'Backend Engineer',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
            matchScore: 95,
            bio: 'Scalable systems architect. Experienced with Node.js, Python, and cloud infrastructure.',
            skills: ['Node.js', 'Python', 'AWS', 'Docker'],
            location: 'New York, NY',
            availability: 'Part-time',
            experience: 'Senior'
        },
        {
            id: 3,
            name: 'Jessica Lee',
            role: 'UI/UX Designer',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
            matchScore: 92,
            bio: 'Designer who codes. I focus on creating accessible and beautiful user experiences.',
            skills: ['Figma', 'React', 'CSS', 'Prototyping'],
            location: 'London, UK',
            availability: 'Full-time',
            experience: 'Mid-level'
        },
        {
            id: 4,
            name: 'David Kim',
            role: 'Full Stack Dev',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            matchScore: 88,
            bio: 'Full stack developer looking for interesting side projects in Web3 or AI.',
            skills: ['React', 'Solidity', 'Web3', 'Node.js'],
            location: 'Remote',
            availability: 'Weekends',
            experience: 'Mid-level'
        },
        {
            id: 5,
            name: 'Emily Watson',
            role: 'Data Scientist',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
            matchScore: 85,
            bio: 'Passionate about extracting insights from data. Skilled in Python, SQL, and Machine Learning.',
            skills: ['Python', 'SQL', 'TensorFlow', 'Data Viz'],
            location: 'Berlin, DE',
            availability: 'Part-time',
            experience: 'Junior'
        },
        {
            id: 6,
            name: 'James Wilson',
            role: 'Product Manager',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            matchScore: 82,
            bio: 'Product manager with a technical background. I bridge the gap between business and engineering.',
            skills: ['Product Strategy', 'Agile', 'Jira', 'Analytics'],
            location: 'Austin, TX',
            availability: 'Full-time',
            experience: 'Senior'
        }
    ];

    const filteredTeammates = teammates.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSkills = filters.skills.length === 0 || user.skills.some(skill => filters.skills.includes(skill));
        const matchesAvailability = filters.availability.length === 0 || filters.availability.includes(user.availability);
        const matchesExperience = filters.experience.length === 0 || filters.experience.includes(user.experience);

        return matchesSearch && matchesSkills && matchesAvailability && matchesExperience;
    });

    return (
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredTeammates.length > 0 ? (
                            filteredTeammates.map(user => (
                                <TeammateCard key={user.id} user={user} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No teammates found matching your criteria. Try adjusting your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTeammates;
