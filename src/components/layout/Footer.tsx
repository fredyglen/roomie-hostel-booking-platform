
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { LegalModalTrigger } from '@/components/legal/LegalModal';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1C1E] text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Top Section - Logo and Description */}
        <div className="mb-4">
          <Logo variant="white" size="sm" />
          <p className="mt-3 text-[#C7C7CC] font-['Work_Sans'] font-light text-sm max-w-md">
            ROOMie helps students find safe, affordable housing near campus with verified listings,
            virtual tours, and hassle-free booking.
          </p>
        </div>

        {/* Links Grid - Clean 4-column layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* For Students */}
          <div>
            <h3 className="text-white text-sm font-bold mb-2 font-['Manrope']">For Students</h3>
            <ul className="space-y-2 font-['Work_Sans'] font-light text-sm">
              <li><Link to="/register" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Find a Room</Link></li>
              <li><Link to="/student/properties" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Browse Properties</Link></li>
              <li><Link to="/how-it-works" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">How It Works</Link></li>
              <li><Link to="/support" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white text-sm font-bold mb-2 font-['Manrope']">For Owners</h3>
            <ul className="space-y-2 font-['Work_Sans'] font-light text-sm">
              <li><Link to="/owner-landing" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">List Your Property</Link></li>
              <li><Link to="/owner/dashboard" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Owner Dashboard</Link></li>
              <li><Link to="/pricing" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Pricing</Link></li>
              <li><Link to="/resources" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-bold mb-2 font-['Manrope']">Company</h3>
            <ul className="space-y-2 font-['Work_Sans'] font-light text-sm">
              <li><Link to="/about" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">About Us</Link></li>
              <li><Link to="/trust-safety" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Trust & Safety</Link></li>
              <li><Link to="/contact" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-bold mb-2 font-['Manrope']">Legal</h3>
            <ul className="space-y-2 font-['Work_Sans'] font-light text-sm">
              <li>
                <LegalModalTrigger
                  docType="terms"
                  label="Terms of Service"
                  className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors"
                />
              </li>
              <li>
                <LegalModalTrigger
                  docType="privacy"
                  label="Privacy Policy"
                  className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors"
                />
              </li>
              <li>
                <LegalModalTrigger
                  docType="cookies"
                  label="Cookies"
                  className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://facebook.com/roomie" target="_blank" rel="noopener noreferrer" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://twitter.com/roomie" target="_blank" rel="noopener noreferrer" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="https://instagram.com/roomie" target="_blank" rel="noopener noreferrer" className="text-[#C7C7CC] hover:text-[#007BFF] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M12 15.35a3.35 3.35 0 110-6.7 3.35 3.35 0 010 6.7zm0-8.5a5.15 5.15 0 100 10.3 5.15 5.15 0 000-10.3z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="pt-4 border-t border-[#3A3A3C]">
          <p className="text-center text-[#8E8E93] font-['Work_Sans'] font-light text-xs">
            &copy; {new Date().getFullYear()} ROOMie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
