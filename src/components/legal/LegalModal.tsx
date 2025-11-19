import React from 'react';
import {
  Dialog,
  DialogContentBare,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export type LegalDocumentType = 'terms' | 'privacy' | 'cookies';

interface LegalModalTriggerProps {
  docType: LegalDocumentType;
  label: React.ReactNode;
  className?: string;
}

const TermsBody: React.FC = () => (
  <div className="space-y-6 text-sm leading-relaxed text-[#4B5563] font-['Work_Sans']">
    <p>
      ROOMie connects students looking for housing with property owners who have verified rooms
      available. These Terms describe the basic rules for using the platform in clear language so
      you know what to expect.
    </p>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        1. What ROOMie is responsible for
      </h3>
      <p>
        We provide tools for discovering verified properties, booking rooms, and handling the first
        payment securely. We verify property details to the best of our ability, but the legal
        rental agreement is ultimately between you and the property owner.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        2. Your responsibilities as a student
      </h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Provide accurate information about yourself when creating an account and booking.</li>
        <li>Respect property rules, neighbours, and payment timelines.</li>
        <li>Use ROOMie only for genuine housing needs – not for fraud or unofficial subletting.</li>
      </ul>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        3. Responsibilities of property owners
      </h3>
      <p>
        Owners must provide accurate property information, honour confirmed bookings, and keep
        students safe on their premises. Any changes to pricing, availability, or rules must be
        clearly communicated through the platform.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        4. Fees and payments
      </h3>
      <p>
        Students pay a one-time booking fee when they successfully secure a room on ROOMie.
        Property owners pay a commission on successful bookings. Exact amounts and structures are
        clearly displayed before you confirm any booking or listing.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        5. Cancellations and issues
      </h3>
      <p>
        If a property is significantly different from what was shown on ROOMie, contact our support
        team within the stated time window. We will review the issue and decide on the fairest
        outcome based on our policies and the evidence shared by both sides.
      </p>
      <p className="text-xs text-[#9CA3AF]">
        As the platform grows, these Terms may be updated. When that happens, we will highlight key
        changes so you can stay informed.
      </p>
    </div>
  </div>
);

const PrivacyBody: React.FC = () => (
  <div className="space-y-6 text-sm leading-relaxed text-[#4B5563] font-['Work_Sans']">
    <p>
      We know students and property owners share sensitive information with us. This section
      explains what data we collect, how we use it, and the choices you have.
    </p>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        1. Information we collect
      </h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Account details like your name, email, phone number, and university.</li>
        <li>Booking information such as chosen property, dates, and basic preferences.</li>
        <li>Owner information such as property details, pricing, and verification documents.</li>
      </ul>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        2. How we use your information
      </h3>
      <p>
        We use your information to match students with properties, verify listings, process
        payments securely, and keep you informed about your bookings. We do not sell your personal
        data to advertisers or random third parties.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        3. Who can see what
      </h3>
      <p>
        Property owners only see the information they need to host you responsibly, such as your
        name, school, and agreed booking details. Sensitive verification documents are handled
        securely and are not shared publicly.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        4. Your choices
      </h3>
      <ul className="list-disc list-inside space-y-1">
        <li>You can update your profile information from your account at any time.</li>
        <li>You can ask us to review or delete certain information where the law allows.</li>
        <li>You can opt out of non-essential notifications while still receiving booking updates.</li>
      </ul>
      <p className="text-xs text-[#9CA3AF]">
        As ROOMie grows, we may adjust how we use data to improve the service. When we make
        important changes, we will highlight them clearly.
      </p>
    </div>
  </div>
);

const CookiesBody: React.FC = () => (
  <div className="space-y-6 text-sm leading-relaxed text-[#4B5563] font-['Work_Sans']">
    <p>
      ROOMie uses small pieces of data called cookies and similar technologies to keep you signed
      in, remember your preferences, and help the site run reliably. We do not use cookies here for
      targeted advertising.
    </p>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        1. Essential cookies
      </h3>
      <p>
        These cookies keep your session active so you do not have to log in again every few
        minutes. They also help us remember simple things like your selected campus and basic
        preferences.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        2. Analytics
      </h3>
      <p>
        We may use privacy-friendly analytics tools to understand how students and owners use
        ROOMie so we can improve the product. Where possible, this data is aggregated and does not
        identify you personally.
      </p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-['Manrope'] font-semibold text-[#111827]">
        3. Your control
      </h3>
      <p>
        You can clear cookies from your browser at any time or use built-in settings like "Do Not
        Track". Some features of ROOMie may not work properly if essential cookies are disabled.
      </p>
      <p className="text-xs text-[#9CA3AF]">
        As we add new features, we will keep this information updated so you always know how
        cookies are used on ROOMie.
      </p>
    </div>
  </div>
);

const getDocConfig = (docType: LegalDocumentType) => {
  switch (docType) {
    case 'terms':
      return { title: 'Terms of Service', Body: TermsBody };
    case 'privacy':
      return { title: 'Privacy Policy', Body: PrivacyBody };
    case 'cookies':
    default:
      return { title: 'Cookies', Body: CookiesBody };
  }
};

export const LegalModalTrigger: React.FC<LegalModalTriggerProps> = ({
  docType,
  label,
  className,
}) => {
  const { title, Body } = getDocConfig(docType);
  const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const evaluateScrollState = () => {
    const node = contentRef.current;
    if (!node) return;
    const { clientHeight, scrollHeight } = node;
    // If content does not overflow, allow closing immediately
    if (scrollHeight <= clientHeight + 1) {
      setHasScrolledToEnd(true);
    } else {
      setHasScrolledToEnd(false);
      node.scrollTop = 0;
    }
  };

  const handleScroll = () => {
    const node = contentRef.current;
    if (!node || hasScrolledToEnd) return;
    const { scrollTop, clientHeight, scrollHeight } = node;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToEnd(true);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(evaluateScrollState);
      } else {
        setTimeout(evaluateScrollState, 0);
      }
    } else {
      setHasScrolledToEnd(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className={className}>
          {label}
        </button>
      </DialogTrigger>
      <DialogContentBare className="max-w-3xl p-0 sm:rounded-xl">
        <div className="flex max-h-[80vh] flex-col bg-white">
          <div className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-[#111827] font-['Manrope']">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-[#6B7280]">
              If there&apos;s more to read, scroll to the end to enable the button.
            </DialogDescription>
          </div>
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-6"
          >
            <Body />
            <div className="h-6" />
          </div>
          <div className="border-t border-gray-200 bg-white px-6 py-4 flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                disabled={!hasScrolledToEnd}
                className={`inline-flex h-9 items-center px-4 text-sm font-medium transition-colors ${
                  hasScrolledToEnd
                    ? 'bg-[#007BFF] text-white hover:bg-[#0056D6]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Close
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

