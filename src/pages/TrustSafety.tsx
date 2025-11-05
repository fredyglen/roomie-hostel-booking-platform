import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const TrustSafety = () => {
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAFAFA]">
      {/* Top App Bar */}
      <div className="flex items-center bg-white/95 backdrop-blur-md px-4 py-4 justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div
          className="text-[#1C1C1E] flex size-12 shrink-0 items-center justify-center cursor-pointer hover:text-[#007BFF] transition-colors duration-200 rounded-full hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <MaterialIcon name="arrow_back" className="text-2xl" />
        </div>
        <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          Trust and Safety
        </h2>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-white">
        {/* Headline Text */}
        <div className="px-6 py-20">
          <h2 className="text-[#007BFF] tracking-tight text-5xl font-['Manrope'] font-bold leading-tight text-left pb-6">
            Your Safety is Our Priority
          </h2>

          {/* Body Text */}
          <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed max-w-3xl">
            At ROOMie, we're committed to creating a secure and trustworthy community for students. We've implemented robust measures to ensure your safety from search to stay.
          </p>
        </div>

        {/* 4-Grid Safety Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 pb-20 bg-white max-w-5xl mx-auto">
          {/* Verified Properties */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="verified_user" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Verified Properties</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Every property is vetted by our team for safety and accuracy.
              </p>
            </div>
          </div>

          {/* Verified Students */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="school" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Verified Students</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                We verify the student status of all tenants to build a trusted community.
              </p>
            </div>
          </div>

          {/* Secure Payments */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="lock" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Secure Payments</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Our gateway protects your payments until you've safely checked in.
              </p>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="headset_mic" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">24/7 Support</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Our dedicated team is always here to help with any issues or questions.
              </p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="bg-[#FAFAFA] py-20">
          <h3 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-8 max-w-5xl mx-auto">
            How We Protect You
          </h3>

          {/* Accordions */}
          <div className="px-6 space-y-4 max-w-5xl mx-auto">
            {/* Dispute Resolution */}
            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
              <div
                className="flex cursor-pointer list-none items-center justify-between font-medium"
                onClick={() => toggleAccordion('dispute')}
              >
                <span className="text-xl font-['Manrope'] font-semibold text-[#1C1C1E]">Dispute Resolution</span>
                <span className={`transition-transform duration-200 ${openAccordion === 'dispute' ? 'rotate-180' : ''} text-[#6B7280]`}>
                  <MaterialIcon name="expand_more" className="text-2xl" />
                </span>
              </div>
              {openAccordion === 'dispute' && (
                <p className="mt-5 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
                  In the rare event of a disagreement, our resolution team steps in to mediate. We ensure a fair process by reviewing all evidence, including communication logs and rental agreements, to reach an equitable solution for both parties.
                </p>
              )}
            </div>

            {/* Community Guidelines */}
            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
              <div
                className="flex cursor-pointer list-none items-center justify-between font-medium"
                onClick={() => toggleAccordion('guidelines')}
              >
                <span className="text-xl font-['Manrope'] font-semibold text-[#1C1C1E]">Community Guidelines</span>
                <span className={`transition-transform duration-200 ${openAccordion === 'guidelines' ? 'rotate-180' : ''} text-[#6B7280]`}>
                  <MaterialIcon name="expand_more" className="text-2xl" />
                </span>
              </div>
              {openAccordion === 'guidelines' && (
                <p className="mt-5 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
                  We expect all members of the ROOMie community to be respectful and responsible. Our guidelines outline the code of conduct for both landlords and tenants, promoting a positive and safe living environment for everyone.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-6 py-20 bg-white">
          <div className="max-w-3xl mx-auto space-y-4">
            <Link to="/contact">
              <button className="w-full h-16 rounded-2xl bg-[#007BFF] text-white text-lg font-['Manrope'] font-semibold flex items-center justify-center gap-3 hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]">
                <span>Contact Support</span>
                <MaterialIcon name="arrow_forward" className="text-2xl" />
              </button>
            </Link>
            <Link to="/student/properties">
              <button className="w-full h-16 rounded-2xl bg-white border-2 border-[#007BFF] text-[#007BFF] text-lg font-['Manrope'] font-semibold hover:bg-[#007BFF]/5 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 transition-all duration-200 shadow-md">
                Browse Verified Listings
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-200 bg-[#FAFAFA]">
        <div className="flex justify-center items-center gap-8 flex-wrap max-w-5xl mx-auto">
          <Link to="/privacy" className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200">
            Terms of Service
          </Link>
          <Link to="/help" className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200">
            Help Center
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default TrustSafety;

