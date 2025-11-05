import React from 'react';
import { Link } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const OwnerLanding = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAFAFA]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm">
        <h2 className="flex-1 text-2xl font-['Manrope'] font-bold leading-tight tracking-tight text-[#007BFF]">ROOMie</h2>
        <div className="flex h-12 w-12 shrink-0 items-center justify-end text-[#007BFF] hover:text-[#0056D6] transition-colors cursor-pointer">
          <MaterialIcon name="menu" className="text-3xl" />
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              {/* Hero Image */}
              <div
                className="w-full aspect-[4/3] bg-cover bg-center bg-no-repeat rounded-3xl shadow-xl md:min-w-[400px]"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBinQPA8cMqPQB_nO7kla3IvoW1IzbTZkuRQ2lLlqLvynxW9wbfq4yTE5addYhW9lB0Ut5czR3_EwyD-zEjIP-HKZvLtquyPtb8eY_Un-At31WfMGuXI4iL8Mw0ibmRLrJ9SUVhvDFs6W-DWTdGoibKjovPdOG7zHJftQtK6QGqey9mYLvU3nVtzgT9Zn47x7pfDqIAF-X-hYw9FkLDal5z5tc4AHFEy9pn2eKVKlKBQZ2JaBNn0BUaz48yFNrWH_J96GFjDsccoZIs")`
                }}
              />

              {/* Hero Content */}
              <div className="flex flex-col gap-8 md:min-w-[400px] md:justify-center">
                <div className="flex flex-col gap-4 text-left">
                  <h1 className="text-[#007BFF] text-5xl font-['Manrope'] font-bold leading-tight tracking-tight md:text-6xl">
                    Maximize Your Rental Income & Simplify Property Management
                  </h1>
                  <h2 className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed">
                    Connect with verified university students and manage your properties effortlessly with ROOMie.
                  </h2>
                </div>
                <Link to="/owner/register">
                  <button className="inline-flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-8 bg-[#007BFF] text-white text-lg font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]">
                    <span className="truncate">List Your Property</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Old Way Section - Horizontal Scroll */}
        <section className="py-20 bg-[#FAFAFA]">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-10">
            Tired of the Old Way?
          </h2>
          <div className="overflow-x-auto px-6 pb-4 no-scrollbar">
            <div className="flex gap-6 w-max">
              {/* Card 1 */}
              <div className="flex-none w-[300px] sm:w-[340px] flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
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
              <div className="flex-none w-[300px] sm:w-[340px] flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
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
              <div className="flex-none w-[300px] sm:w-[340px] flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-full aspect-square bg-cover bg-center bg-no-repeat rounded-2xl shadow-lg"
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
            <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="bar_chart" className="text-3xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Revenue Dashboard</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  Visualize your earnings with a clear and intuitive dashboard.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="calendar_month" className="text-3xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Automated Booking Management</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  Streamline reservations and reduce your administrative burden.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="other_houses" className="text-3xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Professional Property Listings</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  Attract the right tenants with high-quality, verified listings.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center size-16 bg-[#007BFF] rounded-2xl text-white shadow-lg">
                <MaterialIcon name="request_quote" className="text-3xl" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Financial Reporting</h3>
                <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                  Simplify your finances with automated reports and tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-[#FAFAFA]">
          <h2 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight px-6 pb-12 text-center">
            Numbers You Can Trust
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 px-6 mb-10 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-[#007BFF] text-6xl font-['Manrope'] font-bold">95%</p>
              <p className="text-[#1C1C1E] text-center text-lg font-['Work_Sans'] font-light mt-4">Occupancy Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <p className="text-[#007BFF] text-6xl font-['Manrope'] font-bold">10</p>
              <p className="text-[#1C1C1E] text-center text-lg font-['Work_Sans'] font-light mt-4">Months Avg. Tenancy</p>
            </div>
          </div>

          {/* Transparent Financials Card */}
          <div className="px-6 max-w-2xl mx-auto">
            <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-10 shadow-lg">
              <h3 className="text-2xl font-['Manrope'] font-bold text-center text-[#007BFF]">Transparent Financials</h3>

              <div className="flex flex-col items-center gap-3">
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light">Total Rent</p>
                <p className="text-4xl font-['Manrope'] font-bold text-[#1C1C1E]">GHS 2,000</p>
              </div>

              <div className="flex justify-center items-center">
                <MaterialIcon name="remove" className="text-[#6B7280] text-2xl" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light">ROOMie Service Fee (5%)</p>
                <p className="text-4xl font-['Manrope'] font-bold text-red-500">-GHS 100</p>
              </div>

              <hr className="w-full border-gray-200 my-2" />

              <div className="flex flex-col items-center gap-3">
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light">Your Monthly Payout</p>
                <p className="text-5xl font-['Manrope'] font-bold text-green-500">GHS 1,900</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-white">
          <div className="px-6 max-w-4xl mx-auto">
            <div className="bg-[#FAFAFA] rounded-3xl p-12 text-center shadow-lg">
              <h2 className="text-[#007BFF] text-5xl font-['Manrope'] font-bold leading-tight tracking-tight mb-6">
                Ready to grow your rental business?
              </h2>
              <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                Join hundreds of property owners already earning more with ROOMie.
              </p>
              <Link to="/owner/register">
                <button className="inline-flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-8 bg-[#007BFF] text-white text-lg font-['Manrope'] font-semibold leading-normal tracking-wide hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]">
                  <span className="truncate">List Your Property Now</span>
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

