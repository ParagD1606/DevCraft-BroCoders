import React from 'react';

const AvailabilityChart = () => {
    // Mock data for overlapping hours (0 = no overlap, 1 = overlap)
    // Simple visual representation of a week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Availability Overlap</h3>

            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span>High Overlap</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                    <span>Partial Overlap</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                    <span>No Overlap</span>
                </div>
            </div>

            <div className="space-y-3">
                {days.map(day => (
                    <div key={day} className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-500 w-8">{day}</span>
                        <div className="flex-1 flex gap-1 h-6">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm ${Math.random() > 0.6 ? 'bg-blue-500' : Math.random() > 0.3 ? 'bg-blue-200' : 'bg-gray-100'
                                        }`}
                                    title={`Slot ${i + 1}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">9:00 AM - 5:00 PM EST Normalized</p>
        </div>
    );
};

export default AvailabilityChart;
