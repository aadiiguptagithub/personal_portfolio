import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { styles } from "../../config/styles";
import { navLinks } from "../../config/constants";
import { logo, menu, close } from "../../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    
    checkAuthStatus();
    
    // Listen for storage changes (when login happens in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom login event
    window.addEventListener('loginStateChanged', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('loginStateChanged', checkAuthStatus);
    };
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('loginStateChanged'));
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}>
      <div className="w-full flex items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 mr-4"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            Aditya
          </p>
        </Link>
        {/* Centered Nav Links (Desktop) */}
        <div className="flex-1 hidden sm:flex justify-center">
          <ul className="list-none flex flex-row gap-10">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.route || `/${link.id}`}
                  className={`$${active === link.title ? "text-white" : "text-secondary"} hover:text-white text-[18px] font-medium cursor-pointer`}
                  onClick={() => setActive(link.title)}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Right Side Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Login/Logout Button */}
          <button
            onClick={handleAuthAction}
            className="bg-gradient-to-r from-pink-500 to-green-400 px-5 py-2 rounded-lg text-white font-bold shadow-md hover:scale-105 transition-transform duration-300"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
          {/* Call Button */}
          <a
            href="tel:+1234567890"
            className="relative px-6 py-2 rounded-full bg-gradient-to-r from-[#915EFF] to-[#7a4eea] text-white font-bold shadow-lg overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#915EFF] to-[#7a4eea] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></span>
            <span className="relative z-10 flex items-center gap-2 animate-pulse">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.516 2.064a2 2 0 01-.45 1.958l-1.27 1.27a16.001 16.001 0 006.586 6.586l1.27-1.27a2 2 0 011.958-.45l2.064.516A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C7.163 23 1 16.837 1 9V8a2 2 0 012-2z"></path></svg>
              Call
            </span>
          </a>
        </div>
        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex flex-1 justify-end items-center z-30">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
          {/* Mobile Sidebar Menu */}
          <div
            className={`${toggle ? "flex" : "hidden"} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[180px] z-30 rounded-xl sidebar`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.route || `/${link.id}`}
                    className={`${active === link.title ? "text-white" : "text-secondary"} font-poppins font-medium cursor-pointer text-[16px]`}
                    onClick={() => {
                      setToggle(false);
                      setActive(link.title);
                    }}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setToggle(false);
                    handleAuthAction();
                  }}
                  className="bg-gradient-to-r from-pink-500 to-green-400 px-4 py-2 rounded-lg text-white font-bold shadow-md hover:scale-105 transition-transform duration-300"
                >
                  {isLoggedIn ? 'Logout' : 'Login'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
