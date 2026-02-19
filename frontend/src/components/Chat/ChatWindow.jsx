import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Phone, Video, Users } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ activeConversation, currentUser, messages, onSend, connectionStatus }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const sent = onSend(newMessage);
        if (sent) {
            setNewMessage('');
        }
    };

    const getOtherUser = () => {
        if (!activeConversation || !activeConversation.participants || !currentUser) return null;
        // Check if participants is an array and has at least 2 elements
        if (!Array.isArray(activeConversation.participants) || activeConversation.participants.length < 2) return null;

        const currentUserId = currentUser.id || currentUser._id;

        return activeConversation.participants[0]._id === currentUserId
            ? activeConversation.participants[1]
            : activeConversation.participants[0];
    };

    const otherUser = getOtherUser();
    const isGroupChat = Boolean(activeConversation?.isGroupChat || activeConversation?.project);
    const groupTitle = activeConversation?.chatName || activeConversation?.project?.title || 'Project Group';
    const participantCount = Array.isArray(activeConversation?.participants)
        ? activeConversation.participants.length
        : 0;

    if (!activeConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 flex-col gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <Send size={32} className="opacity-20" />
                </div>
                <p>Select a conversation to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] bg-opacity-50">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {isGroupChat ? (
                            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                                <Users size={18} />
                            </div>
                        ) : (
                            <img
                                src={otherUser?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                alt={otherUser?.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}
                        {/* Online status indicator can be added here if we have real-time online status */}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">
                            {isGroupChat ? groupTitle : (otherUser?.name || 'Chat')}
                        </h3>
                        <span className={`text-xs font-medium ${connectionStatus === 'connected'
                            ? 'text-green-600'
                            : 'text-amber-600'
                            }`}>
                            {connectionStatus === 'connected'
                                ? (isGroupChat ? `${participantCount} members` : 'Online')
                                : 'Connecting...'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                    <button className="hover:text-gray-600 transition-colors"><Phone size={20} /></button>
                    <button className="hover:text-gray-600 transition-colors"><Video size={20} /></button>
                    <button className="hover:text-gray-600 transition-colors"><MoreVertical size={20} /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                {messages && messages.map((msg) => (
                    <MessageBubble
                        key={msg._id || msg.id}
                        {...msg}
                        isMe={msg.sender._id === (currentUser.id || currentUser._id)}
                        avatar={
                            (msg.sender._id === (currentUser.id || currentUser._id))
                                ? (currentUser.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
                                : (msg.sender.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
                        }
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-200">
                <form onSubmit={handleSend} className="flex items-center gap-3 max-w-4xl mx-auto">
                    <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Paperclip size={20} />
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={connectionStatus === 'connected' ? "Type a message..." : "Connecting to chat server..."}
                        disabled={connectionStatus !== 'connected'}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                    />

                    <button
                        type="submit"
                        disabled={!newMessage.trim() || connectionStatus !== 'connected'}
                        className={`p-3 rounded-full transition-all ${newMessage.trim() && connectionStatus === 'connected'
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
