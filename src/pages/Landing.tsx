import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import Logo from '@/components/common/Logo';
import {
  MobileDrawerTrigger,
  PricingContent,
  HelpFAQContent,
  HowItWorksContent,
} from '@/components/mobile-drawers/MobilePageDrawers';

// Material Symbols Icon Component
const MaterialIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const Landing: React.FC = () => {
  const [scrollY, setScrollY] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroScale = Math.max(0.85, 1 - scrollY * 0.0005);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-['Work_Sans'] font-light text-[#1C1C1E]">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <nav className="hidden md:flex items-center gap-6 text-sm text-[#4B5563]">
              <Link to="/landing" className="hover:text-[#111318] transition-colors">Home</Link>
              <Link to="/student/properties" className="hover:text-[#111318] transition-colors">For students</Link>
              <Link to="/owner-landing" className="hover:text-[#111318] transition-colors">For owners</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                className="h-9 px-4 text-sm text-[#111318] hover:bg-gray-100 rounded-full"
              >
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="h-9 sm:h-10 px-5 text-sm rounded-full bg-[#007BFF] hover:bg-[#0056D6] text-white">
                Get started
              </Button>
            </Link>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 h-9 w-9 md:hidden text-[#4B5563] hover:bg-gray-50"
            >
              <MaterialIcon name={isMobileMenuOpen ? "close" : "menu"} className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-30 bg-white border-b border-gray-200 shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              to="/landing"
              className="px-4 py-3 text-sm text-[#4B5563] hover:text-[#111318] hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/student/properties"
              className="px-4 py-3 text-sm text-[#4B5563] hover:text-[#111318] hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For students
            </Link>
            <Link
              to="/owner-landing"
              className="px-4 py-3 text-sm text-[#4B5563] hover:text-[#111318] hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              For owners
            </Link>
            <hr className="border-gray-200" />
            <Link
              to="/login"
              className="px-4 py-3 text-sm text-[#4B5563] hover:text-[#111318] hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12 text-center">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#007BFF] uppercase">
              Built by a frustrated student, for students
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#111318]">
              Finding a room shouldn&apos;t feel like a gamble.
            </h1>
            <p className="mt-4 text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto">
              ROOMie was born after one too many fake listings, surprise fees and last-minute disappointments.
              It&apos;s the student-built way to find verified rooms near your campus with clear pricing and a booking
              flow you can actually trust.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button className="h-11 px-6 rounded-full bg-[#007BFF] hover:bg-[#0056D6] text-sm font-semibold">
                  Find a room
                </Button>
              </Link>
              <Link to="/owner-landing">
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-full border-gray-300 text-sm font-semibold text-[#111318] bg-white hover:bg-gray-50"
                >
                  List a property
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5HUMxRFnIyAG8-e2Wu7i2G71CZFhEps38IGn9Ixi7OfXIi5Yd4SV_L9DbSBSJ69sEqt_qitn0zZj8rrZ14RFR2GC9VGsfkSEks5gQKXbb_kCZSj-IQi_yD5F2fpOLDwKII88LovtDC-c35UkflCrzp9CaefFDA2oIJPfKEsKrQLifHWMAHHZ3b4Hk6aKG7JIL5p-Il-VJTENvQmFjG2-cHt5Nlxi3mD1knlsIw__ZegtyGE7Qn3axSrVCVcc_UpPEWyBg8GQZWBKm"
              alt="Students standing outside a ROOMie property"
              className="w-full h-[280px] md:h-[380px] lg:h-[440px] object-cover transition-transform duration-100 ease-out will-change-transform"
              style={{ transform: `scale(${heroScale})` }}
            />
          </div>
        </section>

        {/* Why ROOMie exists */}
        <section className="border-t border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 grid gap-10 lg:grid-cols-[1.3fr,1fr] items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#111318]">
                Built from the pain of almost losing a semester.
              </h2>
              <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
                ROOMie started as a desperate search for a safe, affordable room close to campus.
                After fake photos, ghosted landlords and "small" fees that doubled the budget,
                the only option left was to build a better way  one that puts students first.
              </p>
            </div>
            <div className="space-y-4 text-sm text-[#4B5563]">
              <div className="flex items-start gap-3">
                <MaterialIcon name="block" className="mt-0.5 text-[#DC2626]" />
                <p>No more sending money to strangers on WhatsApp and hoping the room is real.</p>
              </div>
              <div className="flex items-start gap-3">
                <MaterialIcon name="visibility_off" className="mt-0.5 text-[#F97316]" />
                <p>No more hidden agent charges that appear the week before school reopens.</p>
              </div>
              <div className="flex items-start gap-3">
                <MaterialIcon name="verified" className="mt-0.5 text-[#16A34A]" />
                <p>Every property on ROOMie goes through verification so you know what you're walking into.</p>
              </div>
            </div>
          </div>
        </section>


        {/* How ROOMie works */}
        <section className="bg-[#F9FAFB] border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#111318] text-center">
              How ROOMie works for students
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3 text-left">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#9CA3AF] uppercase">Step 1</p>
                <h3 className="text-base font-semibold text-[#111318]">Browse verified rooms</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Filter by campus, price and room type. Every listing shows what&apos;s included  washroom,
                  utilities and water situation.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#9CA3AF] uppercase">Step 2</p>
                <h3 className="text-base font-semibold text-[#111318]">Book with peace of mind</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Complete student verification once, choose your duration, and pay securely with mobile money.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#9CA3AF] uppercase">Step 3</p>
                <h3 className="text-base font-semibold text-[#111318]">Move in, then we pay the owner</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Your first payment is released to the owner after you move in, so everyone is protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For owners */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#111318]">
                For owners who actually care about students.
              </h2>
              <p className="mt-4 text-sm md:text-base text-[#4B5563] leading-relaxed">
                ROOMie connects you to verified students, handles payments and gives you a clear dashboard of
                bookings and payouts.
              </p>
            </div>
            <div className="border border-gray-200 bg-[#F9FAFB] p-6 space-y-3 text-sm text-[#4B5563]">
              <div className="flex items-start gap-3">
                <MaterialIcon name="group" className="mt-0.5 text-[#007BFF]" />
                <p>Reach students across campuses without dealing with middlemen.</p>
              </div>
              <div className="flex items-start gap-3">
                <MaterialIcon name="payments" className="mt-0.5 text-[#007BFF]" />
                <p>Transparent commission: 5% + 100 GHS per booking, automatically handled.</p>
              </div>
              <div className="flex items-start gap-3">
                <MaterialIcon name="dashboard" className="mt-0.5 text-[#007BFF]" />
                <p>Track occupancy, bookings and payouts in one place.</p>
              </div>
              <Link to="/owner-landing" className="inline-flex pt-2">
                <Button className="h-9 px-4 text-xs rounded-full bg-[#111318] hover:bg-black text-white">
                  Learn more for owners
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className="bg-[#0B1120] text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              Let&apos;s make "where will I stay?" the easiest part of uni.
            </h2>
            <p className="mt-4 text-sm md:text-base text-[#E5E7EB] max-w-2xl mx-auto leading-relaxed">
              ROOMie is what happens when a student gets tired of almost being homeless every semester and decides
              to fix the system. Join in.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button className="h-11 px-6 rounded-full bg-white text-[#111318] text-sm font-semibold hover:bg-[#E5E7EB]">
                  Find a room
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-full border-white/40 text-sm font-semibold text-white bg-transparent hover:bg-white/10"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-8 px-6 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {/* ROOMie Column */}
              <div>
                <h3 className="text-[#007BFF] text-lg font-['Manrope'] font-bold mb-2">ROOMie</h3>
                <p className="text-[#6B7280] font-['Work_Sans'] font-light text-sm leading-relaxed">
                  Student accommodation made easy. Find verified properties in minutes.
                </p>
              </div>

              {/* Students Column */}
              <div>
                <h4 className="text-[#1C1C1E] font-['Manrope'] font-semibold mb-2 text-sm">Students</h4>
                <ul className="space-y-2 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                  <li>
                    <Link to="/register" className="hover:text-[#007BFF] transition-colors duration-200">
                      Find a Room
                    </Link>
                  </li>
                  <li>
                    <Link to="/student/properties" className="hover:text-[#007BFF] transition-colors duration-200">
                      Browse Properties
                    </Link>
                  </li>
                  <li>
                    <MobileDrawerTrigger
                      content={<HowItWorksContent />}
                      title="How It Works"
                      fullPageLink="/how-it-works"
                    >
                      <span className="hover:text-[#007BFF] transition-colors duration-200 cursor-pointer">
                        How It Works
                      </span>
                    </MobileDrawerTrigger>
                  </li>
                  <li>
                    <MobileDrawerTrigger
                      content={<HelpFAQContent />}
                      title="Help & FAQ"
                      fullPageLink="/help-faq"
                    >
                      <span className="hover:text-[#007BFF] transition-colors duration-200 cursor-pointer">
                        Support
                      </span>
                    </MobileDrawerTrigger>
                  </li>
                </ul>
              </div>

              {/* Owners Column */}
              <div>
                <h4 className="text-[#1C1C1E] font-['Manrope'] font-semibold mb-2 text-sm">Owners</h4>
                <ul className="space-y-2 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                  <li>
                    <Link to="/owner-landing" className="hover:text-[#007BFF] transition-colors duration-200">
                      List Your Property
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/dashboard" className="hover:text-[#007BFF] transition-colors duration-200">
                      Owner Dashboard
                    </Link>
                  </li>
                  <li>
                    <MobileDrawerTrigger
                      content={<PricingContent />}
                      title="Pricing"
                      fullPageLink="/pricing"
                    >
                      <span className="hover:text-[#007BFF] transition-colors duration-200 cursor-pointer">
                        Pricing
                      </span>
                    </MobileDrawerTrigger>
                  </li>
                  <li>
                    <Link to="/resources" className="hover:text-[#007BFF] transition-colors duration-200">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="text-[#1C1C1E] font-['Manrope'] font-semibold mb-2 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                  <li>
                    <Link to="/about" className="hover:text-[#007BFF] transition-colors duration-200">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/trust-safety" className="hover:text-[#007BFF] transition-colors duration-200">
                      Trust &amp; Safety
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#007BFF] transition-colors duration-200">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/transparency" className="hover:text-[#007BFF] transition-colors duration-200">
                      Transparency
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 pt-4 text-center">
              <p className="text-[#6B7280] font-['Work_Sans'] font-light text-sm">
                © 2025 ROOMie. All rights reserved.
              </p>
              <div className="mt-2 text-sm text-[#6B7280] font-['Work_Sans'] font-light">
                <Link to="/transparency" className="hover:text-[#007BFF] transition-colors duration-200">
                  Transparency
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
