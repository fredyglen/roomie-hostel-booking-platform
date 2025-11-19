import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const OwnerLanding = () => {
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

      <main>
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              {/* Hero Image */}
              <div
                className="w-full aspect-[4/3] bg-cover bg-center bg-no-repeat rounded-2xl md:min-w-[400px]"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBinQPA8cMqPQB_nO7kla3IvoW1IzbTZkuRQ2lLlqLvynxW9wbfq4yTE5addYhW9lB0Ut5czR3_EwyD-zEjIP-HKZvLtquyPtb8eY_Un-At31WfMGuXI4iL8Mw0ibmRLrJ9SUVhvDFs6W-DWTdGoibKjovPdOG7zHJftQtK6QGqey9mYLvU3nVtzgT9Zn47x7pfDqIAF-X-hYw9FkLDal5z5tc4AHFEy9pn2eKVKlKBQZ2JaBNn0BUaz48yFNrWH_J96GFjDsccoZIs")`
                }}
              />

              {/* Hero Content */}
              <div className="flex flex-col gap-8 md:min-w-[400px] md:justify-center">
                <div className="flex flex-col gap-4 text-left">
                  <h1 className="text-[#007BFF] text-5xl font-['Manrope'] font-bold leading-tight tracking-tight md:text-6xl">
                    Let ROOMie run your student housing operations.
                  </h1>
                  <h2 className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed">
                    Built for owners with multiple hostels, compounds or floors. We handle the student pipeline,
                    bed tracking and payouts so you don&apos;t have to.
                  </h2>
                </div>
                <Link to="/owner/register">
                  <button className="inline-flex min-w-[84px] max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-6 bg-[#007BFF] text-white text-sm md:text-base font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] transition-colors duration-200">
                    <span className="truncate">List your property</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Old Way Section - Horizontal Scroll */}
        <section className="py-16 border-t border-gray-200 bg-white">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-10">
            Tired of the Old Way?
          </h2>
          <div className="overflow-x-auto px-6 pb-4 no-scrollbar">
            <div className="flex gap-6 w-max">
              {/* Card 1 */}
              <div className="flex-none w-[300px] sm:w-[340px] flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-xl"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKcKIOy2kvvTHC5nVGsWMxNrXrOKGhCXPBT1zHyaq08nG7p7k16ktpnADLbRrNhsnCKCzhkbxV8p-J2mzFYITRNWLqXNW3FYh-QbqJPtCNIgQ9aa63mM_0_RY56kvtEW7zo6R09aHIsBa_ANy7_Nr8OpBamVwaawuLKzg3a5koe4_JAMkUEp_tTpkzgCa_HKKLO4EE2yOAVJIZGBmkG7E8Rk7uNL4UKFhzxVrSVixgsEe__nw041Y7QqhMCLwpe3rxqqK0RPwO2NhJ")`
                  }}
                />
                <div>
                  <p className="text-[#1C1C1E] text-lg font-['Manrope'] font-semibold leading-tight mb-2">
                    Managing bookings in WhatsApp
                  </p>
                  <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                    Endless back-and-forth messages, lost information, and manual coordination.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex-none w-[300px] sm:w-[340px] flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-xl"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvGIU1KVDeu-tUj7dJC9bRPZyTQcbLnJ09p8UvuZ_m6lboPOkTFtfMDD0KSMKCZESMADRZe5snPBGZWjnckvrEPyNAs3yMWrxsd26UOqaoYNK31ApTSekZPEpJy93RcxV_Z818WDo_gsMZAK-P6eVIAt9mkLDV1FOrlgptZl7ugyYPzY5e0827MnHhr-E7hXoxrgkGFt3YlcP8bYqqcg-hR_5XDcgA9FIdxKVztt1PCQDlS3RvsXo4gVmTAXsLeAI1YELhk__40Ftr")`
                  }}
                />
                <div>
                  <p className="text-[#1C1C1E] text-lg font-['Manrope'] font-semibold leading-tight mb-2">
                    Tracking payments in notebooks
                  </p>
                  <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                    Disorganized records, missed payments, and stressful financial tracking.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex-none w-[300px] sm:w-[340px] flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-xl"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWZ5ImjoItEXW8KsfHp2hHGBojvtWOX8LCKX4wP8TsZcb3DYe-bFMdGxUrkcFki-dVgMyS39McgSr0VqArKhYYX8a8MPbTCR6iaGv3Gr2zh_Mh9HZQFAiqMkWiqPlT0HXym2VxsMujoAWnTCEYRUS-Tw1Te527f7ud9M9L-QDGAWSfFr7eIlzlGihqvjAC75YqEOjVRfFuZ4fbki8FWfT1eVbg87Vw_oWgKJtf4e77zko-1dIMcTmnr5yiYb0qnXSj7nbnmajx4xJX")`
                  }}
                />
                <div>
                  <p className="text-[#1C1C1E] text-lg font-['Manrope'] font-semibold leading-tight mb-2">
                    Wondering about performance
                  </p>
                  <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                    No clear data on your occupancy rates or revenue trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The ROOMie Way Section */}
        <section className="py-20 bg-white">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-12 text-center">
            Welcome to the ROOMie Way
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
              <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
                <MaterialIcon name="bar_chart" className="text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Revenue &amp; occupancy dashboard</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  See occupancy and revenue per compound, building and floor, not just per listing.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
              <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
                <MaterialIcon name="calendar_month" className="text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Automated booking &amp; bed management</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  ROOMie handles student discovery, verification and bookings so your team isn&apos;t stuck in WhatsApp.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
              <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
                <MaterialIcon name="other_houses" className="text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Compounds &amp; multi-building portfolios</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  Structure buildings, floors and room types so students always understand what they&apos;re booking.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6 hover:border-[#007BFF] transition-colors duration-200">
              <div className="flex items-center justify-center size-12 rounded-full bg-[#EEF2FF] text-[#007BFF]">
                <MaterialIcon name="request_quote" className="text-2xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Clear business terms</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  Know exactly what you earn after ROOMie&apos;s 5% service fee with no hidden owner charges or surprise deductions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 border-t border-gray-200 bg-white">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-12 text-center">
            Numbers You Can Trust
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 px-6 mb-10 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center p-10 rounded-xl border border-gray-200 bg-white">
              <p className="text-[#007BFF] text-6xl font-['Manrope'] font-bold">95%</p>
              <p className="text-[#1C1C1E] text-center text-lg font-['Work_Sans'] font-light mt-4">Occupancy Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center p-10 rounded-xl border border-gray-200 bg-white">
              <p className="text-[#007BFF] text-6xl font-['Manrope'] font-bold">10</p>
              <p className="text-[#1C1C1E] text-center text-lg font-['Work_Sans'] font-light mt-4">Months Avg. Tenancy</p>
            </div>
          </div>

          {/* Transparent Financials Card */}
          <div className="px-6 max-w-2xl mx-auto">
            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8">
              <h3 className="text-2xl font-['Manrope'] font-bold text-center text-[#007BFF]">Transparent financials</h3>

              <div className="flex flex-col items-center gap-3">
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light">Total rent (example)</p>
                <p className="text-4xl font-['Manrope'] font-bold text-[#1C1C1E]">GHS 2,000</p>
              </div>

              <div className="flex justify-center items-center">
                <MaterialIcon name="remove" className="text-[#6B7280] text-2xl" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light">ROOMie service fee (5%)</p>
                <p className="text-4xl font-['Manrope'] font-bold text-red-500">-GHS 100</p>
              </div>

              <hr className="w-full border-gray-200 my-2" />

              <div className="flex flex-col items-center gap-3">
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light">Your monthly payout</p>
                <p className="text-5xl font-['Manrope'] font-bold text-green-500">GHS 1,900</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-white">
          <div className="px-6 max-w-4xl mx-auto">
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <h2 className="text-[#007BFF] text-4xl md:text-5xl font-['Manrope'] font-bold leading-tight tracking-tight mb-6">
                Don&apos;t leave your hostels and compounds off the map.
              </h2>
              <p className="text-[#6B7280] text-base md:text-lg font-['Work_Sans'] font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                Students are already discovering verified rooms on ROOMie. Owners with multiple buildings who partner
                early get better visibility, smoother operations and fewer empty beds each semester.
              </p>
              <Link to="/owner/register">
                <button className="inline-flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-6 bg-[#007BFF] text-white text-sm md:text-base font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] transition-colors duration-200">
                  <span className="truncate">Start listing your buildings</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-12 px-6 border-t border-gray-200">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light">
              © 2025 ROOMie. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default OwnerLanding;

