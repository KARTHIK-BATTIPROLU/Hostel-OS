import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHostel } from '../../context/HostelContext';
import { playSoundboxChime } from '../../utils/soundbox';
import { RAZORPAY_CONFIG } from '../../config/razorpay';
import { openRazorpayCheckout } from '../../utils/razorpay';
import type { Language } from '../../types/language';
import {
  X,
  Settings,
  Globe,
  Volume2,
  Building2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Smartphone,
  CreditCard,
  ExternalLink
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const { hostels, activeHostelId, beds, rooms } = useHostel();
  const [isTestingGateway, setIsTestingGateway] = useState(false);
  const [testGatewayMsg, setTestGatewayMsg] = useState('');

  if (!isOpen) return null;

  const activeHostel = hostels.find(h => h.id === activeHostelId) || hostels[0];
  const activeBeds = beds.filter(b => b.hostelId === activeHostelId);
  const activeRooms = rooms.filter(r => r.hostelId === activeHostelId);
  const occupiedCount = activeBeds.filter(b => b.isOccupied).length;
  const vacantCount = activeBeds.length - occupiedCount;

  const handleTestSoundbox = () => {
    playSoundboxChime(7200, 'M. Sai Kiran');
  };

  const handleTestRazorpayGateway = async () => {
    setIsTestingGateway(true);
    setTestGatewayMsg('');
    try {
      const opened = await openRazorpayCheckout({
        amountInRupees: 1,
        hostelName: `${activeHostel.name} (Gateway Test)`,
        description: 'Razorpay Test API Gateway Verification',
        customerName: 'Hostel Owner',
        customerPhone: activeHostel.ownerPhone,
        notes: {
          test_run: 'true',
          key_id: RAZORPAY_CONFIG.keyId
        },
        onSuccess: (paymentId) => {
          setIsTestingGateway(false);
          setTestGatewayMsg(`Payment captured! ID: ${paymentId}`);
          playSoundboxChime(1, 'Razorpay Test');
        },
        onDismiss: () => {
          setIsTestingGateway(false);
        }
      });
      if (!opened) {
        setIsTestingGateway(false);
        setTestGatewayMsg('Gateway script not available.');
      }
    } catch (e) {
      console.error(e);
      setIsTestingGateway(false);
      setTestGatewayMsg('Gateway popup could not be opened.');
    }
  };

  const languages: { code: Language; name: string; nativeName: string; flag: string; desc: string }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      desc: language === 'te'
        ? 'స్వచ్ఛమైన ఆంగ్ల భాష — బ్రాకెట్లు లేకుండా'
        : language === 'hi'
        ? 'पूर्णतः स्पष्ट अंग्रेज़ी भाषा — बिना किसी मिलावट के'
        : '100% Clean professional English with standard terms'
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు (Telugu)',
      flag: '🇮🇳',
      desc: language === 'te'
        ? 'సహజమైన తెలుగు — రెంట్, బెడ్స్, హాస్టల్, వాట్సాప్ వంటి సహజ పదాలతో'
        : language === 'hi'
        ? 'प्राकृतिक तेलुगु भाषा'
        : 'Authentic hostel Telugu using natural loanwords (Rent, Beds, Hostel)'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी (Hindi)',
      flag: '🇮🇳',
      desc: language === 'te'
        ? 'స్పష్టమైన సరళ హిందీ భాష'
        : language === 'hi'
        ? 'सरल एवं शुद्ध हिंदी — हॉस्टल प्रबंधन हेतु स्पष्ट शब्दावली'
        : 'Clean standard Hindi for hostel administration'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white m-0">
                {t('settings')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('settingsSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Language Switcher */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                {t('languageSelect')}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {languages.map(lang => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-base">{lang.flag}</span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('active')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {lang.code.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        {lang.nativeName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">
                        {lang.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              ℹ️ {t('languageActiveNote')}
            </div>
          </div>

          {/* Section 2: Soundbox Audio Preferences */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                {t('soundboxPreferences')}
              </h4>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-black text-emerald-950">
                    PhonePe SmartSound Gateway
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  {t('soundboxStatus')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestSoundbox}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t('testSoundboxBtn')}</span>
              </button>
            </div>
          </div>

          {/* Section 3: Active Branch Details */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                {t('activeBranchInfo')}
              </h4>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('hostelNameLabel').replace(' *', '')}:</span>
                <span className="font-black text-slate-900">{activeHostel.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('addressLabel')}:</span>
                <span className="font-bold text-slate-700">{activeHostel.address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('ownerPhoneLabel')}:</span>
                <span className="font-bold text-slate-800">+91 {activeHostel.ownerPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">{t('policeStationLabel')}:</span>
                <span className="font-black text-blue-900">{activeHostel.policeStationJurisdiction}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500">{t('inventory')}:</span>
                <span className="font-bold text-slate-800">
                  {activeRooms.length} {t('roomsCount')} • {activeBeds.length} {t('bedsLabel')} ({vacantCount} {t('vacantCountText')} / {occupiedCount} {t('occupiedCountText')})
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Razorpay Payment Gateway Test API */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                  Razorpay Payment Gateway (Test API)
                </h4>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Test Mode
              </span>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Key ID:</span>
                <code className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {RAZORPAY_CONFIG.keyId}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Key Secret:</span>
                <code className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  zxitHMR...RF0I (Configured)
                </code>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Supported Methods:</span>
                <span className="font-bold text-slate-700">UPI (PhonePe, GPay, Paytm) • Cards • NetBanking</span>
              </div>

              {testGatewayMsg && (
                <div className="bg-white p-2 rounded-lg border border-emerald-300 text-emerald-800 text-xs font-bold">
                  {testGatewayMsg}
                </div>
              )}

              <button
                type="button"
                disabled={isTestingGateway}
                onClick={handleTestRazorpayGateway}
                className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{isTestingGateway ? 'Connecting...' : 'Test Razorpay Gateway Popup (₹1)'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>

          {/* Section 5: System Compliance & Integrations */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 m-0">
                {t('systemCompliance')}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
                <div>
                  <div className="font-black text-purple-950">Cyberabad HawkEye</div>
                  <div className="text-[10px] text-purple-800">{t('verificationPortal')}</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <div className="font-black text-amber-950">Urjavi Smart Meter</div>
                  <div className="text-[10px] text-amber-800">{t('iotGateway')}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>{t('appVersionLabel')}: Hostel OS v1.2.0 (Cyberabad Pro Edition)</span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                {t('pwaReady')}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
};
