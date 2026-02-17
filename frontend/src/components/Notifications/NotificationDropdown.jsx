import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Mock Data
    const notifications = [
        {
            id: 1,
            type: 'invite',
            title: 'Project Invitation',
            message: 'Sarah invited you to join "EcoTrack SaaS" as Frontend Lead.',
            time: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            isRead: false
        },
        {
            id: 2,
            type: 'message',
            title: 'New Message',
            message: 'Mike Ross: "I just pushed the changes, can you review?"',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isRead: false
        },
        {
            id: 3,
            type: 'match',
            title: 'New Match Found',
            message: 'Your profile matches 95% with a new project "DeFi Dashboard".',
            time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            isRead: true
        }
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/notifications');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                    >
                        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            <button
                                onClick={() => { }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        {...notification}
                                        onClick={() => { }} // Handle click
                                    />
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    <p>No new notifications</p>
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                            <button
                                onClick={handleViewAll}
                                className="w-full py-2 text-sm text-center text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-white transition-all"
                            >
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
