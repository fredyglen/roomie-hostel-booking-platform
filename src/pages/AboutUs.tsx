import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const AboutUs = () => {
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
          About ROOMie
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight text-[#111318]">
          Student housing, reimagined from the student side.
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
          Finding a place to stay should not feel like a full-time job. ROOMie started after one too
          many near-disasters with fake listings, last-minute cancellations and surprise fees.
        </p>
        <p className="mt-2 text-sm md:text-base text-[#4B5563] leading-relaxed">
          Our goal is simple: make student accommodation feel organised, honest and calm for both
          students and owners.
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                <MaterialIcon name="verified_user" className="text-lg text-[#007BFF]" />
              </div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                Verified properties first
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              We focus on verified listings with clear photos, pricing and must-know details so you
              are not guessing what you will meet on arrival.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                <MaterialIcon name="groups" className="text-lg text-[#007BFF]" />
              </div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                Built for real student life
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              From washroom type to water reliability, we surface the details that actually matter
              when you are living with roommates and juggling classes.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                <MaterialIcon name="lock" className="text-lg text-[#007BFF]" />
              </div>
              <h2 className="text-sm md:text-base font-semibold text-[#111318]">
                Simple, transparent money flow
              </h2>
            </div>
            <p className="mt-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
              Students see total costs upfront. Owners get a clear record of bookings and payouts.
              No secret agent cuts or surprise extra charges.
            </p>
          </div>
        </section>

        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#111318]">Our story</h2>
          <p className="mt-3 text-sm md:text-base text-[#4B5563] leading-relaxed">
            For years, housing for students in Ghana has been controlled by screenshots, middlemen
            and guesswork. ROOMie was created by someone who almost lost a semester because of it.
          </p>
          <p className="mt-2 text-sm md:text-base text-[#4B5563] leading-relaxed">
            Instead of more chaos, we are building a calmer way to find a room – with verified
            properties, student verification and a booking flow both sides can trust.
          </p>
        </section>

        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#111318]">What happens next</h2>
          <p className="mt-3 text-sm md:text-base text-[#4B5563] leading-relaxed">
            As ROOMie grows, we are adding better tools for owners, deeper safety checks and a more
            powerful dashboard for admin teams – without losing the simplicity students need.
          </p>
          <div className="mt-5">
            <Link
              to="/student/properties"
              className="inline-flex items-center justify-center rounded-md bg-[#007BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0056D6] transition-colors"
            >
              Find your room
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;

