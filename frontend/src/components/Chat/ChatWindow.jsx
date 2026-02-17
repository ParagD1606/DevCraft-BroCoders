import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ activeConversation, currentUser }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(activeConversation?.messages || []);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(activeConversation?.messages || []);
        scrollToBottom();
    }, [activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now(),
            text: newMessage,
            sender: 'You',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

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
                        <img
                            src={activeConversation.avatar}
                            alt={activeConversation.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {activeConversation.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{activeConversation.name}</h3>
                        <span className="text-xs text-green-600 font-medium">
                            {activeConversation.online ? 'Online' : 'Offline'}
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
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        {...msg}
                        avatar={msg.isMe ? currentUser.avatar : activeConversation.avatar}
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
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                    />

                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-full transition-all ${newMessage.trim()
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
