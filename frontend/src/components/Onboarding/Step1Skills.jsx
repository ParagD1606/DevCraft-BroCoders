import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const skillsList = [
    'React', 'Node.js', 'Python', 'TypeScript', 'TailwindCSS',
    'GraphQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS',
    'Figma', 'UI/UX Design', 'Next.js', 'Vue.js', 'Angular'
];

const Step1Skills = ({ formData, updateFormData }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddSkill = (skill) => {
        if (!formData.skills.includes(skill)) {
            updateFormData('skills', [...formData.skills, skill]);
        }
        setSearchTerm('');
    };

    const handleRemoveSkill = (skill) => {
        updateFormData('skills', formData.skills.filter(s => s !== skill));
    };

    const filteredSkills = skillsList.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !formData.skills.includes(skill)
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Skills</h2>
            <p className="text-gray-600 mb-8">Add skills to help us match you with the right projects.</p>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
                <AnimatePresence>
                    {formData.skills.map(skill => (
                        <motion.span
                            key={skill}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                        >
                            {skill}
                            <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-2 hover:text-blue-900 focus:outline-none"
                            >
                                <X size={14} />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder="Search skills (e.g. React, Python)"
                />
            </div>

            {/* Suggestions */}
            {searchTerm && (
                <div className="bg-white border border-gray-100 rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto">
                    {filteredSkills.length > 0 ? (
                        filteredSkills.map(skill => (
                            <button
                                key={skill}
                                onClick={() => handleAddSkill(skill)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                            >
                                {skill}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">No skills found</div>
                    )}
                </div>
            )}

            {/* Popular Skills */}
            {!searchTerm && (
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {skillsList.slice(0, 10).map(skill => {
                            const isSelected = formData.skills.includes(skill);
                            return (
                                <button
                                    key={skill}
                                    onClick={() => !isSelected && handleAddSkill(skill)}
                                    disabled={isSelected}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${isSelected
                                            ? 'bg-blue-50 border-blue-200 text-blue-400 cursor-default'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                        }`}
                                >
                                    {skill}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step1Skills;
