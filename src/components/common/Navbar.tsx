import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, Volume2, Globe, Shield, User, ChevronDown, Calendar, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { playSoundboxChime } from '../../utils/soundbox';
import { formatDate } from '../../utils/dueEngine';
import { SettingsModal } from '../owner/SettingsModal';

interface NavbarProps {
  onOpenAddHostel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddHostel }) => {
  const { hostels, activeHostelId, switchHostel, beds, currentSimulatedDate, advanceDateByDays, setSimulatedDate } = useHostel();
  const { language, setLanguage, t } = useLanguage();
  const { role, loginAsOwner, loginAsStudent, currentStudentId } = useAuth();
  const [hostelDropdownOpen, setHostelDropdownOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeHostel = hostels.find(h => h.id === activeHostelId) || hostels[0];
  const activeBeds = beds.filter(b => b.hostelId === activeHostelId);
  const occupiedCount = activeBeds.filter(b => b.isOccupied).length;
  const vacantCount = activeBeds.length - occupiedCount;

  const handleTestSoundbox = () => {
    playSoundboxChime(7200, 'M. Sai Kiran');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
            
            {/* Left: Brand & Multi-Hostel Switcher */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md font-black text-xl tracking-tight">
                  H
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight m-0">
                      Hostel OS
                    </h1>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {t('locationCyberabad')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {t('appTagline')}
                  </p>
                </div>
              </div>

              {/* Mobile Soundbox & Settings */}
              <div className="flex items-center gap-1.5 md:hidden">
                <button
                  onClick={handleTestSoundbox}
                  title={t('soundboxPreferences')}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  title={t('settings')}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle: Active Hostel Selector Pill (5 Hostels Switcher) */}
            <div className="relative">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                <button
                  onClick={() => setHostelDropdownOpen(!hostelDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-xs text-left hover:bg-slate-50 transition-all text-slate-800 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 truncate max-w-[170px] sm:max-w-[220px]">
                        {activeHostel.name}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="text-emerald-700 font-bold">{vacantCount} {t('vacantCountText')}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold">{occupiedCount} {t('occupiedCountText')}</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onOpenAddHostel}
                  title={t('addHostel')}
                  className="px-2.5 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 border border-blue-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('newHostel')}</span>
                </button>
              </div>

              {/* Dropdown Menu for 5 Hostels */}
              {hostelDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setHostelDropdownOpen(false)}
                >
                  <div className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    {t('yourBranches')} ({hostels.length})
                  </div>
                  {hostels.map(h => {
                    const isSelected = h.id === activeHostelId;
                    const hostelBeds = beds.filter(b => b.hostelId === h.id);
                    const occ = hostelBeds.filter(b => b.isOccupied).length;
                    const vac = hostelBeds.length - occ;
                    return (
                      <button
                        key={h.id}
                        onClick={() => switchHostel(h.id)}
                        className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{h.name}</div>
                          <div className="text-[11px] text-slate-500">{h.area} • {h.address.split(',')[1] || h.address}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {vac} {t('vacantCountText')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={onOpenAddHostel}
                      className="w-full text-center py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('addBranch')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Date Simulator, Language Switcher, Soundbox Demo, Settings Gear & Two-Login System */}
            <div className="flex items-center flex-wrap gap-2">
              
              {/* Date Simulator Pill for Testing Anniversary Due Cycles */}
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => advanceDateByDays(-1)}
                  title={t('prevDay')}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  title={t('dateSimulator')}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg shadow-xs font-bold text-slate-800 hover:text-blue-600 text-xs cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formatDate(currentSimulatedDate, language)}</span>
                </button>

                <button
                  onClick={() => advanceDateByDays(1)}
                  title={t('nextDay')}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full mt-1 bg-white p-2 rounded-xl shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2">
                    <input
                      type="date"
                      value={currentSimulatedDate}
                      onChange={e => {
                        if (e.target.value) {
                          setSimulatedDate(e.target.value);
                          setShowDatePicker(false);
                        }
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                    <button
                      onClick={() => {
                        setSimulatedDate('2026-09-20');
                        setShowDatePicker(false);
                      }}
                      className="block w-full mt-1 text-center text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      {t('resetDate')}
                    </button>
                  </div>
                )}
              </div>

              {/* Trilingual Quick Switcher in Navbar */}
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <span className="px-1.5 text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                </span>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    language === 'te'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  తెలుగు
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Soundbox Demo Button */}
              <button
                onClick={handleTestSoundbox}
                title={t('testSoundboxBtn')}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>{t('soundboxPreferences')}</span>
              </button>

              {/* Settings / Gear Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                title={t('settings')}
                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Two-Login System Switcher */}
              <div className="inline-flex items-center bg-slate-900 p-1 rounded-xl shadow-inner">
                <button
                  onClick={loginAsOwner}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === 'OWNER'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('ownerOS')}</span>
                </button>
                <button
                  onClick={() => loginAsStudent(currentStudentId || 'tenant-1')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === 'STUDENT'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('studentPortal')}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
