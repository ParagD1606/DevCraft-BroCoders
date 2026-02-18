import React from 'react';
import { format } from 'date-fns';

const MessageBubble = ({ content, sender, createdAt, isMe, avatar, text, timestamp }) => {
    const messageContent = content || text;

    let messageTime;
    if (createdAt) {
        messageTime = format(new Date(createdAt), 'HH:mm');
    } else if (timestamp) {
        messageTime = timestamp;
    } else {
        messageTime = '';
    }

    return (
        <div className={`flex items-end gap-2 mb-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!isMe && (
                <img
                    src={avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                    alt={sender?.name || "User"}
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
                    {messageContent}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {messageTime}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
