import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Room } from '../../types/hostel';
import { formatINR } from '../../utils/dueEngine';
import { X, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface UrjaviRechargeModalProps {
  room: Room;
  onClose: () => void;
}

export const UrjaviRechargeModal: React.FC<UrjaviRechargeModalProps> = ({ room, onClose }) => {
  const { rechargeUrjaviMeter } = useHostel();
  const { language, t } = useLanguage();

  const [amount, setAmount] = useState(500);
  const [isCustom, setIsCustom] = useState(false);
  const [success, setSuccess] = useState(false);

  const unitsToAdd = (amount / 7.0).toFixed(1);
  const isLow = room.urjaviBalanceUnits < 20;

  const handleRecharge = () => {
    if (amount <= 0) return;
    rechargeUrjaviMeter(room.id, amount);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleChipClick = (amt: number) => {
    setIsCustom(false);
    setAmount(amt);
  };

  const rechargeSuccessSub =
    language === 'en'
      ? `+${unitsToAdd} units added to Room ${room.roomNumber} meter.`
      : language === 'te'
      ? `రూమ్ ${room.roomNumber} మీటర్‌కు +${unitsToAdd} యూనిట్లు యాడ్ చేయబడ్డాయి.`
      : `कमरा ${room.roomNumber} मीटर में +${unitsToAdd} यूनिट जोड़ी गई हैं।`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-4 sm:p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-950/10">
              <Zap className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black m-0 text-slate-950">
                {t('urjaviMeter')}
              </h3>
              <p className="text-xs text-slate-800 font-medium">
                {t('room')} {room.roomNumber} • {t('meterIdLabel')} {room.urjaviMeterId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-slate-900">
                {t('rechargeSuccess')}
              </h4>
              <p className="text-xs text-slate-600">
                {rechargeSuccessSub}
              </p>
            </div>
          ) : (
            <>
              {/* Current Balance Card */}
              <div className={`p-4 rounded-xl border ${
                isLow ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">{t('currentBalance')}</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 block">
                      {room.urjaviBalanceUnits} kWh
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      ({formatINR(room.urjaviBalanceRupees)})
                    </span>
                  </div>
                </div>

                {isLow && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center gap-1.5 text-xs font-black text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t('lowBalanceWarning')}</span>
                  </div>
                )}
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t('selectRechargeAmount')}
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {[200, 500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleChipClick(amt)}
                      className={`py-2 px-1 rounded-xl text-center font-black transition-all border cursor-pointer ${
                        !isCustom && amount === amt
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs ring-2 ring-amber-300'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs">₹{amt}</div>
                      <div className="text-[9px] opacity-75 font-semibold">
                        ~{(amt / 7.0).toFixed(0)}u
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline mb-2 cursor-pointer block"
                >
                  {isCustom ? t('useQuickChips') : t('customAmountBtn')}
                </button>

                {isCustom && (
                  <div className="relative mb-2">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      step={50}
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-amber-300 text-sm font-bold bg-white text-amber-950"
                      placeholder={t('enterAmountPlaceholder')}
                    />
                  </div>
                )}
              </div>

              {/* Urjavi App official note */}
              <div className="text-[11px] text-slate-500 bg-slate-100 p-3 rounded-xl">
                {t('urjaviAppNote')}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleRecharge}
                className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>{t('rechargeBtn')} {formatINR(amount)} (+{unitsToAdd} {t('units')})</span>
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
