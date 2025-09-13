import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { styles } from "../../config/styles";
import { ComputersCanvas } from "../canvas";
import { useHome } from "../context/HomeContext";
import { heroAPI, resumeAPI } from "../../services/api";
import Loader from "../ui/Loader";

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const controls = useAnimation();
  const textControls = useAnimation();

  // Fetch hero data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await heroAPI.getHero();
        setHeroData(response.data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // Set default data on error
        setHeroData({
          name: 'Your Name',
          title: 'I develop web applications, user interfaces and digital experiences',
          profileImage: '',
          backgroundImage: '',
          socialLinks: {
            github: 'https://github.com/username',
            linkedin: 'https://linkedin.com/in/username'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Fetch resume data when modal opens
  const fetchResumeData = async () => {
    try {
      setResumeLoading(true);
      const response = await resumeAPI.getResume();
      setResumeData(response.data);
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleResumeClick = () => {
    setShowResume(true);
    if (!resumeData) {
      fetchResumeData();
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const sequence = async () => {
      await textControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 }
      });
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
      });
    };
    sequence();
  }, [controls, textControls]);

  const floatingVariants = {
    initial: { y: -10 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#a06df1",
      transition: {
        duration: 0.3
      }
    },
    tap: { scale: 0.95 }
  };

  const ringVariants = {
    initial: { scale: 1, opacity: 0 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.9, 0.6],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, y: 20 }
  };

  if (loading) {
    return (
      <section className="relative w-full h-screen mx-auto overflow-hidden flex items-center justify-center bg-[#1d1836]">
        <Loader message="Loading hero section..." />
      </section>
    );
  }

  if (!heroData) {
    return (
      <section className="relative w-full h-screen mx-auto overflow-hidden flex items-center justify-center bg-[#1d1836]">
        <div className="text-center text-white">
          <p>Failed to load hero data</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      {/* Background */}
      {heroData.backgroundImage ? (
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src={heroData.backgroundImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1d1836] opacity-70" />
        </motion.div>
      ) : (
        <motion.div 
          className="absolute inset-0 bg-[#1d1836] opacity-90 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.5 }}
        />
      )}
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(isMobile ? 10 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#915eff]"
            style={{
              width: Math.random() * (isMobile ? 5 : 8) + 2,
              height: Math.random() * (isMobile ? 5 : 8) + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{
              y: [0, (Math.random() * 100) - 50],
              x: [0, (Math.random() * 60) - 30],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-5 z-10`}>
        {/* Main content */}
        <motion.div 
          className="relative flex-1"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.h1 
            className={`${styles.heroHeadText} text-white`}
            variants={textVariants}
          >
            Hi, I'm <span className='text-[#915eff]'>{heroData.name}</span>
          </motion.h1>
          
          <motion.p 
            className={`${styles.heroSubText} mt-2 text-white-100`}
            variants={textVariants}
          >
            {heroData.title}
          </motion.p>
          
          {/* Social Links */}
          <motion.div 
            className="flex flex-wrap gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.a
              href={heroData.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#915eff] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </motion.a>

            <motion.a
              href={heroData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#915eff] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </motion.a>

            <motion.button
              onClick={handleResumeClick}
              className="bg-white text-[#915eff] px-5 py-3 rounded-xl font-medium flex items-center gap-2 border border-[#915eff]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Profile image with ring effect - Only shown on desktop */}
        {!isMobile && heroData.profileImage && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <motion.div
              className="absolute rounded-full border-2 border-[#915eff]"
              style={{ width: '110%', height: '110%' }}
              variants={ringVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="absolute rounded-full border border-[#915eff]"
              style={{ width: '120%', height: '120%' }}
              variants={ringVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.5, duration: 5 }}
            />
            <motion.div 
              className="relative w-56 h-56 rounded-full overflow-hidden border-2 border-[#915eff]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img
                src={heroData.profileImage}
                alt={heroData.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* 3D Computer */}
      <motion.div 
        className={`absolute ${isMobile ? 'bottom-0 w-full h-1/2' : 'inset-0 w-full h-full'} z-0`}
        variants={floatingVariants}
        initial="initial"
        animate="animate"
      >
        <ComputersCanvas />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className='absolute bottom-10 w-full flex justify-center items-center z-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <a href='#about' className="group">
          <div className='w-[35px] h-[64px] rounded-3xl border-2 border-[#915eff] flex justify-center items-start p-1'>
            <motion.div
              animate={{
                y: [0, 16, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
              className='w-2 h-2 rounded-full bg-[#915eff] mb-1'
            />
          </div>
        </a>
      </motion.div>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResume && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1d1836] rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative overflow-y-auto max-h-[90vh] border border-[#915eff]/30"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button 
                onClick={() => setShowResume(false)} 
                className="absolute top-4 right-4 text-white hover:text-[#915eff] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {resumeLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                  <span className="text-white">Loading resume data...</span>
                </div>
              ) : resumeData ? (
                <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-[#915eff] opacity-70 animate-pulse" style={{ animationDuration: '3s' }}></div>
                    <img 
                      src={resumeData.personalInfo.profileImage} 
                      alt={resumeData.personalInfo.name} 
                      className="w-full h-full rounded-full object-cover border-2 border-[#915eff] relative z-10"
                    />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white">{resumeData.personalInfo.name}</h2>
                  <p className="text-[#915eff] font-medium mb-4">{resumeData.personalInfo.title}</p>
                  
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-5 h-5 text-[#915eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{resumeData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-5 h-5 text-[#915eff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{resumeData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-5 h-5 text-[#915eff]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>{resumeData.personalInfo.github}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-5 h-5 text-[#915eff]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>{resumeData.personalInfo.linkedin}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 space-y-6">
                  {/* About */}
                  <div>
                    <h3 className="text-xl font-bold text-[#915eff] mb-2 border-b border-[#915eff]/30 pb-1">About Me</h3>
                    <p className="text-white/80">
                      {resumeData.about}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-xl font-bold text-[#915eff] mb-2 border-b border-[#915eff]/30 pb-1">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-[#915eff]/10 text-[#915eff] rounded-full text-sm border border-[#915eff]/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-xl font-bold text-[#915eff] mb-2 border-b border-[#915eff]/30 pb-1">Experience</h3>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index}>
                          <h4 className="font-bold text-white">{exp.title}</h4>
                          <p className="text-[#915eff] text-sm">{exp.period}</p>
                          <ul className="list-disc ml-5 mt-1 text-white/80 space-y-1 text-sm">
                            {exp.achievements.map((achievement, idx) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xl font-bold text-[#915eff] mb-2 border-b border-[#915eff]/30 pb-1">Education</h3>
                    <div>
                      <h4 className="font-bold text-white">{resumeData.education.degree}</h4>
                      <p className="text-[#915eff] text-sm">{resumeData.education.institution}</p>
                      <p className="text-white/80 text-sm">{resumeData.education.gpa}</p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="pt-4">
                    <button className="w-full md:w-auto bg-[#915eff] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#7d4de6] transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Full Resume
                    </button>
                  </div>
                </div>
              </div>
              ) : (
                <div className="text-center text-white p-8">
                  <p>Failed to load resume data</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;