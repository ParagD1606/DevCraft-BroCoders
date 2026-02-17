import React from 'react';
import { Search } from 'lucide-react';

const ChatSidebar = ({ conversations, activeId, onSelect, searchQuery, setSearchQuery }) => {
    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full md:w-80">
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conv => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50 ${activeId === conv.id ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'
                            }`}
                    >
                        <div className="relative">
                            <img
                                src={conv.avatar}
                                alt={conv.name}
                                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                            />
                            {conv.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className={`text-sm font-semibold truncate ${activeId === conv.id ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {conv.name}
                                </h3>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{conv.lastMessageTime}</span>
                            </div>
                            <p className={`text-xs truncate ${conv.unread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                {conv.lastMessage}
                            </p>
                        </div>

                        {conv.unread > 0 && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                {conv.unread}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;
