import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
