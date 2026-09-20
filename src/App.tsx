import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { HostelProvider } from './context/HostelContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { StudentPortal } from './components/student/StudentPortal';

const AppContent: React.FC = () => {
  const { role } = useAuth();
  const { t } = useLanguage();
  const [isAddHostelOpen, setIsAddHostelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenAddHostel={() => setIsAddHostelOpen(true)} />

      {/* Main Container */}
      <main className="flex-1">
        {role === 'OWNER' ? (
          <OwnerDashboard
            isAddHostelOpen={isAddHostelOpen}
            setIsAddHostelOpen={setIsAddHostelOpen}
          />
        ) : (
          <StudentPortal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
            <span>Hostel OS</span>
            <span>•</span>
            <span className="text-blue-700">{t('locationCyberabad')}</span>
            <span>•</span>
            <span>Kokapet • Gandipet • Financial District • Gachibowli</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t('appFooterTagline')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HostelProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HostelProvider>
    </LanguageProvider>
  );
};

export default App;
