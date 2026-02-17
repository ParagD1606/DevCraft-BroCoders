import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectOverview from './ProjectOverview';
import OpenRoles from './OpenRoles';
import ProjectTimeline from './ProjectTimeline';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        roles: [],
        startDate: '',
        endDate: '',
        commitment: ''
    });

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            // Redirect after showing success
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        }, 1500);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Created!</h2>
                <p className="text-gray-600">Your project is now live and ready for collaborators.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
                <p className="text-gray-500 mt-2">Share your idea and find the perfect team to build it.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <ProjectOverview formData={formData} updateFormData={updateFormData} />

                <div className="grid md:grid-cols-2 gap-6">
                    <OpenRoles formData={formData} updateFormData={updateFormData} />
                    <ProjectTimeline formData={formData} updateFormData={updateFormData} />
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium mr-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.title || formData.roles.length === 0}
                        className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            'Launch Project'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;
