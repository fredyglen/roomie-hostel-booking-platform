import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAFAFA]">
      {/* Top App Bar */}
      <div className="flex items-center bg-white/95 backdrop-blur-md px-4 py-4 justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div
          className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:text-[#007BFF] transition-colors duration-200 rounded-full hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-[#1C1C1E] text-2xl">arrow_back</span>
        </div>
        <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          Privacy Policy
        </h2>
      </div>

      <main className="px-6 py-12 max-w-3xl mx-auto w-full bg-white">
        <h1 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight mb-6">How we handle your data</h1>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          We know students and property owners share sensitive information with us. This page explains, in simple terms,
          what data we collect, how we use it, and the choices you have.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-10 mb-3">1. Information we collect</h2>
        <ul className="list-disc list-inside text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed space-y-2 mb-4">
          <li>Account details like your name, email, phone number, and university.</li>
          <li>Booking information such as chosen property, dates, and basic preferences.</li>
          <li>Owner information such as property details, pricing, and verification documents.</li>
        </ul>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">2. How we use your information</h2>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          We use your information to match students with properties, verify listings, process payments securely, and keep
          you informed about your bookings. We do not sell your personal data to advertisers or random third parties.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">3. Who can see what</h2>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          Property owners only see the information they need to host you responsibly (for example, your name, school and
          agreed booking details). Sensitive verification documents are handled securely and are not shared publicly.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">4. Your choices</h2>
        <ul className="list-disc list-inside text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed space-y-2 mb-4">
          <li>You can update your profile information from your account at any time.</li>
          <li>You can ask us to review or delete certain information where the law allows.</li>
          <li>You can opt out of non-essential notifications while still receiving booking updates.</li>
        </ul>

        <p className="text-[#9CA3AF] text-xs font-['Work_Sans'] font-light leading-relaxed mt-10">
          As ROOMie grows, we may adjust how we use data to improve the service. When we make important changes to this
          policy, we will highlight them here so you can stay informed.
        </p>
      </main>
    </div>
  );
};

export default Privacy;

