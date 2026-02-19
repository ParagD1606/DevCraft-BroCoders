import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import VirtualCTOChatWidget from '../CreateProject/VirtualCTOChatWidget';
import { API_BASE_URL } from '../../config/api';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkOnboarding = () => {
            try {
                const userStr = localStorage.getItem('authUser');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    // Check if onboarding is NOT completed
                    if (user && !user.onboardingCompleted) {
                        navigate('/onboarding');
                    }
                }
            } catch (error) {
                console.error("Error parsing user data", error);
            }
        };

        checkOnboarding();
    }, [navigate]);

    const architectProjectIdeaFromAnywhere = async (idea) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('You need to be logged in to use Virtual CTO');
        }

        const planResponse = await fetch(`${API_BASE_URL}/api/project/virtual-cto/plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ idea }),
        });

        const planData = await planResponse.json();
        if (!planResponse.ok) {
            throw new Error(planData.error || 'Failed to generate project blueprint');
        }

        let teammates = [];
        try {
            const teammateResponse = await fetch(`${API_BASE_URL}/api/user/search-semantic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ queryText: idea }),
            });
            const teammateData = await teammateResponse.json();
            if (teammateResponse.ok) {
                teammates = Array.isArray(teammateData.results) ? teammateData.results.slice(0, 6) : [];
            }
        } catch (_searchError) {
            teammates = [];
        }

        return {
            plan: planData.plan || null,
            teammates,
            applied: false,
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 lg:p-8 2xl:p-10 overflow-y-auto">
                    {children}
                </main>
            </div>

            {location.pathname !== '/create-project' ? (
                <VirtualCTOChatWidget onArchitectIdea={architectProjectIdeaFromAnywhere} />
            ) : null}
        </div>
    );
};

export default DashboardLayout;
