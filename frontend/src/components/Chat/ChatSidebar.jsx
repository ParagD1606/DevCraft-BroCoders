import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const ChatSidebar = ({ conversations, activeId, onSelect, searchQuery, setSearchQuery, user, accessChat }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${API_BASE_URL}/api/user?search=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setSearchResults(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load the search results", error);
            setLoading(false);
        }
    };

    const getSender = (loggedUser, participants) => {
        if (!Array.isArray(participants) || participants.length === 0) return null;
        if (participants.length === 1) return participants[0];
        const loggedUserId = loggedUser?._id || loggedUser?.id;
        return participants[0]?._id === loggedUserId ? participants[1] : participants[0];
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full md:w-80">
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {searchQuery ? (
                    // render search results
                    searchResults.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => accessChat(user._id)}
                            className="p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50"
                        >
                            <img
                                src={user.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                            />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    // render conversations
                    conversations.map((chat) => {
                        const currentUserId = user?._id || user?.id;
                        const isGroupChat = Boolean(chat?.isGroupChat || chat?.project);
                        const sender = getSender(user, chat.participants);
                        const chatTitle = isGroupChat
                            ? (chat?.chatName || chat?.project?.title || 'Project Group')
                            : (sender?.name || 'Direct Chat');
                        const lastMessageSenderId = chat?.lastMessage?.sender?._id || chat?.lastMessage?.sender?.id;
                        const lastMessageSenderName = chat?.lastMessage?.sender?.name || '';
                        const previewPrefix = lastMessageSenderName
                            ? (String(lastMessageSenderId) === String(currentUserId)
                                ? 'You: '
                                : `${lastMessageSenderName}: `)
                            : '';
                        return (
                            <div
                                key={chat._id}
                                onClick={() => onSelect(chat)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50 ${activeId === chat._id ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    {isGroupChat ? (
                                        <div className="w-12 h-12 rounded-full border border-blue-200 bg-blue-50 text-blue-700 flex items-center justify-center">
                                            <Users size={18} />
                                        </div>
                                    ) : (
                                        <img
                                            src={sender?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                            alt={sender?.name || 'User'}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                        />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className={`text-sm font-semibold truncate ${activeId === chat._id ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {chatTitle}
                                        </h3>
                                    </div>
                                    {chat.lastMessage && (
                                        <p className="text-xs text-gray-500 truncate">
                                            <span className="font-bold">{previewPrefix}</span>
                                            {chat.lastMessage?.content || ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                {loading && <div className="p-4 text-center text-gray-500">Loading...</div>}
            </div>
        </div>
    );
};

export default ChatSidebar;
