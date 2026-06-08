import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Pricing Content Component
export const PricingContent: React.FC = () => {
  const [pricingType, setPricingType] = React.useState<'students' | 'owners'>('students');

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">
          Pricing
        </p>
        <h1 className="mt-3 text-2xl font-['Manrope'] font-bold leading-tight text-[#111318]">
          Simple, transparent pricing for students and owners.
        </h1>
        <p className="mt-4 text-sm text-[#4B5563] leading-relaxed">
          No hidden fees. No surprise charges. Just a clear view of how money moves through ROOMie.
        </p>

        {/* Segmented toggle */}
        <div className="mt-6 flex justify-center">
          <div className="flex h-11 flex-1 max-w-md items-center justify-center rounded-2xl bg-gray-100 p-1.5">
            <label
              className={`flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 text-sm font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
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
              className={`flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 text-sm font-['Manrope'] font-semibold leading-normal transition-all duration-200 ${
                pricingType === 'owners'
                  ? 'bg-white text-[#007BFF]'
                  : 'text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              <span className="truncate">For owners</span>
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

        {pricingType === 'students' ? (
          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-['Manrope'] font-bold text-[#111318]">For students</h2>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="real_estate_agent" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm font-['Manrope'] font-semibold text-[#111318]">Rental costs</h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-[#4B5563] leading-relaxed">
                <li><span className="font-semibold">Rent amount.</span> Set by the property owner.</li>
                <li><span className="font-semibold">First payment.</span> Paid through ROOMie to secure booking.</li>
                <li><span className="font-semibold">After move in.</span> Later payments to owner directly.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="verified_user" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm font-['Manrope'] font-semibold text-[#111318]">ROOMie booking fee</h3>
              </div>
              <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                One-time <span className="font-semibold text-[#007BFF]">GHS 100 booking fee</span> when you secure a room.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#4B5563]">
                <li>Safety checks & verification</li>
                <li>Support team assistance</li>
                <li>Secure payment processing</li>
              </ul>
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-['Manrope'] font-bold text-[#111318]">For property owners</h2>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="campaign" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm font-['Manrope'] font-semibold text-[#111318]">Listing fees</h3>
              </div>
              <p className="mt-3 text-sm text-[#4B5563]">
                Listing your property is <span className="font-semibold text-[#007BFF]">completely free</span>.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <MaterialIcon name="percent" className="text-lg text-[#007BFF]" />
                </div>
                <h3 className="text-sm font-['Manrope'] font-semibold text-[#111318]">Commission on bookings</h3>
              </div>
              <p className="mt-3 text-sm text-[#4B5563]">
                Small commission only when you get a verified booking. No upfront costs.
              </p>
            </div>
          </section>
        )}
      </div>
      <div className="h-6" />
    </div>
  );
};

// HelpFAQ Content Component
export const HelpFAQContent: React.FC = () => {
  const faqSections = [
    { title: 'Getting Started', description: 'How to verify student status, booking process, payments, and what "Verified Property" means.' },
    { title: 'Searching & Booking', description: 'How to search, booking fees, cancellation policies.' },
    { title: 'Account & Profile', description: 'Manage account, update profile, change password.' },
    { title: 'Payments & Fees', description: 'Payment methods, security, fee structure, refunds.' },
    { title: 'Safety & Verification', description: 'Property verification, student checks, community guidelines.' },
    { title: 'For Property Owners', description: 'Listing properties, managing bookings, receiving payments.' },
  ];

  const contactOptions = [
    { icon: 'forum', title: 'Live Chat', subtitle: '9am-5pm', href: '#' },
    { icon: 'mail', title: 'Email', subtitle: 'Reply within 24h', href: 'mailto:support@roomie.com' },
    { icon: 'call', title: 'Call', subtitle: 'Mon-Fri 9am-5pm', href: 'tel:+233501234567' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#F2F2F7]">
      {/* Search Bar */}
      <div className="px-4 py-4 bg-white sticky top-0 z-10">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#8E8E93] flex border-none bg-[#F2F2F7] items-center justify-center pl-4 rounded-l-lg">
              <MaterialIcon name="search" className="text-2xl" />
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1C1C1E] focus:outline-0 border-none bg-[#F2F2F7] h-full placeholder:text-[#8E8E93] px-4 pl-2 text-base font-['Work_Sans'] font-light"
              placeholder="What can we help you with?"
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
              <p className="text-[#1C1C1E] text-base font-semibold">{section.title}</p>
              <div className="text-[#8E8E93] group-open:rotate-180 transition-transform duration-300">
                <MaterialIcon name="expand_more" className="text-2xl" />
              </div>
            </summary>
            <div className="text-[#8E8E93] text-sm font-['Work_Sans'] font-light pt-2 pb-2 border-t border-gray-200 mt-2">
              {section.description}
            </div>
          </details>
        ))}
      </div>

      {/* Contact Section */}
      <div className="pt-6 pb-4">
        <h2 className="text-[#8E8E93] text-sm font-bold uppercase px-4 pb-2 text-center">
          Still need help?
        </h2>
        <div className="flex flex-col gap-px bg-gray-200">
          {contactOptions.map((option, index) => (
            <a
              key={index}
              className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between hover:bg-gray-50"
              href={option.href}
            >
              <div className="flex items-center gap-4">
                <div className="text-[#007BFF] flex items-center justify-center rounded-full bg-[#007BFF]/10 size-12">
                  <MaterialIcon name={option.icon} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#1C1C1E] text-base font-semibold">{option.title}</p>
                  <p className="text-[#8E8E93] text-sm font-['Work_Sans'] font-light">{option.subtitle}</p>
                </div>
              </div>
              <MaterialIcon name="chevron_right" className="text-[#8E8E93] text-2xl" />
            </a>
          ))}
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
};

// HowItWorks Content Component
export const HowItWorksContent: React.FC = () => {
  const steps = [
    { icon: 'person', title: '1. Create your ROOMie account', desc: 'Use your student email to sign up. Short form, quick start.' },
    { icon: 'verified', title: '2. Verify you\'re a real student', desc: 'Simple proof of enrollment. Owners know you\'re genuine.' },
    { icon: 'home', title: '3. Browse verified rooms', desc: 'See washroom type, utilities, water reliability up front.' },
    { icon: 'payments', title: '4. Book and pay through ROOMie', desc: 'Secure payment held until move-in. Both sides protected.' },
    { icon: 'favorite', title: '5. Live, renew, repeat', desc: 'Keep bookings, receipts, renewals in one place.' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">
          How ROOMie works
        </p>
        <h1 className="mt-3 text-2xl font-semibold leading-tight text-[#111318]">
          A safer way to find a room, designed for students.
        </h1>
        <p className="mt-4 text-sm text-[#4B5563] leading-relaxed">
          Tired of guessing games and fake listings? We verify properties and keep your money protected.
        </p>

        <div className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF]">
                <MaterialIcon name={step.icon} className="text-base text-[#007BFF]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#111318]">{step.title}</h2>
                <p className="mt-1 text-sm text-[#4B5563] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Link to="/register">
            <button className="w-full h-11 rounded-full bg-[#007BFF] text-sm font-medium text-white hover:bg-[#0056D6]">
              Get started as a student
            </button>
          </Link>
          <Link to="/owner-landing">
            <button className="w-full h-11 rounded-full border border-gray-300 text-sm font-medium text-[#111318] hover:border-[#111318]">
              I'm a property owner
            </button>
          </Link>
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
};

// Mobile Drawer Trigger Component
interface MobileDrawerTriggerProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title: string;
  fullPageLink: string;
}

export const MobileDrawerTrigger: React.FC<MobileDrawerTriggerProps> = ({
  children,
  content,
  title,
  fullPageLink,
}) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On desktop, just render a Link
  if (!isMobile) {
    return <Link to={fullPageLink}>{children}</Link>;
  }

  // On mobile, render a Sheet drawer
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className="text-left w-full">
          {children}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-lg font-semibold text-[#111318]">{title}</h2>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
          >
            <MaterialIcon name="close" className="text-xl text-[#6B7280]" />
          </button>
        </div>
        {/* Drawer Content */}
        <div className="flex-1 overflow-hidden">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
};
