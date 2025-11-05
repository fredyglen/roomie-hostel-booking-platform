import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Contact = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'students' | 'owners'>('students');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    topic: 'Booking Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { ...formData, userType });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#FAFAFA]">
      {/* Top App Bar */}
      <div className="flex items-center bg-white/95 backdrop-blur-md px-4 py-4 justify-between sticky top-0 z-10 border-b border-gray-200 shadow-sm">
        <div
          className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:text-[#007BFF] transition-colors duration-200 rounded-full hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <MaterialIcon name="arrow_back" className="text-[#1C1C1E] text-2xl" />
        </div>
        <h2 className="text-[#1C1C1E] text-xl font-['Manrope'] font-bold leading-tight tracking-tight flex-1 text-center">
          Contact Us
        </h2>
        <div className="size-12 shrink-0"></div> {/* Spacer */}
      </div>

      {/* Hero Section */}
      <div className="px-6 py-12 bg-white">
        <h1 className="text-[#007BFF] text-4xl font-['Manrope'] font-bold leading-tight tracking-tight text-center pb-4">
          Get in Touch
        </h1>
        <p className="text-[#6B7280] text-lg font-['Work_Sans'] font-light leading-relaxed text-center max-w-2xl mx-auto">
          We're here to help. Choose the best way to reach us below.
        </p>
      </div>

      {/* Segmented Buttons */}
      <div className="flex px-6 py-6 bg-white border-b border-gray-200">
        <div className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-gray-100 p-1.5 max-w-md mx-auto">
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-4 text-base font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
              userType === 'students'
                ? 'bg-white shadow-md text-[#007BFF]'
                : 'text-[#6B7280] hover:text-[#1C1C1E]'
            }`}
          >
            <span className="truncate">Students</span>
            <input
              type="radio"
              name="user_type_toggle"
              value="students"
              checked={userType === 'students'}
              onChange={() => setUserType('students')}
              className="invisible w-0"
            />
          </label>
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-4 text-base font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
              userType === 'owners'
                ? 'bg-white shadow-md text-[#007BFF]'
                : 'text-[#6B7280] hover:text-[#1C1C1E]'
            }`}
          >
            <span className="truncate">Property Owners</span>
            <input
              type="radio"
              name="user_type_toggle"
              value="owners"
              checked={userType === 'owners'}
              onChange={() => setUserType('owners')}
              className="invisible w-0"
            />
          </label>
        </div>
      </div>

      {/* Contact Form Section */}
      <form onSubmit={handleSubmit} className="px-6 py-12 space-y-6 bg-white max-w-3xl mx-auto w-full">
        {/* Full Name TextField */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3">Full Name</p>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
            placeholder="Enter your full name"
          />
        </label>

        {/* Email Address TextField */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3">Email Address</p>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
            placeholder="Enter your email address"
          />
        </label>

        {/* Dropdown Selector */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3">Topic</p>
          <div className="relative">
            <select
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] h-14 p-4 text-base font-['Work_Sans'] font-light leading-normal shadow-sm transition-all duration-200"
            >
              <option>Booking Inquiry</option>
              <option>Technical Support</option>
              <option>Listing Help</option>
              <option>General Question</option>
            </select>
            <MaterialIcon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none text-2xl" />
          </div>
        </label>

        {/* Text Area */}
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#1C1C1E] text-base font-['Manrope'] font-semibold leading-normal pb-3">Message</p>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1C1C1E] focus:outline-0 focus:ring-2 focus:ring-[#007BFF]/50 border border-gray-300 bg-white focus:border-[#007BFF] placeholder:text-gray-400 p-4 text-base font-['Work_Sans'] font-light leading-relaxed shadow-sm transition-all duration-200"
            placeholder="Write your message here..."
            rows={6}
          />
        </label>

        {/* CTA Button */}
        <button
          type="submit"
          className="flex items-center justify-center w-full h-16 px-8 mt-6 text-lg font-['Manrope'] font-semibold text-white bg-[#007BFF] rounded-2xl hover:bg-[#0056D6] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,123,255,0.25)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/50 transition-all duration-200 shadow-[0_8px_16px_rgba(0,123,255,0.2)]"
        >
          Send Message
        </button>
      </form>

      {/* Click-to-Action List Items */}
      <div className="px-6 py-12 bg-[#FAFAFA]">
        <div className="space-y-4 max-w-3xl mx-auto">
          <a
            className="flex items-center p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#007BFF] hover:shadow-lg transition-all duration-200 shadow-md"
            href="tel:+233501234567"
          >
            <div className="flex items-center justify-center size-12 bg-[#007BFF] rounded-xl mr-5 shadow-md">
              <MaterialIcon name="call" className="text-white text-2xl" />
            </div>
            <span className="flex-1 text-[#1C1C1E] font-['Manrope'] font-semibold text-lg">Call Us</span>
            <MaterialIcon name="chevron_right" className="text-[#6B7280] text-2xl" />
          </a>
          <a
            className="flex items-center p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#007BFF] hover:shadow-lg transition-all duration-200 shadow-md"
            href="mailto:support@roomie.com"
          >
            <div className="flex items-center justify-center size-12 bg-[#007BFF] rounded-xl mr-5 shadow-md">
              <MaterialIcon name="email" className="text-white text-2xl" />
            </div>
            <span className="flex-1 text-[#1C1C1E] font-['Manrope'] font-semibold text-lg">Email Us</span>
            <MaterialIcon name="chevron_right" className="text-[#6B7280] text-2xl" />
          </a>
        </div>
        <div className="text-center mt-8 text-base text-[#6B7280] font-['Work_Sans'] font-light">
          <p>Office Hours: Mon - Fri, 9:00 AM - 5:00 PM</p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="px-6 py-12 text-center bg-white">
        <h3 className="text-2xl font-['Manrope'] font-bold text-[#007BFF] mb-8">Follow Us</h3>
        <div className="flex justify-center space-x-8">
          <a className="text-[#6B7280] hover:text-[#007BFF] hover:-translate-y-1 transition-all duration-200" href="#">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a className="text-[#6B7280] hover:text-[#007BFF] hover:-translate-y-1 transition-all duration-200" href="#">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a className="text-[#6B7280] hover:text-[#007BFF] hover:-translate-y-1 transition-all duration-200" href="#">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 4.22c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.163 1.943c-1.049.045-1.71.218-2.227.421-.585.223-1.04.54-1.503.996-.463.456-.774.918-.996 1.503-.203.517-.375 1.178-.42 2.227-.045 1.025-.058 1.35-.058 3.659 0 2.309.013 2.633.058 3.659.045 1.049.218 1.71.42 2.227.223.585.54 1.04.996 1.503.456.463.918.774 1.503.996.517.203 1.178.375 2.227.42 1.025.045 1.35.058 3.659.058 2.309 0 2.633-.013 3.659-.058 1.049-.045 1.71-.218 2.227-.42.585-.223 1.04-.54 1.503-.996.463-.456.774-.918.996-1.503.203-.517.375-1.178.42-2.227.045-1.025.058-1.35.058-3.659 0-2.309-.013-2.633-.058-3.659-.045-1.049-.218-1.71-.42-2.227-.223-.585-.54-1.04-.996-1.503-.456-.463-.918-.774-1.503-.996-.517-.203-1.178-.375-2.227-.42-1.025-.045-1.35-.058-3.659-.058s-2.633.013-3.659.058zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-20 bg-[#FAFAFA]">
        <h3 className="text-4xl font-['Manrope'] font-bold text-[#007BFF] mb-10 text-center">Frequently Asked Questions</h3>
        <div className="space-y-4 max-w-3xl mx-auto">
          <details className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">
              How do I book a property?
              <span className="transition-transform duration-200 group-open:rotate-180 text-[#6B7280]">
                <MaterialIcon name="expand_more" className="text-2xl" />
              </span>
            </summary>
            <p className="mt-5 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
              You can book a property by navigating to the listing page, selecting your desired dates, and clicking the 'Request to Book' button. The property owner will then review your request.
            </p>
          </details>
          <details className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">
              What are the payment options?
              <span className="transition-transform duration-200 group-open:rotate-180 text-[#6B7280]">
                <MaterialIcon name="expand_more" className="text-2xl" />
              </span>
            </summary>
            <p className="mt-5 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
              We accept major credit cards, debit cards, and bank transfers. All payments are processed securely through our platform.
            </p>
          </details>
          <details className="group rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <summary className="flex cursor-pointer list-none items-center justify-between font-['Manrope'] font-semibold text-[#1C1C1E] text-lg">
              How do I list my property?
              <span className="transition-transform duration-200 group-open:rotate-180 text-[#6B7280]">
                <MaterialIcon name="expand_more" className="text-2xl" />
              </span>
            </summary>
            <p className="mt-5 text-[#6B7280] font-['Work_Sans'] font-light text-base leading-relaxed">
              If you're a property owner, please select the 'Property Owners' tab at the top of this page to find dedicated support resources and contact information for listing your property with us.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Contact;

