import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms: React.FC = () => {
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
          Terms of Service
        </h2>
      </div>

      <main className="px-6 py-12 max-w-3xl mx-auto w-full bg-white">
        <h1 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight mb-6">Using ROOMie</h1>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          ROOMie connects students looking for housing with property owners who have verified rooms available. These
          Terms describe the basic rules for using the platform. They are written in simple language so you know what to
          expect.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-10 mb-3">1. What ROOMie is responsible for</h2>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          We provide tools for discovering verified properties, booking rooms, and handling the first payment securely.
          We verify property details to the best of our ability, but the legal rental agreement is ultimately between you
          and the property owner.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">2. Your responsibilities as a student</h2>
        <ul className="list-disc list-inside text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed space-y-2 mb-4">
          <li>Provide accurate information about yourself when creating an account and booking a room.</li>
          <li>Respect property rules, neighbours, and payment deadlines agreed with the owner.</li>
          <li>Use ROOMie only for genuine housing needs, not for fraud or subletting without permission.</li>
        </ul>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">3. Responsibilities of property owners</h2>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          Owners must provide accurate property information, honour confirmed bookings, and keep students safe on their
          premises. Any changes to pricing, availability, or rules must be clearly communicated through the platform.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">4. Fees and payments</h2>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          Students pay a one-time booking fee when they successfully secure a room on ROOMie. Property owners pay a
          commission on successful bookings. Exact amounts and structures are clearly displayed before you confirm any
          booking or listing.
        </p>

        <h2 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-semibold mt-8 mb-3">5. Cancellations and issues</h2>
        <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-4">
          If a property is significantly different from what was shown on ROOMie, contact our support team within the
          stated time window. We will review the issue and decide on the fairest outcome based on our policies and
          evidence shared by both sides.
        </p>

        <p className="text-[#9CA3AF] text-xs font-['Work_Sans'] font-light leading-relaxed mt-10">
          This is a simplified summary of how ROOMie operates. As the platform grows, these Terms may be updated. When
          that happens, we will highlight the key changes on this page.
        </p>
      </main>
    </div>
  );
};

export default Terms;

