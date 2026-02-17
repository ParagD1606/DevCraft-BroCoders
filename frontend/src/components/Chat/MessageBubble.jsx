import React from 'react';
import { format } from 'date-fns';

const MessageBubble = ({ text, sender, timestamp, isMe, avatar }) => {
    return (
        <div className={`flex items-end gap-2 mb-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!isMe && (
                <img
                    src={avatar}
                    alt={sender}
                    className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm"
                />
            )}

            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm relative ${isMe
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                >
                    {text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {timestamp}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
