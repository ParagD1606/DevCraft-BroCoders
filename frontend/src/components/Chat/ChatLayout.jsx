import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatLayout = () => {
    const [activeConversationId, setActiveConversationId] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const currentUser = {
        id: 'me',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    };

    const conversations = [
        {
            id: 1,
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            lastMessage: 'Hey! Are we still on for the meeting tomorrow?',
            lastMessageTime: '10:30 AM',
            unread: 2,
            online: true,
            messages: [
                { id: 1, text: 'Hi Alex, how is the project coming along?', sender: 'Sarah Chen', timestamp: '10:00 AM', isMe: false },
                { id: 2, text: 'Making good progress! Just finishing up the dashboard.', sender: 'Me', timestamp: '10:15 AM', isMe: true },
                { id: 3, text: 'That sounds great! Can we review it tomorrow?', sender: 'Sarah Chen', timestamp: '10:25 AM', isMe: false },
                { id: 4, text: 'Hey! Are we still on for the meeting tomorrow?', sender: 'Sarah Chen', timestamp: '10:30 AM', isMe: false },
            ]
        },
        {
            id: 2,
            name: 'EcoTrack Team',
            avatar: 'https://ui-avatars.com/api/?name=Eco+Track&background=0D8ABC&color=fff',
            lastMessage: 'Mike: I just pushed the latest changes to main.',
            lastMessageTime: 'Yesterday',
            unread: 0,
            online: false,
            messages: [
                { id: 1, text: 'Welcome to the team everyone!', sender: 'Sarah Chen', timestamp: 'Yesterday', isMe: false },
                { id: 2, text: 'Excited to be here!', sender: 'Me', timestamp: 'Yesterday', isMe: true },
                { id: 3, text: 'I just pushed the latest changes to main.', sender: 'Mike Ross', timestamp: 'Yesterday', isMe: false },
            ]
        },
        {
            id: 3,
            name: 'Jessica Lee',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
            lastMessage: 'Thanks for the feedback!',
            lastMessageTime: 'Mon',
            unread: 0,
            online: true,
            messages: [
                { id: 1, text: 'Here are the design mockups needed for the landing page.', sender: 'Jessica Lee', timestamp: 'Mon', isMe: false },
                { id: 2, text: 'Looks clean! I like the color palette.', sender: 'Me', timestamp: 'Mon', isMe: true },
                { id: 3, text: 'Thanks for the feedback!', sender: 'Jessica Lee', timestamp: 'Mon', isMe: false },
            ]
        }
    ];

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ChatSidebar
                conversations={conversations}
                activeId={activeConversationId}
                onSelect={(conv) => setActiveConversationId(conv.id)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <ChatWindow
                activeConversation={activeConversation}
                currentUser={currentUser}
            />
        </div>
    );
};

export default ChatLayout;
