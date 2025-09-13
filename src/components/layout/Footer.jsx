import React from "react";
import { motion } from "framer-motion";
import { logo } from "../../assets";

const Footer = () => {
  return (
    <footer className="w-full bg-tertiary text-white-100 font-medium px-4 pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Subscription Section with Border Light Effect */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16">
        <motion.div 
          className="relative rounded-2xl overflow-hidden p-[2px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            background: "linear-gradient(135deg, rgba(145,94,255,0.4) 0%, rgba(145,94,255,0.1) 50%, rgba(145,94,255,0.4) 100%)"
          }}
        >
          {/* Animated border light */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div 
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#915EFF] to-transparent"
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#915EFF] to-transparent"
              initial={{ x: "100%" }}
              whileInView={{ x: "-100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#915EFF] to-transparent"
              initial={{ y: "-100%" }}
              whileInView={{ y: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="absolute right-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#915EFF] to-transparent"
              initial={{ y: "100%" }}
              whileInView={{ y: "-100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              viewport={{ once: true }}
            />
          </div>
          
          <div className="bg-tertiary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div 
              className="text-2xl md:text-3xl font-black text-white text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Bring your ideas to life with clean & <br className="hidden md:block" /> modern web solutions.
            </motion.div>
            
            <motion.form 
              className="flex w-full max-w-xs sm:max-w-sm md:max-w-xl flex-col xs:flex-row gap-3 xs:gap-0 mt-4 md:mt-0 mx-auto"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-1 px-4 py-3 rounded-t-lg xs:rounded-l-lg xs:rounded-t-none outline-none text-black text-base bg-white min-w-0"
                style={{fontFamily: 'Poppins, sans-serif'}}
              />
              <motion.button
                type="submit"
                className="w-full xs:w-auto px-6 py-3 bg-[#915EFF] text-white font-bold rounded-b-lg xs:rounded-r-lg xs:rounded-b-none hover:bg-[#7a4eea] transition-colors duration-200 relative overflow-hidden"
                style={{fontFamily: 'Poppins, sans-serif'}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Subscribe</span>
                <span className="absolute inset-0 bg-[#7a4eea] opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>

      {/* Footer Links Section */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-left pb-12">
        {["Company", "Help", "Resources", "Links"].map((title, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="font-bold mb-4 text-lg text-[#915EFF]">{title}</div>
            <ul className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href="#" 
                    className="hover:text-[#915EFF] transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-[#915EFF] opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {title === "Company" && i === 0 ? "About" : 
                     title === "Company" && i === 1 ? "Features" : 
                     title === "Help" && i === 0 ? "Customer Support" : 
                     title === "Help" && i === 1 ? "Delivery Details" : 
                     title === "Resources" && i === 0 ? "Free eBooks" : 
                     title === "Resources" && i === 1 ? "Development Tutorial" : 
                     title === "Links" && i === 0 ? "Portfolio" : "Contact"}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Logo and Copyright */}
      <motion.div 
        className="relative z-10 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto pt-8 border-t border-white-100/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="flex items-center gap-2 mb-4 sm:mb-0"
          whileHover={{ scale: 1.05 }}
        >
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-xl">Aditya</span>
        </motion.div>
        
        <div className="flex gap-4 mb-4 sm:mb-0">
          {["twitter", "github", "linkedin", "dribbble"].map((social) => (
            <motion.a
              key={social}
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#915EFF] transition-colors duration-200"
              whileHover={{ y: -3 }}
            >
              <span className="text-white">
                {/* Icon would go here */}
              </span>
            </motion.a>
          ))}
        </div>
        
        <span className="text-secondary text-sm">
          &copy; {new Date().getFullYear()} Aditya. All rights reserved.
        </span>
      </motion.div>
    </footer>
  );
};

export default Footer;