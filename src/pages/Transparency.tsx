import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { LegalModalTrigger } from '@/components/legal/LegalModal';

const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Transparency: React.FC = () => {
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

      <main className="mx-auto max-w-3xl px-4 lg:px-0 py-10 md:py-14">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">
          Transparency
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight text-[#111318]">
          How we handle your data and what you can expect from ROOMie
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
          We do not hide important terms in fine print. This page brings our key policies into one
          place so you can quickly understand your rights, responsibilities and how ROOMie treats
          your data.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <LegalModalTrigger
            docType="terms"
            className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left hover:border-[#007BFF] transition-colors"
            label={
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="description" className="text-base text-[#007BFF]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                    Terms of Service
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                    A plain-language summary of what you agree to when you use ROOMie.
                  </p>
                </div>
              </div>
            }
          />

          <LegalModalTrigger
            docType="privacy"
            className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left hover:border-[#007BFF] transition-colors"
            label={
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="shield_lock" className="text-base text-[#007BFF]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                    Privacy Policy
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                    How we collect, use and protect your information as a student or owner.
                  </p>
                </div>
              </div>
            }
          />

          <LegalModalTrigger
            docType="cookies"
            className="md:col-span-2 flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left hover:border-[#007BFF] transition-colors"
            label={
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="cookie" className="text-base text-[#007BFF]" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-semibold text-[#111318]">Cookies</h2>
                  <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                    The simple truth about the small files we use to keep you signed in and keep
                    ROOMie running smoothly.
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Transparency;

