import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Pricing = () => {
  const [pricingType, setPricingType] = useState<'students' | 'owners'>('students');

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

      <main className="mx-auto max-w-3xl px-4 lg:px-0 py-10 md:py-14 font-['Work_Sans'] font-light text-[#1C1C1E]">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">
          Pricing
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-['Manrope'] font-bold leading-tight text-[#111318]">
          Simple, transparent pricing for students and owners.
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
          No hidden fees. No surprise charges. Just a clear view of how money moves through
          ROOMie.
        </p>
        <p className="mt-2 text-sm md:text-base text-[#4B5563] leading-relaxed">
          Choose who you are to see exactly what you pay and what you get.
        </p>

        {/* Segmented toggle */}
        <div className="mt-6 flex justify-center">
          <div className="flex h-11 flex-1 max-w-md items-center justify-center rounded-2xl bg-gray-100 p-1.5">
            <label
              className={`flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 text-sm md:text-base font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
                pricingType === 'students'
                  ? 'bg-white text-[#007BFF]'
                  : 'text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              <span className="truncate">For students</span>
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
              className={`flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 text-sm md:text-base font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
                pricingType === 'owners'
                  ? 'bg-white text-[#007BFF]'
                  : 'text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              <span className="truncate">For property owners</span>
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

        {pricingType === 'students' && (
          <section className="mt-8 space-y-6">
            <h2 className="text-lg md:text-xl font-['Manrope'] font-bold text-[#111318]">For students</h2>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="real_estate_agent" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm md:text-base font-['Manrope'] font-semibold text-[#111318]">Rental costs</h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                <li>
                  <span className="font-semibold">Rent amount.</span> Set by the property owner for
                  each room or bed.
                </li>
                <li>
                  <span className="font-semibold">First payment.</span> Paid through ROOMie to
                  officially secure your booking.
                </li>
                <li>
                  <span className="font-semibold">After you move in.</span> Later payments are
                  usually made directly to the owner.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="verified_user" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm md:text-base font-['Manrope'] font-semibold text-[#111318]">
                  ROOMie booking fee
                </h3>
              </div>
              <p className="mt-3 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                When you successfully secure a room, ROOMie charges a one-time{' '}
                <span className="font-semibold text-[#007BFF]">GHS 100 booking fee</span>. It does
                not increase with the rent.
              </p>
              <ul className="mt-3 space-y-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                <li>
                  <span className="font-semibold">Safety checks.</span> We verify properties and
                  owners before they go live.
                </li>
                <li>
                  <span className="font-semibold">Support.</span> Our team steps in if anything
                  feels off before you move in.
                </li>
                <li>
                  <span className="font-semibold">Payment handling.</span> Secure mobile money and
                  bank transfer processing for your first payment.
                </li>
              </ul>
              <div className="mt-4 rounded-lg border border-gray-200 bg-[#F9FAFB] p-4">
                <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed">
                  <span className="font-semibold text-[#111318]">Example:</span> For a room costing
                  GHS 500 per month, your ROOMie booking fee is still{' '}
                  <span className="font-semibold text-[#007BFF]">GHS 100</span>.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="shield" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm md:text-base font-['Manrope'] font-semibold text-[#111318]">
                  Security deposit
                </h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                <li>
                  <span className="font-semibold">Set by owner.</span> Deposit amounts and rules are
                  agreed directly between you and the owner.
                </li>
                <li>
                  <span className="font-semibold">Paid to owner.</span> We recommend using a method
                  where you can get a clear receipt.
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to="/student/properties"
                className="inline-flex items-center justify-center rounded-md bg-[#007BFF] px-5 py-2.5 text-sm font-['Manrope'] font-semibold text-white hover:bg-[#0056D6] transition-colors"
              >
                <MaterialIcon name="search" className="mr-2 text-base" />
                Find a room
              </Link>
            </div>
          </section>
        )}

        {pricingType === 'owners' && (
          <section className="mt-8 space-y-6">
            <h2 className="text-lg md:text-xl font-['Manrope'] font-bold text-[#111318]">For property owners</h2>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="payments" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm md:text-base font-['Manrope'] font-semibold text-[#111318]">
                  Commission for owners
                </h3>
              </div>
              <p className="mt-3 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                ROOMie charges a straightforward{' '}
                <span className="font-semibold text-[#007BFF]">5% commission</span> on each
                successful booking. There is no extra{' '}
                <span className="font-semibold">GHS 100 fee for owners</span>, no subscription and
                no setup cost.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                    <MaterialIcon name="event_available" className="text-lg text-[#007BFF]" />
                  </div>
                  <h3 className="text-sm md:text-base font-['Manrope'] font-semibold text-[#111318]">
                    When is the 5% applied?
                  </h3>
                </div>
                <p className="mt-3 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                  Commission is only applied when a student books and pays through ROOMie. If there
                  is no booking, you do not pay anything.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                    <MaterialIcon name="stars" className="text-lg text-[#007BFF]" />
                  </div>
                  <h3 className="text-sm md:text-base font-['Manrope'] font-semibold text-[#111318]">
                    What do owners get?
                  </h3>
                </div>
                <ul className="mt-3 space-y-2 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                  <li>
                    <span className="font-semibold">Verified students.</span> Fewer random
                    WhatsApp messages and more serious tenants.
                  </li>
                  <li>
                    <span className="font-semibold">Clear records.</span> A simple view of
                    bookings and payouts.
                  </li>
                  <li>
                    <span className="font-semibold">Better listings.</span> Professional photos and
                    story-style showcases for your property.
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/owner-landing"
                className="inline-flex items-center justify-center rounded-md bg-[#007BFF] px-5 py-2.5 text-sm font-['Manrope'] font-semibold text-white hover:bg-[#0056D6] transition-colors"
              >
                <MaterialIcon name="apartment" className="mr-2 text-base" />
                List your property on ROOMie
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg md:text-xl font-['Manrope'] font-bold text-[#111318]">Common questions</h2>
          <div className="mt-4 space-y-3">
            <details className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-[#007BFF] transition-colors" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-sm md:text-base">
                When do I pay the booking fee?
                <span className="text-[#6B7280] transition-transform duration-200 group-open:rotate-180">
                  <MaterialIcon name="expand_more" className="text-xl" />
                </span>
              </summary>
              <p className="mt-3 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                The <span className="font-semibold text-[#007BFF]">GHS 100 booking fee</span> is
                paid together with your first payment when you confirm your booking on ROOMie.
              </p>
            </details>

            <details className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-[#007BFF] transition-colors">
              <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-sm md:text-base">
                Is the booking fee refundable?
                <span className="text-[#6B7280] transition-transform duration-200 group-open:rotate-180">
                  <MaterialIcon name="expand_more" className="text-xl" />
                </span>
              </summary>
              <p className="mt-3 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                Once the owner confirms your booking, the fee is non-refundable because it covers
                verification, support and payment handling that have already been provided.
              </p>
            </details>

            <details className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-[#007BFF] transition-colors">
              <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-sm md:text-base">
                What if I have an issue with the property?
                <span className="text-[#6B7280] transition-transform duration-200 group-open:rotate-180">
                  <MaterialIcon name="expand_more" className="text-xl" />
                </span>
              </summary>
              <p className="mt-3 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                If the property is very different from the listing, you have 24 hours after
                check-in to report it. Our team will investigate and help you work towards a fair
                outcome.
              </p>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;

