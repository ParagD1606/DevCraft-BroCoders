import React from 'react';
import { Bell, MessageSquare, UserPlus, Star, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ type, title, message, time, isRead, onClick }) => {
    const getIcon = () => {
        switch (type) {
            case 'alert': return <Info size={16} className="text-blue-500" />;
            case 'invite': return <UserPlus size={16} className="text-green-500" />;
            case 'message': return <MessageSquare size={16} className="text-purple-500" />;
            case 'match': return <Star size={16} className="text-yellow-500" />;
            default: return <Bell size={16} className="text-gray-500" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'alert': return 'bg-blue-50';
            case 'invite': return 'bg-green-50';
            case 'message': return 'bg-purple-50';
            case 'match': return 'bg-yellow-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!isRead ? 'bg-blue-50/30' : ''
                }`}
        >
            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor()}`}>
                {getIcon()}
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {title}
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(time), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{message}</p>
            </div>

            {!isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            )}
        </div>
    );
};

export default NotificationItem;
