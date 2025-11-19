import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const MaterialIcon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const HowItWorks: React.FC = () => {
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
          How ROOMie works
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight text-[#111318]">
          A safer way to find a room, designed around how students actually live.
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
          ROOMie is for students who are tired of guessing games, fake listings and last-minute
          surprises. We verify properties, put everything in plain language and keep your money
          protected while you move.
        </p>

        <div className="mt-8 md:mt-10 space-y-6">
          <div className="flex gap-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
              <MaterialIcon name="person" className="text-base text-[#007BFF]" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                1. Create your ROOMie account
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                Use your student email and basic details to sign up. We keep the form short on
                purpose so you don&apos;t drop off before you even start.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
              <MaterialIcon name="verified" className="text-base text-[#007BFF]" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                2. Verify that you&apos;re a real student
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                We ask for simple proof that you actually attend your university. That way, owners
                know they&apos;re dealing with genuine students and you get access to verified rooms.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
              <MaterialIcon name="home" className="text-base text-[#007BFF]" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                3. Browse verified rooms that match your reality
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                See washroom type, utilities and water reliability clearly up front. No vague
                &quot;nice room&quot; descriptions. Just honest, student-first information.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
              <MaterialIcon name="payments" className="text-base text-[#007BFF]" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                4. Book and pay through ROOMie
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                You secure your space through ROOMie, not by sending random mobile money to a
                WhatsApp number. Your first payment is held until move-in so both sides are
                protected.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF]">
              <MaterialIcon name="favorite" className="text-base text-[#007BFF]" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                5. Live, renew, and repeat without the chaos
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                Keep everything in one place: bookings, receipts and future renewals. When you
                change level or move campuses, ROOMie moves with you.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
          <Link to="/register" className="md:w-auto">
            <button className="inline-flex h-11 items-center justify-center rounded-full bg-[#007BFF] px-6 text-sm font-medium text-white hover:bg-[#0056D6] transition-colors">
              Get started as a student
            </button>
          </Link>
          <Link to="/owner-landing" className="md:w-auto">
            <button className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 px-6 text-sm font-medium text-[#111318] hover:border-[#111318] transition-colors">
              I&apos;m a property owner
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;

