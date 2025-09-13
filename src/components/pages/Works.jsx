import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

import { styles } from "../../config/styles";
import { github } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { fadeIn, textVariant } from "../../utils/motion";
import { useHome } from "../context/HomeContext";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_demo_link,
  status = "Completed"
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-2'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
            {live_demo_link && (
              <div
                onClick={() => window.open(live_demo_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <FiExternalLink className='w-1/2 h-1/2 text-white' />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <span className={`text-[12px] font-medium px-2 py-1 rounded-full ${
            status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
            status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 
            'bg-violet-500/20 text-violet-400'
          }`}>
            {status}
          </span>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const { homeProjects, homeProjectsLoading } = useHome();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {homeProjectsLoading ? (
          <div className="flex items-center justify-center w-full py-20">
            <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
            <span className="text-secondary">Loading projects...</span>
          </div>
        ) : homeProjects.length > 0 ? (
          homeProjects.map((project, index) => (
            <ProjectCard key={project._id} index={index} {...project} />
          ))
        ) : (
          <div className="text-center w-full py-20">
            <p className="text-secondary text-lg">No featured projects available yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");