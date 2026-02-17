import React, { useState } from 'react';
import { Github, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Step2GitHub = ({ formData, updateFormData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConnect = () => {
        setLoading(true);
        setError(null);

        // Simulate connection
        setTimeout(() => {
            setLoading(false);
            updateFormData('githubConnected', true);
        }, 1500);
    };

    const handleDisconnect = () => {
        updateFormData('githubConnected', false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sync Your GitHub</h2>
            <p className="text-gray-600 mb-8">Connect your GitHub to automatically showcase your best repositories and contributions.</p>

            {/* GitHub Card */}
            <div className={`border rounded-2xl p-6 transition-all ${formData.githubConnected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${formData.githubConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-900'
                            }`}>
                            <Github className="w-8 h-8" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-gray-900">GitHub Profile</h3>
                            <p className={`text-sm ${formData.githubConnected ? 'text-green-600' : 'text-gray-500'}`}>
                                {formData.githubConnected ? 'Connected Successfully' : 'Not Connected'}
                            </p>
                        </div>
                    </div>
                    {formData.githubConnected && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                </div>

                {/* Connect/Disconnect Button */}
                <div>
                    {!formData.githubConnected ? (
                        <button
                            onClick={handleConnect}
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Connecting...
                                </>
                            ) : (
                                'Connect GitHub'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleDisconnect}
                            className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Disconnect
                        </button>
                    )}
                </div>
            </div>

            {/* Info/Preview */}
            <AnimatePresence>
                {formData.githubConnected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4"
                    >
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-500">Repositories Found</span>
                                <span className="text-sm font-bold text-gray-900">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Top Language</span>
                                <span className="text-sm font-bold text-gray-900">JavaScript</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Step2GitHub;
