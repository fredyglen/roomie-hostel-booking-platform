import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Pricing = () => {
  const navigate = useNavigate();
  const [pricingType, setPricingType] = useState<'students' | 'owners'>('students');

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAFAFA]">
      {/* Top App Bar */}
      <div className="flex items-center bg-white/95 backdrop-blur-md px-4 py-4 justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div
          className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:text-[#007BFF] transition-colors duration-200 rounded-full hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <MaterialIcon name="arrow_back" className="text-[#1C1C1E] text-2xl" />
        </div>
        <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          Pricing
        </h2>
      </div>

      {/* Headline */}
      <div className="px-6 py-16 bg-white">
        <h1 className="text-[#007BFF] text-5xl font-['Manrope'] font-bold leading-tight text-center pb-6 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed text-center max-w-2xl mx-auto">
          No hidden fees. What you see is what you pay. We believe in clarity and trust.
        </p>
      </div>

      {/* Segmented Buttons */}
      <div className="flex px-6 pb-10 bg-white border-b border-gray-200">
        <div className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-gray-100 p-1.5 max-w-md mx-auto">
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-4 text-base font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
              pricingType === 'students'
                ? 'bg-[#007BFF] shadow-md text-white'
                : 'text-[#6B7280] hover:text-[#1C1C1E]'
            }`}
          >
            <span className="truncate">For Students</span>
            <input
              type="radio"
              name="pricing-toggle"
              value="students"
              checked={pricingType === 'students'}
              onChange={() => setPricingType('students')}
              className="invisible w-0"
            />
          </label>
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-4 text-base font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
              pricingType === 'owners'
                ? 'bg-[#007BFF] shadow-md text-white'
                : 'text-[#6B7280] hover:text-[#1C1C1E]'
            }`}
          >
            <span className="truncate">For Property Owners</span>
            <input
              type="radio"
              name="pricing-toggle"
              value="owners"
              checked={pricingType === 'owners'}
              onChange={() => setPricingType('owners')}
              className="invisible w-0"
            />
          </label>
        </div>
      </div>

      {/* Student Pricing Section */}
      {pricingType === 'students' && (
        <div className="px-6 py-12 max-w-4xl mx-auto w-full">
          {/* Rental Costs Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-8 mb-6 border border-gray-200">
            <div className="flex items-center gap-5 mb-6">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="real_estate_agent" className="text-3xl" />
              </div>
              <div>
                <h3 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight">Rental Costs</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light">Directly from the owner.</p>
              </div>
            </div>
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
              The monthly rent is set by the property owner. You pay the first month's rent through our secure platform to confirm your booking. Subsequent payments are made directly to the owner.
            </p>
          </div>

          {/* Platform Service Fee Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-8 mb-6 border border-gray-200">
            <div className="flex items-center gap-5 mb-6">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="verified_user" className="text-3xl" />
              </div>
              <div>
                <h3 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight">Platform Service Fee</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light">One-time booking fee.</p>
              </div>
            </div>
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mb-6">
              A one-time fee of <span className="font-bold text-[#007BFF]">5% of the first month's rent</span> is charged for our services. This covers:
            </p>
            <ul className="space-y-4 text-[#6B7280]">
              <li className="flex items-start gap-4">
                <MaterialIcon name="check_circle" className="text-[#00C853] text-2xl mt-0.5" />
                <span className="font-['Work_Sans'] font-light text-base leading-relaxed">Property & owner verification for your safety.</span>
              </li>
              <li className="flex items-start gap-4">
                <MaterialIcon name="support_agent" className="text-[#00C853] text-2xl mt-0.5" />
                <span className="font-['Work_Sans'] font-light text-base leading-relaxed">24/7 customer support during your booking process.</span>
              </li>
              <li className="flex items-start gap-4">
                <MaterialIcon name="credit_card" className="text-[#00C853] text-2xl mt-0.5" />
                <span className="font-['Work_Sans'] font-light text-base leading-relaxed">Secure payment processing for your initial payment.</span>
              </li>
            </ul>
            <div className="mt-6 p-6 rounded-xl bg-[#FAFAFA] border border-gray-200">
              <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light leading-relaxed">
                <span className="font-semibold text-[#1C1C1E]">Example:</span> For a room costing GHS 500/month, the student service fee is just <span className="font-bold text-[#007BFF]">GHS 25</span>.
              </p>
            </div>
          </div>

          {/* Security Deposit Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-8 mb-8 border border-gray-200">
            <div className="flex items-center gap-5 mb-6">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="shield" className="text-3xl" />
              </div>
              <div>
                <h3 className="text-[#1C1C1E] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight">Security Deposit</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light">Handled by the property owner.</p>
              </div>
            </div>
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
              The security deposit amount is set by the owner and is handled directly between you and them. We recommend clarifying the terms and getting a receipt for your records.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/student/properties')}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#007BFF] px-8 py-5 text-lg font-['Manrope'] font-semibold text-white hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]"
          >
            <MaterialIcon name="search" className="text-2xl" />
            Find a Room
          </button>
        </div>
      )}

      {/* FAQ Section */}
      <div className="px-6 py-20 bg-[#FAFAFA]">
        <h3 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight pb-10 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4 max-w-4xl mx-auto">
          <details className="group rounded-2xl bg-white p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">
              When do I pay the service fee?
              <div className="text-[#6B7280]">
                <MaterialIcon name="expand_more" className="text-2xl transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mt-5">
              The service fee is paid along with your first month's rent when you confirm your booking on our platform. This secures your room.
            </p>
          </details>
          <details className="group rounded-2xl bg-white p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
            <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">
              Is the service fee refundable?
              <div className="text-[#6B7280]">
                <MaterialIcon name="expand_more" className="text-2xl transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mt-5">
              The service fee is non-refundable once the booking is confirmed by the property owner, as it covers the costs of our services provided.
            </p>
          </details>
          <details className="group rounded-2xl bg-white p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
            <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">
              What if I have an issue with the property?
              <div className="text-[#6B7280]">
                <MaterialIcon name="expand_more" className="text-2xl transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed mt-5">
              If the property is significantly different from the listing, you have 24 hours after check-in to report it to us. We will investigate and may provide a refund.
            </p>
          </details>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 px-6 text-center mt-auto">
        <div className="flex justify-center space-x-8 max-w-4xl mx-auto">
          <a className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200" href="#">Terms of Service</a>
          <a className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200" href="#">Contact Support</a>
        </div>
        <p className="text-sm text-[#6B7280] font-['Work_Sans'] font-light mt-6">© 2025 ROOMie. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Pricing;

