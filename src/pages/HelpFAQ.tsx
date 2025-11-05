import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const HelpFAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const faqSections = [
    {
      title: 'Getting Started',
      description: 'Here you will find answers to questions like: How do I verify my student status? What is the booking process like? How are payments handled? What does \'Verified Property\' mean?'
    },
    {
      title: 'Searching & Booking',
      description: 'Here you will find answers to questions like: How do I search for properties? What are the booking fees? Can I cancel a booking?'
    },
    {
      title: 'Account & Profile',
      description: 'Find answers on how to manage your account, update your profile information, and change your password.'
    },
    {
      title: 'Payments & Fees',
      description: 'Learn about our payment methods, security, fee structure, and refund policies.'
    },
    {
      title: 'Safety & Verification',
      description: 'Your safety is our priority. Read about our property verification process, student status checks, and community guidelines.'
    },
    {
      title: 'For Property Owners',
      description: 'Information for our partners on listing a property, managing bookings, and receiving payments.'
    }
  ];

  const contactOptions = [
    {
      icon: 'forum',
      title: 'Live Chat',
      subtitle: 'Available 9am-5pm',
      href: '#'
    },
    {
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'We\'ll reply within 24 hours',
      href: 'mailto:support@roomie.com'
    },
    {
      icon: 'call',
      title: 'Call Us',
      subtitle: 'Mon-Fri, 9am-5pm',
      href: 'tel:+233501234567'
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F2F2F7] font-['Manrope']">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-white p-3 justify-between border-b border-gray-200">
        <div 
          className="flex size-10 shrink-0 items-center justify-center cursor-pointer text-[#1C1C1E]"
          onClick={() => navigate(-1)}
        >
          <MaterialIcon name="arrow_back" className="text-2xl" />
        </div>
        <h1 className="text-[#1C1C1E] text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Help & FAQ
        </h1>
      </header>

      <main className="flex-grow">
        {/* Search Bar */}
        <div className="px-4 py-4 bg-white">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#8E8E93] flex border-none bg-[#F2F2F7] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <MaterialIcon name="search" className="text-2xl" />
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1C1C1E] focus:outline-0 focus:ring-0 border-none bg-[#F2F2F7] h-full placeholder:text-[#8E8E93] px-4 pl-2 text-base font-['Work_Sans'] font-light leading-normal" 
                placeholder="What can we help you with?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col p-4 gap-3">
          {faqSections.map((section, index) => (
            <details 
              key={index}
              className="flex flex-col rounded-lg border border-gray-200 bg-white px-4 py-2 group"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2">
                <p className="text-[#1C1C1E] text-base font-semibold leading-normal">
                  {section.title}
                </p>
                <div className="text-[#8E8E93] group-open:rotate-180 transition-transform duration-300">
                  <MaterialIcon name="expand_more" className="text-2xl" />
                </div>
              </summary>
              <div className="text-[#8E8E93] text-sm font-['Work_Sans'] font-light leading-normal pt-2 pb-2 border-t border-gray-200 mt-2">
                {section.description}
              </div>
            </details>
          ))}
        </div>

        {/* Contact Section */}
        <div className="pt-6 pb-4">
          <h2 className="text-[#8E8E93] text-sm font-bold uppercase leading-normal tracking-wider px-4 pb-2 text-center">
            Still need help?
          </h2>
          <div className="flex flex-col gap-px bg-gray-200">
            {contactOptions.map((option, index) => (
              <a 
                key={index}
                className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between hover:bg-gray-50 transition-colors" 
                href={option.href}
              >
                <div className="flex items-center gap-4">
                  <div className="text-[#007BFF] flex items-center justify-center rounded-full bg-[#007BFF]/10 shrink-0 size-12">
                    <MaterialIcon name={option.icon} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#1C1C1E] text-base font-semibold leading-normal line-clamp-1">
                      {option.title}
                    </p>
                    <p className="text-[#8E8E93] text-sm font-['Work_Sans'] font-light leading-normal line-clamp-2">
                      {option.subtitle}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="text-[#8E8E93] flex size-7 items-center justify-center">
                    <MaterialIcon name="chevron_right" className="text-2xl" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpFAQ;

