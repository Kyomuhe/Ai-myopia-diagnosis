import React from 'react';
import { Heart, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <h3 className="ml-2 text-lg font-bold text-blue-500">MyopiaDx</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Advancing myopia detection and treatment through AI-powered diagnostics.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} MyopiaDx. All rights reserved.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-500 flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-500 flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-500 flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-500 flex items-center">
                  <ExternalLink size={14} className="mr-2" />
                  Support Center
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase mb-4">Contact Us</h4>
            <a 
              href="mailto:support@myopiadx.com" 
              className="text-sm text-gray-600 hover:text-blue-500 flex items-center mb-2"
            >
              <Mail size={14} className="mr-2" />
              support@myopiadx.com
            </a>
            <p className="text-xs text-gray-600 mt-4">
              Made with <Heart size={12} className="inline text-red-500 mx-1" /> for ophthalmologists and optometrists worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;