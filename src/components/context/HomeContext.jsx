import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsAPI } from '../../services/api';

const HomeContext = createContext();

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

export const HomeProvider = ({ children }) => {
  // Hero Section Data
  const [heroData, setHeroData] = useState({
    name: "Aditya",
    title: "I develop web applications, user interfaces and digital experiences",
    profileImage: "/src/assets/images/aditya.jpeg",
    backgroundImage: "",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  });

  // Resume Data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "Aditya Gupta",
      title: "Full Stack Developer",
      email: "aditya@example.com",
      phone: "+91 1234567890",
      github: "github.com/adityagupta",
      linkedin: "linkedin.com/in/adityagupta",
      profileImage: "/src/assets/images/aditya.jpeg"
    },
    about: "Passionate Full Stack Developer with 3+ years of experience building scalable web applications. Specialized in modern JavaScript frameworks with a focus on creating intuitive user experiences.",
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'TailwindCSS', 'Three.js', 'Git', 'Docker'],
    experience: [
      {
        title: "Senior Developer at Tech Solutions",
        period: "2022 - Present",
        achievements: [
          "Led development of 10+ React applications",
          "Implemented CI/CD pipelines reducing deployment time by 40%",
          "Mentored junior developers in best practices"
        ]
      },
      {
        title: "Frontend Developer at WebCraft",
        period: "2020 - 2022",
        achievements: [
          "Developed responsive UIs for 15+ clients",
          "Improved application performance by 30%",
          "Collaborated with design teams on UX improvements"
        ]
      }
    ],
    education: [
      {
        degree: "B.Tech in Computer Science",
        institution: "ABC University",
        period: "2016 - 2020",
        gpa: "8.7/10"
      }
    ],
    projects: [
      {
        name: "Portfolio Website",
        description: "Personal portfolio built with React and Three.js",
        technologies: ["React", "Three.js", "Tailwind CSS"],
        link: "https://portfolio.com"
      }
    ]
  });

  // Home Projects Data (from API)
  const [homeProjects, setHomeProjects] = useState([]);
  const [homeProjectsLoading, setHomeProjectsLoading] = useState(true);

  // API Functions (ready for future backend integration)
  const updateHeroData = (newData) => {
    setHeroData(prev => ({ ...prev, ...newData }));
  };

  const updateResumeData = (newData) => {
    setResumeData(prev => ({ ...prev, ...newData }));
  };

  const addExperience = (experience) => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, experience]
    }));
  };

  const updateExperience = (index, experience) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => i === index ? experience : exp)
    }));
  };

  const deleteExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = (education) => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
  };

  const updateEducation = (index, education) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? education : edu)
    }));
  };

  const deleteEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addResumeProject = (project) => {
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), project]
    }));
  };

  const updateResumeProject = (index, project) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => i === index ? project : proj)
    }));
  };

  const deleteResumeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateHomeProjects = (newProjects) => {
    setHomeProjects(newProjects);
  };

  const addHomeProject = (project) => {
    setHomeProjects(prev => [...prev, { ...project, id: Date.now() }]);
  };

  const updateHomeProject = (id, updatedProject) => {
    setHomeProjects(prev => 
      prev.map(project => 
        project.id === id ? { ...project, ...updatedProject } : project
      )
    );
  };

  const deleteHomeProject = (id) => {
    setHomeProjects(prev => prev.filter(project => project.id !== id));
  };

  // Future API integration functions
  const fetchHeroData = async () => {
    try {
      // const response = await fetch('/api/hero');
      // const data = await response.json();
      // setHeroData(data);
      console.log('Hero data would be fetched from API');
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

  const fetchResumeData = async () => {
    try {
      // const response = await fetch('/api/resume');
      // const data = await response.json();
      // setResumeData(data);
      console.log('Resume data would be fetched from API');
    } catch (error) {
      console.error('Error fetching resume data:', error);
    }
  };

  const fetchHomeProjects = async () => {
    try {
      setHomeProjectsLoading(true);
      const response = await projectsAPI.getHomeProjects();
      setHomeProjects(response.data);
    } catch (error) {
      console.error('Error fetching home projects:', error);
    } finally {
      setHomeProjectsLoading(false);
    }
  };

  // Fetch home projects on mount
  useEffect(() => {
    fetchHomeProjects();
  }, []);

  const value = {
    // Data
    heroData,
    resumeData,
    homeProjects,
    homeProjectsLoading,
    
    // Update functions
    updateHeroData,
    updateResumeData,
    updateHomeProjects,
    addHomeProject,
    updateHomeProject,
    deleteHomeProject,
    
    // Resume specific functions
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addResumeProject,
    updateResumeProject,
    deleteResumeProject,
    
    // API functions
    fetchHeroData,
    fetchResumeData,
    fetchHomeProjects
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};