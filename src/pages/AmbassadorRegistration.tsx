import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const AmbassadorRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    studentId: '',
    email: '',
    phone: '',
    socialMediaLink: '',
    motivation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Ambassador application submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white font-['Manrope']">
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
        {/* Hero Icon */}
        <div className="flex justify-center items-center pb-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#007BFF] text-white">
            <MaterialIcon name="diversity_3" className="!text-5xl" />
          </div>
        </div>

        {/* Headline Text */}
        <h1 className="text-[#1C1C1E] tracking-tight text-4xl md:text-5xl font-['Manrope'] font-bold leading-tight text-center pb-4 pt-0">
          Become a ROOMie ambassador
        </h1>

        {/* Body Text */}
        <p className="text-[#6B7280] text-base md:text-lg font-['Work_Sans'] font-light leading-relaxed pb-10 text-center max-w-2xl mx-auto">
          Lead the way on your campus, host events and help students find safe, verified housing faster.
        </p>

        {/* Perks & Responsibilities Section */}
        <div className="bg-white rounded-xl p-8 mb-10 border border-gray-200 max-w-3xl mx-auto">
          <h3 className="text-[#007BFF] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight pb-4">
            Why students love our ambassadors
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BFF] text-white shrink-0">
                <MaterialIcon name="workspace_premium" className="text-2xl" />
              </div>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">Earn rewards and ROOMie merch when you help students find verified rooms.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BFF] text-white shrink-0">
                <MaterialIcon name="school" className="text-2xl" />
              </div>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">Build your CV with real leadership, events and community-building experience.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BFF] text-white shrink-0">
                <MaterialIcon name="celebration" className="text-2xl" />
              </div>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">Access invite-only ROOMie meetups, workshops and networking sessions.</p>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl mx-auto pb-8">
          {/* Section Header: Your Details */}
          <h3 className="text-[#007BFF] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight pt-6 pb-2">
            Your Details
          </h3>

          {/* TextField: Full Name */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="full-name">
              Full Name
            </label>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal transition-all duration-200"
              id="full-name"
              placeholder="Enter your full name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          {/* Dropdown: University */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="university">
              University
            </label>
            <div className="relative">
              <select
                className="appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 p-4 pr-12 text-base font-['Work_Sans'] font-light leading-normal transition-all duration-200"
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              >
                <option value="" disabled>Select your university</option>
                <option value="uni1">University of Ghana</option>
                <option value="uni2">Kwame Nkrumah University of Science and Technology</option>
                <option value="uni3">University of Cape Coast</option>
                <option value="uni4">Ashesi University</option>
              </select>
              <MaterialIcon name="expand_more" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* TextField: Student ID */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="student-id">
              Student ID Number
            </label>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal transition-all duration-200"
              id="student-id"
              placeholder="e.g. 12345678"
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
          </div>

          {/* Section Header: Contact Info */}
          <h3 className="text-[#007BFF] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight pt-6 pb-2">
            Contact Info
          </h3>

          {/* TextField: Email */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="email">
              University Email Address
            </label>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal transition-all duration-200"
              id="email"
              placeholder="your.name@university.edu"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* TextField: Phone */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal transition-all duration-200"
              id="phone"
              placeholder="(123) 456-7890"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* TextField: Social Media Page */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="social-media">
              Social media page link
            </label>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal transition-all duration-200"
              id="social-media"
              placeholder="https://instagram.com/your-page"
              type="url"
              value={formData.socialMediaLink}
              onChange={(e) => setFormData({ ...formData, socialMediaLink: e.target.value })}
              required
            />
          </div>

          {/* Section Header: Why You? */}
          <h3 className="text-[#007BFF] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight pt-6 pb-2">
            Why You?
          </h3>

          {/* TextArea */}
          <div className="flex flex-col">
            <label className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3" htmlFor="motivation">
              Why do you want to be an ambassador?
            </label>
            <textarea
              className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] min-h-40 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-relaxed transition-all duration-200"
              id="motivation"
              placeholder="Tell us a bit about your motivation..."
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            />
          </div>
        </form>
      </main>

      {/* Footer with CTA */}
      <div className="border-t border-gray-200 bg-white px-4 lg:px-0 py-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center rounded-md bg-[#007BFF] px-6 py-3 text-sm md:text-base font-['Manrope'] font-semibold text-white hover:bg-[#0056D6] transition-colors duration-200"
          >
            Submit application
          </button>
          <p className="text-[#6B7280] text-sm font-['Work_Sans'] font-light text-center pt-3">
            By applying, you agree to our{' '}
            <a className="font-medium text-[#007BFF] underline hover:text-[#0056D6] transition-colors" href="/transparency">
              Transparency details
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorRegistration;

