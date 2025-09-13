import React, { createContext, useContext, useState } from 'react';

const WorkContext = createContext();

const projectsData = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with React frontend, Node.js backend, and MongoDB database. Features include user authentication, product management, and payment integration.",
    image: "/carrent.png",
    category: "Full Stack",
    technologies: ["React", "Node.js", "MongoDB"],
    status: "Completed",
    githubUrl: "https://github.com/",
    liveUrl: "https://demo.com",
    featured: true
  },
  {
    id: 2,
    title: "3D Portfolio Website",
    description: "Interactive 3D portfolio built with Three.js and React. Features smooth animations, 3D models, and responsive design for showcasing creative work.",
    image: "/jobit.png",
    category: "Frontend",
    technologies: ["React", "Three.js", "Tailwind"],
    status: "Completed",
    githubUrl: "https://github.com/",
    liveUrl: "https://demo.com",
    featured: true
  },
  {
    id: 3,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.",
    image: "/tripguide.png",
    category: "Full Stack",
    technologies: ["React", "Firebase", "Material-UI"],
    status: "Completed",
    githubUrl: "https://github.com/",
    liveUrl: "https://demo.com",
    featured: true
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description: "Real-time weather application with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "/carrent.png",
    category: "Frontend",
    technologies: ["React", "API Integration", "Charts"],
    status: "In Progress",
    githubUrl: "https://github.com/",
    liveUrl: null,
    featured: false
  },
  {
    id: 5,
    title: "Social Media API",
    description: "RESTful API for social media platform with user authentication, post management, and real-time messaging capabilities.",
    image: "/jobit.png",
    category: "Backend",
    technologies: ["Node.js", "Express", "PostgreSQL"],
    status: "Completed",
    githubUrl: "https://github.com/",
    liveUrl: null,
    featured: false
  },
  {
    id: 6,
    title: "Crypto Trading Bot",
    description: "Automated cryptocurrency trading bot with advanced algorithms, risk management, and real-time market analysis.",
    image: "/tripguide.png",
    category: "Backend",
    technologies: ["Python", "APIs", "Machine Learning"],
    status: "Featured",
    githubUrl: "https://github.com/",
    liveUrl: null,
    featured: false
  }
];

export const WorkProvider = ({ children }) => {
  const [projects] = useState(projectsData);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend'];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const projectStats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    featuredProjects: projects.filter(p => p.featured).length,
    technologiesUsed: [...new Set(projects.flatMap(p => p.technologies))].length
  };

  const getProjectById = (id) => projects.find(project => project.id === parseInt(id));

  return (
    <WorkContext.Provider value={{
      projects,
      filteredProjects,
      selectedCategory,
      setSelectedCategory,
      categories,
      projectStats,
      getProjectById
    }}>
      {children}
    </WorkContext.Provider>
  );
};

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) {
    throw new Error('useWork must be used within WorkProvider');
  }
  return context;
};