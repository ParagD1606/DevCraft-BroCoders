import React, { useState } from 'react';
import { Filter, CheckCircle } from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationsPage = () => {
    const [filter, setFilter] = useState('all');

    // Mock Data (Expanded)
    const notifications = [
        {
            id: 1,
            type: 'invite',
            title: 'Project Invitation',
            message: 'Sarah invited you to join "EcoTrack SaaS" as Frontend Lead.',
            time: new Date(Date.now() - 1000 * 60 * 30),
            isRead: false
        },
        {
            id: 2,
            type: 'message',
            title: 'New Message',
            message: 'Mike Ross: "I just pushed the changes, can you review?"',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2),
            isRead: false
        },
        {
            id: 3,
            type: 'match',
            title: 'New Match Found',
            message: 'Your profile matches 95% with a new project "DeFi Dashboard".',
            time: new Date(Date.now() - 1000 * 60 * 60 * 5),
            isRead: true
        },
        {
            id: 4,
            type: 'alert',
            title: 'System Maintenance',
            message: 'CollabSphere will be undergoing scheduled maintenance tonight at 2 AM EST.',
            time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isRead: true
        },
        {
            id: 5,
            type: 'invite',
            title: 'Connection Request',
            message: 'David Kim wants to connect with you.',
            time: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            isRead: true
        }
    ];

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter || (filter === 'unread' && !n.isRead));

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'unread', label: 'Unread' },
        { id: 'invite', label: 'Invites' },
        { id: 'message', label: 'Messages' },
        { id: 'alert', label: 'System' }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-2">Manage your alerts and activity updates.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                    <CheckCircle size={18} />
                    Mark all as read
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === f.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                {...notification}
                            />
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <Filter size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No notifications found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
