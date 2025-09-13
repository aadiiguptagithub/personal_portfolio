import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../../config/styles";
import { services } from "../../config/constants";
import { fadeIn, textVariant } from "../../utils/motion";


const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full' options={{ max: 45, scale: 1, speed: 450 }}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
        <img src={icon} alt='service' className='w-16 h-16 object-contain' />
        <h3 className='text-white text-[20px] font-bold text-center'>{title}</h3>
      </div>
    </motion.div>
  </Tilt>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-primary relative z-0">
      {/* First Component - Image and Text Side by Side */}
      <div className="pt-32 pb-20 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>Introduction</p>
            <h2 className={styles.sectionHeadText}>About Me.</h2>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 mt-16">
            <motion.div
              variants={fadeIn("left", "tween", 0.2, 1)}
              className="flex-1"
            >
              <img
                src="/aditya.jpeg"
                alt="Aditya Gupta"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              variants={fadeIn("right", "tween", 0.2, 1)}
              className="flex-1"
            >
              <p className='text-secondary text-[17px] leading-[30px] mb-6'>
                Hi! I'm Aditya Gupta, a passionate Full Stack Developer with expertise in creating modern, interactive web applications. My journey in technology combines creativity with technical excellence.
              </p>
              <p className='text-secondary text-[17px] leading-[30px] mb-6'>
                I specialize in JavaScript frameworks like React and Node.js, with a particular interest in 3D web experiences using Three.js. I believe in writing clean, efficient code that solves real-world problems.
              </p>
              <p className='text-secondary text-[17px] leading-[30px]'>
                When I'm not coding, I enjoy exploring new technologies, contributing to open source projects, and mentoring aspiring developers.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Second Component - Services */}
      <div className="py-20 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>What I do</p>
            <h2 className={styles.sectionHeadText}>Services.</h2>
          </motion.div>

          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className='mt-8 text-secondary text-[17px] max-w-3xl leading-[30px] mb-20'
          >
            I'm a skilled software developer with experience in JavaScript and expertise in frameworks like React, Node.js, and Three.js. I'm a quick learner and collaborate closely with clients to create efficient, scalable, and user-friendly solutions.
          </motion.p>

          <div className='flex flex-wrap gap-10 justify-center'>
            {services.map((service, index) => (
              <ServiceCard key={service.title} index={index} {...service} />
            ))}
          </div>
        </div>
      </div>

      {/* Third Component - Skills & Experience */}
      <div className="py-20 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>My expertise</p>
            <h2 className={styles.sectionHeadText}>Skills & Experience.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <motion.div
              variants={fadeIn("up", "spring", 0.1, 0.75)}
              className="bg-tertiary p-8 rounded-2xl"
            >
              <h3 className="text-white text-[24px] font-bold mb-6">Frontend</h3>
              <ul className="text-secondary space-y-2">
                <li>• React, Next.js, Redux</li>
                <li>• JavaScript, TypeScript</li>
                <li>• Three.js, GSAP</li>
                <li>• Tailwind CSS, SASS</li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeIn("up", "spring", 0.3, 0.75)}
              className="bg-tertiary p-8 rounded-2xl"
            >
              <h3 className="text-white text-[24px] font-bold mb-6">Backend</h3>
              <ul className="text-secondary space-y-2">
                <li>• Node.js, Express</li>
                <li>• MongoDB, PostgreSQL</li>
                <li>• REST APIs, GraphQL</li>
                <li>• Docker, AWS</li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeIn("up", "spring", 0.5, 0.75)}
              className="bg-tertiary p-8 rounded-2xl"
            >
              <h3 className="text-white text-[24px] font-bold mb-6">Tools</h3>
              <ul className="text-secondary space-y-2">
                <li>• Git, GitHub</li>
                <li>• Figma, Adobe XD</li>
                <li>• VS Code, Postman</li>
                <li>• Webpack, Vite</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
