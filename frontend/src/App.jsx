import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Auth from './components/Auth';
import OAuthCallback from './components/OAuthCallback';
import Onboarding from './components/Onboarding/Onboarding';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import Profile from './components/Profile/Profile';
import CreateProject from './components/CreateProject/CreateProject';
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import FindTeammates from './components/FindTeammates/FindTeammates';
import MyProjects from './components/MyProjects/MyProjects';
import ChatLayout from './components/Chat/ChatLayout';
import MatchInsights from './components/MatchInsights/MatchInsights';
import NotificationsPage from './components/Notifications/NotificationsPage';
import './App.css';

function ScrollToAnchor() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]);

  return null;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToAnchor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
          path="/create-project"
          element={
            <DashboardLayout>
              <CreateProject />
            </DashboardLayout>
          }
        />
        <Route
          path="/project/:id"
          element={
            <DashboardLayout>
              <ProjectDetails />
            </DashboardLayout>
          }
        />
        <Route
          path="/find-teammates"
          element={
            <DashboardLayout>
              <FindTeammates />
            </DashboardLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <DashboardLayout>
              <MyProjects />
            </DashboardLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <DashboardLayout>
              <ChatLayout />
            </DashboardLayout>
          }
        />
        <Route
          path="/insights"
          element={
            <DashboardLayout>
              <MatchInsights />
            </DashboardLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <NotificationsPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
