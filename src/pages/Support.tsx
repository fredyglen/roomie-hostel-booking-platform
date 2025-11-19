import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-4 lg:px-0">
          <Logo size="sm" />
          <Link
            to="/landing"
            className="text-xs md:text-sm text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 lg:px-0 py-10 md:py-14">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">
          Support
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight text-[#111318]">
          Real humans when things feel confusing, unsafe, or just annoying.
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
          ROOMie was built by a student who went through bad accommodation experiences, so we take
          your safety and peace of mind personally. If something feels off with a listing, a
          landlord, or a booking, we want to know.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
                <MaterialIcon name="help" className="text-base text-[#007BFF]" />
              </div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                Quick questions &amp; FAQs
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              Start with our help centre for simple questions about bookings, payments and your
              account.
            </p>
            <Link
              to="/resources"
              className="mt-3 inline-flex text-xs font-medium text-[#007BFF] hover:text-[#0056D6]"
            >
              Open help centre
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
                <MaterialIcon name="mail" className="text-base text-[#007BFF]" />
              </div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                Talk to the ROOMie team
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              If you&apos;re stuck, confused or something just doesn&apos;t feel right, reach out and tell
              us exactly what&apos;s going on.
            </p>
            <Link
              to="/contact"
              className="mt-3 inline-flex text-xs font-medium text-[#007BFF] hover:text-[#0056D6]"
            >
              Contact support
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF3C7]">
                <MaterialIcon name="warning" className="text-base text-[#D97706]" />
              </div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                Report a safety or fraud concern
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              If you suspect a fake listing, feel pressured to pay outside ROOMie, or experience
              harassment, please report it. We review every report seriously and may restrict or
              remove accounts.
            </p>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              You can also share screenshots or details when you contact us so we can investigate
              faster.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-xs md:text-sm text-[#6B7280] leading-relaxed">
          <p>
            ROOMie is not a landlord or agent. We&apos;re the layer that makes the process safer and
            more organised for both sides. When something goes wrong, we don&apos;t disappear — we step
            in and help you figure out what to do next.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Support;

