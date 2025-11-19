import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const TrustSafety = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 lg:px-0">
          <Logo size="sm" />
          <Link
            to="/landing"
            className="text-xs md:text-sm text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 lg:px-0 py-10 md:py-14">
        {/* Headline Text */}
        <div className="pb-10">
          <h2 className="text-[#007BFF] tracking-tight text-4xl md:text-5xl font-['Manrope'] font-bold leading-tight text-left pb-4">
            Your safety is our priority
          </h2>

          {/* Body Text */}
          <p className="text-[#6B7280] text-base md:text-lg font-['Work_Sans'] font-light leading-relaxed max-w-3xl">
            From property verification to payments and support, ROOMie is designed so Ghanaian students can find
            housing without guessing what is safe and what is not.
          </p>
        </div>

        {/* 4-Grid Safety Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-16">
          {/* Verified properties */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
              <MaterialIcon name="verified_user" className="text-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Verified properties</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Only verified and approved properties appear for students. We check ownership, location and key safety
                details.
              </p>
            </div>
          </div>

          {/* Verified students */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
              <MaterialIcon name="school" className="text-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Verified students</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                We confirm student status before bookings are approved to keep the community focused and trustworthy.
              </p>
            </div>
          </div>

          {/* Secure payments */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
              <MaterialIcon name="lock" className="text-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Secure payments</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Your payments flow through secure channels and are only released when key milestones in the stay are
                met.
              </p>
            </div>
          </div>

          {/* Human support */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
              <MaterialIcon name="headset_mic" className="text-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Human support</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                A real team in Ghana to help you if something doesn&apos;t feel right before, during or after a stay.
              </p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="border-t border-gray-200 bg-white py-16">
          <h3 className="text-[#007BFF] text-3xl md:text-4xl font-['Manrope'] font-bold leading-tight tracking-tight pb-6">
            How we protect you
          </h3>

          {/* Accordions */}
          <div className="space-y-4">
            {/* Dispute resolution */}
            <div className="rounded-xl bg-white p-5 border border-gray-200 hover:border-[#007BFF] transition-colors duration-200">
              <div
                className="flex cursor-pointer list-none items-center justify-between font-medium"
                onClick={() => toggleAccordion('dispute')}
              >
                <span className="text-lg md:text-xl font-['Manrope'] font-semibold text-[#1C1C1E]">Dispute resolution</span>
                <span className={`transition-transform duration-200 ${openAccordion === 'dispute' ? 'rotate-180' : ''} text-[#6B7280]`}>
                  <MaterialIcon name="expand_more" className="text-2xl" />
                </span>
              </div>
              {openAccordion === 'dispute' && (
                <p className="mt-4 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
                  If something goes wrong, our resolution team steps in to review messages, bookings and evidence from
                  both sides and find a fair outcome. We don&apos;t leave you to fight it out alone.
                </p>
              )}
            </div>

            {/* Community guidelines */}
            <div className="rounded-xl bg-white p-5 border border-gray-200 hover:border-[#007BFF] transition-colors duration-200">
              <div
                className="flex cursor-pointer list-none items-center justify-between font-medium"
                onClick={() => toggleAccordion('guidelines')}
              >
                <span className="text-lg md:text-xl font-['Manrope'] font-semibold text-[#1C1C1E]">Community guidelines</span>
                <span className={`transition-transform duration-200 ${openAccordion === 'guidelines' ? 'rotate-180' : ''} text-[#6B7280]`}>
                  <MaterialIcon name="expand_more" className="text-2xl" />
                </span>
              </div>
              {openAccordion === 'guidelines' && (
                <p className="mt-4 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
                  Clear expectations for both students and owners so everyone knows what is acceptable. When people
                  break the rules, we can restrict access or remove them from the platform.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="py-16 border-t border-gray-200">
          <div className="max-w-3xl mx-auto space-y-4">
            <Link to="/contact">
              <button className="w-full h-11 rounded-md bg-[#007BFF] text-white text-sm md:text-base font-['Manrope'] font-semibold flex items-center justify-center gap-2 hover:bg-[#0056D6] transition-colors duration-200">
                <span>Contact support</span>
                <MaterialIcon name="arrow_forward" className="text-xl" />
              </button>
            </Link>
            <Link to="/student/properties">
              <button className="w-full h-11 rounded-md bg-white border border-[#007BFF] text-[#007BFF] text-sm md:text-base font-['Manrope'] font-semibold hover:bg-[#007BFF]/5 transition-colors duration-200">
                Browse verified listings
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-200 bg-white">
        <div className="flex justify-center items-center gap-8 flex-wrap max-w-5xl mx-auto">
          <Link to="/transparency" className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200">
            Transparency
          </Link>
          <Link to="/resources" className="text-base font-['Work_Sans'] font-light text-[#6B7280] hover:text-[#007BFF] transition-colors duration-200">
            Help &amp; Resources
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default TrustSafety;

