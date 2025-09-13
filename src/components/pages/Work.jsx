import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { FiExternalLink } from "react-icons/fi";

import { styles } from "../../config/styles";
import { github } from "../../assets";
import { projectsAPI } from "../../services/api";
import { useState, useEffect } from "react";
import { fadeIn, textVariant } from "../../utils/motion";

const ProjectCard = ({ project, index }) => {

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img src={project.image} alt='project_image' className='w-full h-full object-cover rounded-2xl' />
          <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-2'>
            <div
              onClick={() => window.open(project.source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img src={github} alt='source code' className='w-1/2 h-1/2 object-contain' />
            </div>
            {project.live_demo_link && (
              <div
                onClick={() => window.open(project.live_demo_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <FiExternalLink className='w-1/2 h-1/2 text-white' />
              </div>
            )}
          </div>
        </div>
        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{project.name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{project.description}</p>
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          {project.tags?.map((tag) => (
            <p key={`${project.name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>#{tag.name}</p>
          ))}
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <span className={`text-[12px] font-medium px-2 py-1 rounded-full ${
            project.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
            project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' : 
            'bg-violet-500/20 text-violet-400'
          }`}>
            {project.status}
          </span>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Completed', 'In Progress', 'Featured'];
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.status === selectedCategory);
    
  const projectStats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    featuredProjects: projects.filter(p => p.status === 'Featured').length,
    technologiesUsed: [...new Set(projects.flatMap(p => p.tags?.map(t => t.name) || []))].length
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-primary relative z-0">
      <div className="pt-32 pb-24 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div variants={textVariant()} className="mb-16">
            <p className={`${styles.sectionSubText}`}>MY WORK</p>
            <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
            <motion.p
              variants={fadeIn("", "", 0.1, 1)}
              className='mt-6 text-secondary text-[17px] max-w-3xl leading-[30px]'
            >
              Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos in it. It reflects my ability to solve complex problems, work with different technologies, and manage projects effectively.
            </motion.p>
          </motion.div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-violet-500 text-white'
                    : 'bg-tertiary text-secondary hover:text-white hover:bg-violet-500/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className='flex flex-wrap gap-7 justify-center lg:justify-start mb-20'>
            {loading ? (
              <div className="flex items-center justify-center w-full py-20">
                <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                <span className="text-secondary">Loading projects...</span>
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))
            ) : (
              <div className="text-center w-full py-20">
                <p className="text-secondary text-lg">No projects found for the selected category.</p>
              </div>
            )}
          </div>

          {/* Project Statistics */}
          <motion.div 
            variants={fadeIn("up", "tween", 0.2, 0.8)}
            className="bg-tertiary rounded-2xl p-8 mb-16"
          >
            <h3 className="text-white text-2xl font-bold mb-8 text-center">Project Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-violet-400 mb-2">{projectStats.totalProjects}</div>
                <div className="text-secondary text-sm">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{projectStats.completedProjects}</div>
                <div className="text-secondary text-sm">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{projectStats.featuredProjects}</div>
                <div className="text-secondary text-sm">Featured Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{projectStats.technologiesUsed}</div>
                <div className="text-secondary text-sm">Technologies Used</div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            variants={fadeIn("up", "tween", 0.3, 0.8)}
            className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-2xl p-8 text-center border border-violet-500/20"
          >
            <h3 className="text-white text-2xl font-bold mb-4">Have a Project in Mind?</h3>
            <p className="text-secondary mb-6 max-w-2xl mx-auto">
              I'm always excited to work on new and challenging projects. Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact-us"
                className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Start a Project
              </Link>
              <button className="bg-transparent border border-violet-500 text-violet-400 hover:bg-violet-500 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
                View All Projects
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Work;
