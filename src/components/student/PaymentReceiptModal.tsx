import React from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, formatLocalizedMonth } from '../../utils/dueEngine';
import { X, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import type { PaymentRecord, Tenant } from '../../types/hostel';

interface PaymentReceiptModalProps {
  payment: PaymentRecord;
  tenant: Tenant;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  tenant,
  onClose
}) => {
  const { hostels, rooms, beds } = useHostel();
  const { language, t } = useLanguage();

  const hostel = hostels.find(h => h.id === payment.hostelId) || hostels[0];
  const room = rooms.find(r => r.id === tenant.roomId);
  const bed = beds.find(b => b.id === tenant.bedId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-w-none print:w-full print:m-0 print:p-0">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white m-0">
              {t('officialReceipt')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('printPdf')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 space-y-4 text-slate-900 bg-white" id="rent-receipt">
          
          {/* Top Brand & Seal */}
          <div className="text-center border-b pb-3 border-slate-200">
            <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
              {hostel.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {hostel.address}
            </p>
            <p className="text-xs text-slate-500">
              {t('phoneLabel')}: +91 {hostel.ownerPhone}
            </p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-300">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{t('digitallyVerifiedReceipt')}</span>
            </div>
          </div>

          {/* Key Receipt Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('receiptNo')}</span>
              <span className="font-black text-slate-900">{payment.transactionRef}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('dateTime')}</span>
              <span className="font-bold text-slate-800">{payment.timestamp}</span>
            </div>
          </div>

          {/* Tenant Details */}
          <div className="space-y-1 text-xs border-b pb-3 border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">{t('studentName')}:</span>
              <span className="font-black text-slate-900">{tenant.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">{t('phoneNumber')}:</span>
              <span className="font-bold text-slate-800">{tenant.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">{t('allocatedSpace')}</span>
              <span className="font-black text-blue-900">{t('room')} {room?.roomNumber}, {t('bed')} {bed?.bedLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">{t('particulars')}</span>
              <span className="font-bold text-slate-800">
                {payment.description.includes('Rent')
                  ? `${formatLocalizedMonth(payment.description.split(' Rent')[0], language)} ${t('agreedRent')}`
                  : payment.description}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">{t('paymentMode')}</span>
              <span className="font-bold text-emerald-700">
                {payment.paymentMethod === 'PHONEPE_SOUNDBOX' ? t('methodSoundbox') : payment.paymentMethod === 'CASH' ? t('methodCash') : t('methodUpi')}
              </span>
            </div>
          </div>

          {/* Total Amount Box */}
          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-300 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                {t('amountPaid')}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {t('noDuesCycle')}
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-800">
              {formatINR(payment.amount)}
            </div>
          </div>

          {/* QR Code & Verification Seal */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-slate-100 rounded-lg p-1 border border-slate-300 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <span className="font-bold text-slate-800 block">{t('qrVerificationTitle')}</span>
                {t('qrVerify')}
              </div>
            </div>

            <div className="text-right">
              <div className="w-24 border-b border-slate-900 mb-1"></div>
              <span className="text-[9px] font-bold uppercase text-slate-600">{t('authorizedSign')}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
