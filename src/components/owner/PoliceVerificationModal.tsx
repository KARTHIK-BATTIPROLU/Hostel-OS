import React from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/dueEngine';
import { X, Printer, Shield, CheckCircle } from 'lucide-react';

interface PoliceVerificationModalProps {
  tenantId: string;
  onClose: () => void;
}

export const PoliceVerificationModal: React.FC<PoliceVerificationModalProps> = ({
  tenantId,
  onClose
}) => {
  const { getTenantById, getRoomById, getBedById, activeHostel } = useHostel();
  const { language, t } = useLanguage();

  const tenant = getTenantById(tenantId);
  const room = tenant ? getRoomById(tenant.roomId) : undefined;
  const bed = tenant ? getBedById(tenant.bedId) : undefined;

  if (!tenant) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-w-none print:w-full print:m-0 print:p-0">
        
        {/* Header (hidden in print) */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-4 sm:p-5 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white m-0">
                {t('cyberabadPoliceVerification')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('policeSheetSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printPdf')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable HawkEye Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white" id="police-verification-sheet">
          
          {/* Top Police Banner */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-extrabold text-xs uppercase tracking-widest border border-blue-200 mb-2">
              Cyberabad Police Commissionerate • HawkEye PG Verification
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
              TENANT / INMATE POLICE VERIFICATION RECORD
            </h2>
            <div className="text-xs font-bold text-slate-600 mt-1">
              Jurisdiction: <span className="text-slate-900 font-black">{activeHostel.policeStationJurisdiction}</span>
            </div>
          </div>

          {/* Landlord & Property Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 block uppercase text-[10px]">Hostel / PG Name:</span>
              <span className="font-black text-slate-900 text-sm block">{activeHostel.name}</span>
              <span className="text-slate-600 block mt-0.5">{activeHostel.address}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block uppercase text-[10px]">Owner / Manager Phone:</span>
              <span className="font-black text-slate-900 text-sm block">+91 {activeHostel.ownerPhone}</span>
              <span className="font-bold text-slate-500 block uppercase text-[10px] mt-1">Allocated Space:</span>
              <span className="font-black text-blue-800">{t('room')} {room?.roomNumber}, {t('bed')} {bed?.bedLabel} ({t('floor')} {room?.floorNumber})</span>
            </div>
          </div>

          {/* Tenant Details with Photo */}
          <div className="flex flex-col sm:flex-row gap-6 items-start border border-slate-200 rounded-xl p-4 bg-white">
            <img
              src={tenant.photoUrl}
              alt={tenant.fullName}
              className="w-28 h-32 rounded-xl object-cover border-2 border-slate-900 shadow-sm shrink-0 mx-auto sm:mx-0"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs w-full">
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Full Name:</span>
                <span className="font-black text-slate-900 text-sm">{tenant.fullName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Mobile Contact:</span>
                <span className="font-black text-slate-900 text-sm">+91 {tenant.phone}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Date of Joining:</span>
                <span className="font-bold text-slate-800">{formatDate(tenant.joiningDate, language)}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Emergency / Parent Contact:</span>
                <span className="font-bold text-slate-800">+91 {tenant.emergencyPhone}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Company / Institution:</span>
                <span className="font-bold text-slate-800">{tenant.collegeOrCompany || 'Information Technology / Student'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Native Place (Permanent Address):</span>
                <span className="font-bold text-slate-800">{tenant.homeTown || 'Telangana, India'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Aadhaar Number:</span>
                <span className="font-black text-blue-900 tracking-wider text-sm">{tenant.aadhaarNumber}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block uppercase text-[10px]">Blood Group:</span>
                <span className="font-bold text-slate-800">{tenant.bloodGroup || 'O+'}</span>
              </div>
            </div>
          </div>

          {/* Aadhaar Photo Cards */}
          <div>
            <span className="font-black text-xs uppercase tracking-wider text-slate-700 mb-2 block">
              Government Identity Proof (Aadhaar Card Copy):
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-300 rounded-xl p-2 text-center bg-slate-50">
                <img
                  src={tenant.aadhaarFrontUrl}
                  alt="Aadhaar Front"
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <span className="text-[10px] font-bold text-slate-600 mt-1 block">Aadhaar Card - Front Side</span>
              </div>
              <div className="border border-slate-300 rounded-xl p-2 text-center bg-slate-50">
                <img
                  src={tenant.aadhaarBackUrl}
                  alt="Aadhaar Back"
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <span className="text-[10px] font-bold text-slate-600 mt-1 block">Aadhaar Card - Back Side</span>
              </div>
            </div>
          </div>

          {/* Declaration Statement & Signature */}
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-4">
            <p className="italic text-[11px] leading-relaxed">
              Declaration: I hereby declare that the tenant identity and particulars furnished above have been physically verified against the original Government Aadhaar card and entered into the Hostel OS record in compliance with Cyberabad Police HawkEye guidelines.
            </p>
            <div className="flex justify-between items-end pt-6">
              <div className="text-center">
                <div className="w-36 border-b border-slate-900 mb-1"></div>
                <span className="text-[10px] font-bold uppercase text-slate-600">Tenant Signature</span>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-1 text-emerald-700 font-black text-[11px] mb-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified on Hostel OS
                </div>
                <div className="w-44 border-b border-slate-900 mb-1"></div>
                <span className="text-[10px] font-bold uppercase text-slate-600">Hostel Owner / Manager Stamp</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
