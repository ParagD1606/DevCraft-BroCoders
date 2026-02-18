import React from 'react';
import { Search, Menu } from 'lucide-react';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const TopBar = ({ onMenuClick }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 2xl:px-10">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <Menu size={24} />
                </button>

                {/* Search */}
                <div className="hidden md:flex relative items-center">
                    <Search className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search projects, skills..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <NotificationDropdown />

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-gray-900">Alex Johnson</div>
                        <div className="text-xs text-gray-500">Full Stack Dev</div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                </div>
            </div>
        </header>
    );
};

export default TopBar;
