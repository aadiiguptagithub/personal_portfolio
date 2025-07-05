import React from "react";
import { logo } from "../assets";

const Footer = () => {
  return (
    <footer className="w-full bg-tertiary text-white-100 font-medium px-4 pt-10 pb-6 mt-10 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[90vw] h-40 rounded-full blur-3xl opacity-60" style={{background: "radial-gradient(ellipse at center, rgba(145,94,255,0.4) 0%, rgba(21,16,48,0.8) 100%)"}}></div>
      </div>
      {/* Subscription Section */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl p-1 mb-10" style={{background: "radial-gradient(ellipse at center, rgba(145,94,255,0.3) 0%, rgba(21,16,48,1) 100%)"}}>
        <div className="flex flex-col md:flex-row items-center justify-between bg-tertiary rounded-2xl p-6 gap-6">
          <div className="text-2xl md:text-1xl font-black text-white text-center md:text-left">
          Bring your ideas to life with clean & <br className="hidden md:block" /> modern web solutions.
          </div>
          <form className="flex w-full max-w-xs sm:max-w-sm md:max-w-xl flex-col xs:flex-row gap-3 xs:gap-0 mt-4 md:mt-0 mx-auto">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 px-4 py-3 rounded-t-lg xs:rounded-l-lg xs:rounded-t-none outline-none text-black text-base bg-white min-w-0"
              style={{fontFamily: 'Poppins, sans-serif'}}
            />
            <button
              type="submit"
              className="w-full xs:w-auto px-6 py-3 bg-[#915EFF] text-white font-bold rounded-b-lg xs:rounded-r-lg xs:rounded-b-none hover:bg-[#7a4eea] transition-colors duration-200"
              style={{fontFamily: 'Poppins, sans-serif'}}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      {/* Footer Links Section */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-left pb-8">
        <div>
          <div className="font-bold mb-2">Company</div>
          <ul className="space-y-1">
            <li><a href="#about" className="hover:text-[#915EFF] transition-colors duration-200">About</a></li>
            <li><a href="#features" className="hover:text-[#915EFF] transition-colors duration-200">Features</a></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Help</div>
          <ul className="space-y-1">
            <li><a href="#support" className="hover:text-[#915EFF] transition-colors duration-200">Customer Support</a></li>
            <li><a href="#delivery" className="hover:text-[#915EFF] transition-colors duration-200">Delivery Details</a></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Resources</div>
          <ul className="space-y-1">
            <li><a href="#ebooks" className="hover:text-[#915EFF] transition-colors duration-200">Free eBooks</a></li>
            <li><a href="#tutorial" className="hover:text-[#915EFF] transition-colors duration-200">Development Tutorial</a></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Links</div>
          <ul className="space-y-1">
            <li><a href="#ebooks" className="hover:text-[#915EFF] transition-colors duration-200">Free eBooks</a></li>
            <li><a href="#tutorial" className="hover:text-[#915EFF] transition-colors duration-200">Development Tutorial</a></li>
          </ul>
        </div>
      </div>
      {/* Logo and Copyright */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto pt-4 border-t border-white-100/10">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-lg">Aditya</span>
        </div>
        <span className="text-secondary text-sm">&copy; {new Date().getFullYear()} Aditya. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;