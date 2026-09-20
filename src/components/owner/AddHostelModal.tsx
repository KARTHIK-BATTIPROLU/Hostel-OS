import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Building2, Plus } from 'lucide-react';

interface AddHostelModalProps {
  onClose: () => void;
}

export const AddHostelModal: React.FC<AddHostelModalProps> = ({ onClose }) => {
  const { addHostel } = useHostel();
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [area, setArea] = useState('Kokapet');
  const [address, setAddress] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('9848022338');
  const [floorsCount, setFloorsCount] = useState(3);
  const [roomsPerFloor, setRoomsPerFloor] = useState(4);
  const [sharingType, setSharingType] = useState(2);
  const [defaultPrice, setDefaultPrice] = useState(8000);
  const [defaultDeposit, setDefaultDeposit] = useState(5000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(t('pleaseEnterHostelName'));
      return;
    }

    addHostel({
      name: name.trim(),
      area,
      address: address.trim() || `${area}, Hyderabad, Telangana - 500075`,
      ownerPhone: ownerPhone.trim(),
      floorsCount: Number(floorsCount),
      roomsPerFloor: Number(roomsPerFloor),
      sharingType: Number(sharingType),
      defaultPrice: Number(defaultPrice),
      defaultDeposit: Number(defaultDeposit)
    });

    onClose();
  };

  const handleTemplateSelect = (templateArea: string) => {
    setArea(templateArea);
    setName(`Sri Balaji Executive PG (${templateArea})`);
    setAddress(`Main Road, Near IT Hub, ${templateArea}, Hyderabad - 500075`);
  };

  const autoGenText =
    language === 'en'
      ? `${floorsCount * roomsPerFloor} rooms and ${floorsCount * roomsPerFloor * sharingType} beds will be automatically generated with Urjavi Meter IDs!`
      : language === 'te'
      ? `${floorsCount * roomsPerFloor} రూములు మరియు ${floorsCount * roomsPerFloor * sharingType} బెడ్స్ ఆటోమేటిక్‌గా ఉర్జవి మీటర్ IDలతో సృష్టించబడతాయి!`
      : `${floorsCount * roomsPerFloor} कमरे और ${floorsCount * roomsPerFloor * sharingType} बेड उर्जवी मीटर आईडी के साथ स्वतः बन जाएंगे!`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white m-0">
                {t('addHostel')}
              </h3>
              <p className="text-xs text-blue-100">
                {t('addHostelSubtitle')}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {/* Quick Area Templates */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('quickAreas')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Kokapet', 'Gandipet', 'Financial District', 'Gachibowli', 'Madhapur', 'Tellapur'].map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => handleTemplateSelect(a)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    area === a
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('hostelNameLabel')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Sri Balaji Grand PG (Kokapet)"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('addressLabel')}
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Road No 2, Main Landmark, Kokapet"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
            />
          </div>

          {/* Floors & Rooms Configuration */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('totalFloorsLabel')}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={floorsCount}
                onChange={e => setFloorsCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('roomsPerFloorLabel')}
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={roomsPerFloor}
                onChange={e => setRoomsPerFloor(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('sharingLabel')}
              </label>
              <select
                value={sharingType}
                onChange={e => setSharingType(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              >
                <option value={1}>1 - {t('singleRoom')}</option>
                <option value={2}>2 - {t('doubleSharing')}</option>
                <option value={3}>3 - {t('tripleSharing')}</option>
                <option value={4}>4 - {t('fourSharing')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('baseRentLabel')}
              </label>
              <input
                type="number"
                step={500}
                value={defaultPrice}
                onChange={e => setDefaultPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('ownerPhoneLabel')}
              </label>
              <input
                type="tel"
                value={ownerPhone}
                onChange={e => setOwnerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('securityDeposit')}:
              </label>
              <input
                type="number"
                step={500}
                value={defaultDeposit}
                onChange={e => setDefaultDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold bg-white text-sm"
              />
            </div>
          </div>

          {/* Auto-generation note */}
          <div className="text-[11px] text-slate-500 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
            ℹ️ <span className="font-bold text-blue-950">{autoGenText}</span>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createBranchBtn')}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
