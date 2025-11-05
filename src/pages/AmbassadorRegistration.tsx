import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const AmbassadorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    studentId: '',
    email: '',
    phone: '',
    motivation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Ambassador application submitted:', formData);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAFAFA] font-['Manrope']">
      {/* Top App Bar */}
      <div className="flex items-center bg-white/95 backdrop-blur-md px-4 py-4 justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div
          className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:text-[#007BFF] transition-colors duration-200 rounded-full hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <MaterialIcon name="arrow_back" className="text-[#1C1C1E] text-2xl" />
        </div>
        <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          Ambassador Program
        </h2>
      </div>

      <main className="flex-1 px-6 bg-[#FAFAFA]">
        {/* Hero Icon */}
        <div className="flex justify-center items-center py-10">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#007BFF] text-white shadow-xl">
            <MaterialIcon name="diversity_3" className="!text-6xl" />
          </div>
        </div>

        {/* Headline Text */}
        <h1 className="text-[#1C1C1E] tracking-tight text-5xl font-['Manrope'] font-bold leading-tight text-center pb-4 pt-0">
          Become a ROOMie Ambassador
        </h1>

        {/* Body Text */}
        <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed pb-10 text-center max-w-2xl mx-auto">
          Join our team, lead the way on your campus, and help connect students with their perfect home.
        </p>

        {/* Perks & Responsibilities Section */}
        <div className="bg-white rounded-2xl p-8 mb-10 border border-gray-200 shadow-lg max-w-3xl mx-auto">
          <h3 className="text-[#007BFF] text-2xl font-['Manrope'] font-bold leading-tight tracking-tight pb-6">
            Perks of the Program
          </h3>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BFF] text-white shadow-md shrink-0">
                <MaterialIcon name="workspace_premium" className="text-2xl" />
              </div>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">Earn rewards and exclusive ROOMie merchandise.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BFF] text-white shadow-md shrink-0">
                <MaterialIcon name="school" className="text-2xl" />
              </div>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">Build your resume with leadership experience.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BFF] text-white shadow-md shrink-0">
                <MaterialIcon name="celebration" className="text-2xl" />
              </div>
              <p className="text-[#6B7280] text-base font-['Work_Sans'] font-light leading-relaxed">Get invited to exclusive events and networking opportunities.</p>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#FAFAFA] max-w-3xl mx-auto pb-8">
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
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
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
                className="appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 p-4 pr-12 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
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
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
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
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
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
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
              id="phone"
              placeholder="(123) 456-7890"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] min-h-40 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-relaxed shadow-sm transition-all duration-200"
              id="motivation"
              placeholder="Tell us a bit about your motivation..."
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            />
          </div>
        </form>
      </main>

      {/* Sticky Footer with CTA */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-5 border-t border-gray-200 shadow-lg">
        {/* CTA Button */}
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center rounded-2xl bg-[#007BFF] px-8 py-5 text-lg font-['Manrope'] font-semibold text-white hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]"
          >
            Submit Application
          </button>
          <p className="text-[#6B7280] text-sm font-['Work_Sans'] font-light text-center pt-3">
            By applying, you agree to our{' '}
            <a className="font-medium text-[#007BFF] underline hover:text-[#0056D6] transition-colors" href="#">Terms of Service</a>
            {' '}and{' '}
            <a className="font-medium text-[#007BFF] underline hover:text-[#0056D6] transition-colors" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorRegistration;

