import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, UserGroupIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white font-['Poppins']">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white"></div>
        <div className="absolute inset-0 bg-grid-indigo-900/[0.03] bg-[size:60px_60px]"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Logo/Brand */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 shadow-lg mb-6">
                <BookOpenIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-indigo-900 mb-6 font-['Montserrat'] tracking-tight">
                Digital Library
              </h1>
              <p className="text-xl md:text-2xl text-indigo-600 max-w-2xl mx-auto font-['Inter'] leading-relaxed">
                Your gateway to knowledge and learning resources
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Link 
                href="/auth" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-xl overflow-hidden transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 min-w-[200px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500"></span>
                <span className="relative flex items-center">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 motion-safe:animate-[float_7s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 motion-safe:animate-[float_7s_ease-in-out_infinite_2s]"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 motion-safe:animate-[float_7s_ease-in-out_infinite_4s]"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-indigo-50 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-indigo-900 font-['Montserrat']">IPT Digital Library</h4>
              <p className="text-indigo-600 font-['Inter']">Empowering education through digital resources</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-indigo-900 font-['Montserrat']">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/about" 
                    className="text-indigo-600 hover:text-indigo-900 transition-colors inline-flex items-center font-['Inter']"
                  >
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-indigo-600 hover:text-indigo-900 transition-colors inline-flex items-center font-['Inter']"
                  >
                    Get Support
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-indigo-600 hover:text-indigo-900 transition-colors inline-flex items-center font-['Inter']"
                  >
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4 text-indigo-900 font-['Montserrat']">Contact Us</h4>
              <p className="text-indigo-600 font-['Inter']">Email: nash@gmail.com</p>
              <p className="text-indigo-600 font-['Inter']">Phone: 123421</p>
            </div>
          </div>
          <div className="border-t border-indigo-100 mt-8 pt-8 text-center">
            <p className="text-indigo-600 font-['Inter']">© {new Date().getFullYear()}Digital Library. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
