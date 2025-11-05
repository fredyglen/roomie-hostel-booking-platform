import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const AboutUs = () => {
  const navigate = useNavigate();

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
          About Us
        </h2>
      </div>

      <main className="bg-[#FAFAFA]">
        {/* Hero Section */}
        <div className="px-6 py-6 bg-white">
          <div
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-3xl min-h-96 shadow-xl"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjT0wTxVdqIQr3zF2frwOK1EfLkAC3p_pyGkZem0Xk-gIL2g_7xMi3uVaYNDGj-mY76DHVpSjAyMxE_HPYEefCdNaYrfQ6hqE0Gh1VvMgBkIUfSnw6G3qigVzo_jKQbNzH4MH_d-vwB1NiIva_QKptJn5dHavPvAjqwB5wCKOqn7mj4KlX3hBI9JBpmv58wGu5QNQ5RSzNkCDTxGPF1l3MZw0SX6D5bgGgA6CVnmPPZD8dkqjaLpjIIAVzZFLZ46rIZDkxxRCG8rGr")`
            }}
          >
            <div className="flex p-8">
              <p className="text-white tracking-tight text-5xl font-['Manrope'] font-bold leading-tight">
                Student Housing, Reimagined.
              </p>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="bg-white py-20">
          <h1 className="text-[#007BFF] tracking-tight text-4xl font-['Manrope'] font-bold leading-tight px-6 text-left pb-4">
            Our Mission
          </h1>
          <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed px-6 max-w-3xl">
            Finding the right place to live shouldn't be the hardest part of university. We're here to solve the challenge of finding safe, verified, and convenient student housing, connecting students with trusted property owners.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 pb-20 bg-white max-w-4xl mx-auto">
          {/* Verified Properties */}
          <div className="flex flex-1 gap-4 rounded-2xl border border-gray-200 bg-white p-6 flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="verified_user" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Verified Properties</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Every listing is checked for quality and safety.
              </p>
            </div>
          </div>

          {/* Student Community */}
          <div className="flex flex-1 gap-4 rounded-2xl border border-gray-200 bg-white p-6 flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="groups" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Student Community</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Connect with peers and find your new home.
              </p>
            </div>
          </div>

          {/* Simple & Secure */}
          <div className="flex flex-1 gap-4 rounded-2xl border border-gray-200 bg-white p-6 flex-col sm:col-span-2 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-white flex items-center justify-center size-14 bg-[#007BFF] rounded-2xl shadow-lg">
              <MaterialIcon name="lock" className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-semibold leading-tight">Simple & Secure</h2>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">
                Easy booking and secure payments, all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Founder Section */}
        <div className="bg-[#FAFAFA] py-20">
          <h1 className="text-[#007BFF] tracking-tight text-4xl font-['Manrope'] font-bold leading-tight px-6 text-left pb-8">
            Meet the Founder
          </h1>

          {/* Founder Story - No Picture */}
          <div className="px-6 max-w-3xl mx-auto">
            <div className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#007BFF] flex items-center justify-center shadow-xl">
                  <MaterialIcon name="person" className="text-white text-6xl" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-['Manrope'] font-bold text-[#1C1C1E] text-2xl">Founder & CEO</p>
                <p className="text-base text-[#6B7280] font-['Work_Sans'] font-light mt-2">ROOMie</p>
              </div>
            </div>
          </div>

          {/* Founder Story Text */}
          <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed px-6 pt-8 max-w-3xl mx-auto">
            Right before his first semester, the old housing system frustrated him beyond belief. The endless WhatsApp messages, the uncertainty, the stress—it was all too much. But it wasn't just him. On campus, he kept hearing the same complaints from fellow students, over and over again. That's when he decided: enough is enough. He built ROOMie to fix what was broken. It's that simple.
          </p>
        </div>

        {/* CTA Button */}
        <div className="w-full px-6 py-20 bg-white">
          <div className="max-w-md mx-auto">
            <Link to="/student/properties">
              <button className="w-full bg-[#007BFF] text-white font-['Manrope'] font-semibold py-5 px-6 rounded-2xl text-center text-lg hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]">
                Find Your Room
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white py-12 px-6 border-t border-gray-200">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#6B7280] font-['Work_Sans'] font-light text-sm">
              © 2025 ROOMie. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AboutUs;

