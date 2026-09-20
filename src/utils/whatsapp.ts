import type { Language } from '../types/language';
import { formatINR } from './dueEngine';

export interface WhatsAppReminderParams {
  studentName: string;
  studentPhone: string;
  hostelName: string;
  roomNumber: string;
  bedLabel: string;
  dueAmount: number;
  dueDate: string;
  language: Language;
  paymentUrl?: string;
}

export function generateWhatsAppReminderUrl({
  studentName,
  studentPhone,
  hostelName,
  roomNumber,
  bedLabel,
  dueAmount,
  dueDate,
  language,
  paymentUrl
}: WhatsAppReminderParams): string {
  // Strip non-digits from phone
  const cleanPhone = studentPhone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hostel-os.com';
  const payLink = paymentUrl || `${origin}?student=${encodeURIComponent(studentPhone)}&action=pay`;

  let message = '';

  if (language === 'te') {
    message = `నమస్కారం ${studentName} గారు,
ఇది *${hostelName}* (రూమ్ ${roomNumber}, బెడ్ ${bedLabel}) నుండి అద్దె రిమైండర్.

ఈ నెలకు మీరు చెల్లించాల్సిన రెంట్: *${formatINR(dueAmount)}*
గడువు తేదీ: *${dueDate}*

దయచేసి క్రింది లింక్ పై క్లిక్ చేసి PhonePe లేదా GPay ద్వారా వెంటనే చెల్లించండి:
👉 ${payLink}

ఏదైనా సందేహం ఉంటే హాస్టల్ ఓనర్‌ను సంప్రదించండి. ధన్యవాదాలు!`;
  } else if (language === 'hi') {
    message = `नमस्ते ${studentName} जी,
यह *${hostelName}* (कमरा ${roomNumber}, बेड ${bedLabel}) से किराया रिमाइंडर है।

इस महीने का देय किराया: *${formatINR(dueAmount)}*
अंतिम तिथि: *${dueDate}*

कृपया नीचे दिए गए लिंक पर क्लिक करके PhonePe या GPay से भुगतान करें:
👉 ${payLink}

धन्यवाद!`;
  } else {
    message = `Hello ${studentName},
This is a gentle rent reminder from *${hostelName}* (Room ${roomNumber}, Bed ${bedLabel}).

Amount Due: *${formatINR(dueAmount)}*
Due Date: *${dueDate}*

You can securely pay via PhonePe/GPay UPI directly through this link:
👉 ${payLink}

Thank you!`;
  }

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
