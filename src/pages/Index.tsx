
import { useState } from "react";
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import HomePage from '@/components/HomePage';
import ProfilePage from '@/components/ProfilePage';
import ScanPage from '@/components/ScanPage';
import CoachPage from '@/components/CoachPage';
import ReportsPage from '@/components/ReportsPage';
import AuthPage from '@/components/AuthPage';
import SweatAnalysis from '@/components/SweatAnalysis';
import EducationPage from '@/components/EducationPage';
import BuyKitPage from '@/components/BuyKitPage';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 gradient-rose rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white rounded-2xl opacity-90"></div>
          </div>
          <h2 className="text-2xl font-black text-purple-600 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 mb-2" style={{ WebkitTextFillColor: 'transparent' }}>GYNORA</h2>
          <p className="text-gray-600">Loading your wellness companion...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl p-2.5 border border-purple-50">
            <img 
              src="/images/logo.png" 
              alt="GYNORA Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">Welcome to <br/> GYNORA</h1>
          <p className="text-slate-700 mb-10 text-sm font-bold uppercase tracking-widest leading-relaxed">
            Your Advanced PCOS <br/> Wellness Companion
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="w-full h-14 gradient-wellness text-white shadow-lg border-0 text-lg font-medium rounded-2xl transition-all duration-200 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage />;
      case 'scan':
        return <ScanPage />;
      case 'coach':
        return <CoachPage />;
      case 'reports':
        return <ReportsPage />;
      case 'sweat-analysis':
        return <SweatAnalysis />;
      case 'education':
        return <EducationPage onNavigate={setCurrentPage} />;
      case 'buy-kit':
        return <BuyKitPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
