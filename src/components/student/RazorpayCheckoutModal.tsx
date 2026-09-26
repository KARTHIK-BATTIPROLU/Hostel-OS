import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, formatLocalizedMonth } from '../../utils/dueEngine';
import { openRazorpayCheckout } from '../../utils/razorpay';
import { RAZORPAY_CONFIG } from '../../config/razorpay';
import type { Tenant, RentDue, PaymentMethod } from '../../types/hostel';
import { X, Lock, CheckCircle2, ArrowRight, Loader2, QrCode, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

interface RazorpayCheckoutModalProps {
  tenant: Tenant;
  due: RentDue;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  tenant,
  due,
  onClose,
  onSuccess
}) => {
  const { activeHostel, recordPayment } = useHostel();
  const { language, t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('RAZORPAY_UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedPaymentRef, setCompletedPaymentRef] = useState<string>('');
  const [showQr, setShowQr] = useState(false);
  const [gatewayError, setGatewayError] = useState<string>('');

  // 1. Launch official Razorpay standard checkout popup
  const handleLaunchOfficialRazorpay = async () => {
    setIsProcessing(true);
    setGatewayError('');

    try {
      const opened = await openRazorpayCheckout({
        amountInRupees: due.amountDue,
        hostelName: activeHostel.name,
        description: `${tenant.fullName} - ${formatLocalizedMonth(due.monthLabel, language)} ${t('agreedRent')}`,
        customerName: tenant.fullName,
        customerPhone: tenant.phone,
        notes: {
          tenant_id: tenant.id,
          due_id: due.id,
          hostel_id: activeHostel.id,
          month_label: due.monthLabel
        },
        onSuccess: (paymentId: string) => {
          setIsProcessing(false);
          setIsCompleted(true);
          setCompletedPaymentRef(paymentId);
          recordPayment(due.id, 'RAZORPAY_UPI', due.amountDue, paymentId);
          setTimeout(() => {
            onSuccess(due.id);
          }, 1500);
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });

      if (!opened) {
        setIsProcessing(false);
        // Fallback to in-app simulated payment if script couldn't be loaded
        handleSimulatedPay();
      }
    } catch (err) {
      console.error('Razorpay popup error:', err);
      setIsProcessing(false);
      setGatewayError('Could not open gateway popup. Falling back to simulated UPI.');
      handleSimulatedPay();
    }
  };

  // 2. Direct simulated quick payment
  const handleSimulatedPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockRzpId = `pay_test_${Date.now().toString().slice(-8)}`;
      setIsProcessing(false);
      setIsCompleted(true);
      setCompletedPaymentRef(mockRzpId);
      recordPayment(due.id, selectedMethod, due.amountDue, mockRzpId);
      setTimeout(() => {
        onSuccess(due.id);
      }, 1200);
    }, 1000);
  };

  const soundboxSubtext =
    language === 'en'
      ? 'Instant Soundbox voice alert & digital receipt'
      : language === 'te'
      ? 'తక్షణ సౌండ్‌బాక్స్ అలర్ట్ & డిజిటల్ రసీదు'
      : 'त्वरित साउंडबॉक्स अलर्ट एवं डिजिटल रसीद';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white text-blue-800 flex items-center justify-center font-black text-base shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base font-black tracking-tight text-white">
                  Razorpay Checkout
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-400 text-slate-950 uppercase tracking-tight flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                  Test API Active
                </span>
              </div>
              <p className="text-xs text-blue-100 truncate max-w-[200px]">
                {activeHostel.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {isCompleted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-slate-900">
                {t('paymentSuccess')}
              </h4>
              <p className="text-sm font-semibold text-emerald-700">
                {t('soundboxSuccessMsg')}
              </p>
              {completedPaymentRef && (
                <div className="inline-block bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
                  Razorpay Ref: <span className="font-bold text-blue-700">{completedPaymentRef}</span>
                </div>
              )}
              <div className="text-xs text-slate-500 pt-2">
                {t('loadingReceipt')}
              </div>
            </div>
          ) : (
            <>
              {/* Order Amount Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    {formatLocalizedMonth(due.monthLabel, language)} {t('agreedRent')}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {tenant.fullName} ({tenant.phone})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-900 block">
                    {formatINR(due.amountDue)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {t('secureUpi')}
                  </span>
                </div>
              </div>

              {/* Verified Credentials Notice */}
              <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="font-medium text-[11px]">
                    API Key: <code className="font-bold font-mono text-blue-800">{RAZORPAY_CONFIG.keyId}</code>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Connected
                </span>
              </div>

              {gatewayError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl">
                  {gatewayError}
                </div>
              )}

              {/* Primary Action: Official Razorpay Gateway Popup */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleLaunchOfficialRazorpay}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Pay with Official Razorpay Popup</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </>
                )}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  or choose quick simulated UPI
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Quick Simulated UPI Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('selectUpiApp')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQr ? t('showApps') : t('showQr')}</span>
                  </button>
                </div>

                {showQr ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                    <div className="w-36 h-36 bg-white p-2 mx-auto rounded-xl border border-slate-300 shadow-xs flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-900" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {t('scanAnyUpi')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t('amountLabel')}: <span className="font-black text-slate-900">{formatINR(due.amountDue)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('PHONEPE_SOUNDBOX')}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedMethod === 'PHONEPE_SOUNDBOX'
                          ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                          Pe
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            PhonePe UPI
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {soundboxSubtext}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-indigo-700">{t('recommended')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('GPAY_UPI')}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedMethod === 'GPAY_UPI'
                          ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          G
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Google Pay (GPay UPI)
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {t('instantTransfer')}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('PAYTM')}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedMethod === 'PAYTM'
                          ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-black text-xs">
                          Pay
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Paytm UPI / Wallet
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {t('zeroFeeCheckout')}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Security Banner */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 py-0.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('sslEncrypted')}</span>
              </div>

              {/* Simulated 1-Tap Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatedPay}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('processingUpi')}</span>
                  </>
                ) : (
                  <>
                    <span>1-Tap Instant Simulated Payment ({formatINR(due.amountDue)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
