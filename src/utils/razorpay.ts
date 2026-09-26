import { RAZORPAY_CONFIG } from '../config/razorpay';

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // amount in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayPaymentSuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Could not load Razorpay checkout script from CDN');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  amountInRupees,
  hostelName,
  description,
  customerName,
  customerPhone,
  customerEmail = 'student@hostelos.in',
  notes = {},
  onSuccess,
  onDismiss
}: {
  amountInRupees: number;
  hostelName: string;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: Record<string, string>;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}): Promise<boolean> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    return false;
  }

  const options: RazorpayOptions = {
    key: RAZORPAY_CONFIG.keyId,
    amount: Math.round(amountInRupees * 100),
    currency: RAZORPAY_CONFIG.currency,
    name: hostelName,
    description: description,
    image: '/favicon.svg',
    prefill: {
      name: customerName,
      contact: customerPhone,
      email: customerEmail
    },
    notes: {
      ...notes,
      platform: 'Hostel OS Hyderabad',
      key_id: RAZORPAY_CONFIG.keyId
    },
    theme: {
      color: '#1d4ed8'
    },
    handler: (response: RazorpayPaymentSuccessResponse) => {
      onSuccess(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      }
    }
  };

  const rzpInstance = new window.Razorpay(options);
  rzpInstance.open();
  return true;
}
