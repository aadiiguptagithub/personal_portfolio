import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { heroAPI, resumeAPI, projectsAPI, uploadAPI, usersAPI, blogsAPI } from "../../services/api";
import {
  FiHome, FiUser, FiFolder, FiBriefcase, FiSettings,
  FiEdit3, FiTrash2, FiPlus, FiSave, FiX, FiEye,
  FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiUpload, FiImage,
  FiCalendar, FiClock, FiTag, FiBookmark, FiTrendingUp, FiSearch,
  FiActivity, FiUsers, FiFileText, FiBarChart2, FiGlobe, FiStar
} from "react-icons/fi";
import { fadeIn } from "../../utils/motion";
import { useHome } from "../context/HomeContext";
import { useWork } from "../context/WorkContext";

// Validation Schemas
const heroSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  profileImage: z.string().optional().or(z.literal("")),
  backgroundImage: z.string().optional().or(z.literal("")),
  socialLinks: z.object({
    github: z.string().url("Must be a valid URL"),
    linkedin: z.string().url("Must be a valid URL")
  })
});

const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    github: z.string().min(1, "GitHub is required"),
    linkedin: z.string().min(1, "LinkedIn is required"),
    profileImage: z.string().optional().or(z.literal(""))
  }),
  about: z.string().min(10, "About must be at least 10 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required")
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.object({
    name: z.string(),
    color: z.string()
  })).min(1, "At least one tag is required"),
  image: z.string().url("Must be a valid URL"),
  source_code_link: z.string().url("Must be a valid URL"),
  live_demo_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["Completed", "In Progress", "Featured"])
});

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300, "Excerpt must be less than 300 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featuredImage: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  status: z.enum(["Draft", "Published", "Scheduled"]),
  seoTitle: z.string().max(60, "SEO title must be less than 60 characters").optional().or(z.literal("")),
  seoDescription: z.string().max(160, "SEO description must be less than 160 characters").optional().or(z.literal("")),
  featured: z.boolean()
});

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    title: "",
    period: "",
    achievements: [""]
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    period: "",
    gpa: ""
  });
  const [newResumeProject, setNewResumeProject] = useState({
    name: "",
    description: "",
    technologies: [""],
    link: ""
  });
  const [addToHomePage, setAddToHomePage] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [homeProjects, setHomeProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  // Use projects from WorkContext
  const { projects } = useWork();

  // User Management State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active"
  });

  // Blog Management State
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogAnalytics, setBlogAnalytics] = useState(null);
  const [blogCurrentPage, setBlogCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [blogSearchTerm, setBlogSearchTerm] = useState("");
  const [blogFilterStatus, setBlogFilterStatus] = useState("All");
  const [blogFilterCategory, setBlogFilterCategory] = useState("All");
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "Tutorial",
    tags: [],
    status: "Draft",
    seoTitle: "",
    seoDescription: "",
    featured: false
  });
  const [newTag, setNewTag] = useState("");
  const [blogView, setBlogView] = useState("grid"); // grid or list

  const categories = ["Tutorial", "CSS", "JavaScript", "React", "Programming", "Design", "Technology"];
  
  // Image upload refs
  const profileImageRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const featuredImageRef = useRef(null);



  // Navigation tabs
  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: <FiTrendingUp /> },
    { id: "hero", label: "Hero & Resume", icon: <FiHome /> },
    { id: "projects", label: "Projects Management", icon: <FiFolder /> },
    { id: "blogs", label: "Blog Management", icon: <FiEdit3 /> },
    { id: "users", label: "User Management", icon: <FiUser /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> }
  ];

  // Hero Form
  const heroForm = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: "",
      title: "",
      profileImage: "",
      backgroundImage: "",
      socialLinks: {
        github: "",
        linkedin: ""
      }
    }
  });

  // Resume Form
  const resumeForm = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        github: "",
        linkedin: "",
        profileImage: ""
      },
      about: "",
      skills: [],
      experience: [],
      education: [],
      projects: []
    }
  });

  // Project Form
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [{ name: "", color: "blue-text-gradient" }],
      image: "",
      source_code_link: "",
      live_demo_link: "",
      status: "In Progress"
    }
  });

  // Blog Form
  const blogFormHook = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "Tutorial",
      tags: [],
      status: "Draft",
      seoTitle: "",
      seoDescription: "",
      featured: false
    }
  });

  // Image upload handlers
  const handleImageUpload = async (file, type) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageDataUrl = e.target.result;
          
          // Show uploading toast
          const uploadingToast = toast.loading('Uploading image to cloud...');
          
          try {
            const response = await uploadAPI.uploadBase64(imageDataUrl);
            const cloudinaryUrl = response.data.url;
            
            if (type === 'profile') {
              heroForm.setValue('profileImage', cloudinaryUrl);
            } else if (type === 'background') {
              heroForm.setValue('backgroundImage', cloudinaryUrl);
            } else if (type === 'featured') {
              blogFormHook.setValue('featuredImage', cloudinaryUrl);
            }
            
            toast.success('Image uploaded successfully!', { id: uploadingToast });
          } catch (error) {
            toast.error('Failed to upload image', { id: uploadingToast });
            console.error('Upload error:', error);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error('Failed to process image');
      }
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleProfileImageClick = () => {
    profileImageRef.current?.click();
  };

  const handleBackgroundImageClick = () => {
    backgroundImageRef.current?.click();
  };

  const handleFeaturedImageClick = () => {
    featuredImageRef.current?.click();
  };

  // Fetch hero data
  const fetchHeroData = async () => {
    try {
      setHeroLoading(true);
      const response = await heroAPI.getHero();
      const data = response.data;
      setHeroData(data);
      heroForm.reset({
        name: data.name,
        title: data.title,
        profileImage: data.profileImage,
        backgroundImage: data.backgroundImage,
        socialLinks: data.socialLinks
      });
    } catch (error) {
      toast.error('Failed to fetch hero data');
      console.error('Error fetching hero data:', error);
    } finally {
      setHeroLoading(false);
    }
  };

  // Handle Hero Update
  const onHeroSubmit = async (data) => {
    try {
      setHeroLoading(true);
      const response = await heroAPI.updateHero(data);
      setHeroData(response.data);
      toast.success("Hero section updated successfully!");
    } catch (error) {
      toast.error('Failed to update hero section');
      console.error('Error updating hero:', error);
    } finally {
      setHeroLoading(false);
    }
  };

  // Fetch resume data
  const fetchResumeData = async () => {
    try {
      setResumeLoading(true);
      const response = await resumeAPI.getResume();
      const data = response.data;
      setResumeData(data);
      resumeForm.reset(data);
    } catch (error) {
      toast.error('Failed to fetch resume data');
      console.error('Error fetching resume data:', error);
    } finally {
      setResumeLoading(false);
    }
  };

  // Fetch projects data
  const fetchProjectsData = async () => {
    try {
      setProjectsLoading(true);
      const [allProjectsData, homeProjectsData] = await Promise.all([
        projectsAPI.getProjects(),
        projectsAPI.getHomeProjects()
      ]);
      setAllProjects(allProjectsData.data);
      setHomeProjects(homeProjectsData.data);
    } catch (error) {
      toast.error('Failed to fetch projects data');
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch users data
  const fetchUsersData = async () => {
    try {
      setUsersLoading(true);
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users data');
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch blogs data
  const fetchBlogsData = async () => {
    try {
      setBlogsLoading(true);
      const [blogsResponse, analyticsResponse] = await Promise.all([
        blogsAPI.getBlogs({ page: blogCurrentPage, limit: blogsPerPage, status: blogFilterStatus, category: blogFilterCategory, search: blogSearchTerm }),
        blogsAPI.getAnalytics()
      ]);
      setBlogs(blogsResponse.data.blogs);
      setBlogAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch blogs data');
      console.error('Error fetching blogs:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

  // Load hero, resume, projects, users and blogs data on component mount
  useEffect(() => {
    fetchHeroData();
    fetchResumeData();
    fetchProjectsData();
    fetchUsersData();
    fetchBlogsData();
  }, []);

  // Handle Resume Update
  const onResumeSubmit = async (data) => {
    try {
      setResumeLoading(true);
      const response = await resumeAPI.updateResume(data);
      setResumeData(response.data);
      toast.success("Resume data updated successfully!");
    } catch (error) {
      toast.error('Failed to update resume data');
      console.error('Error updating resume:', error);
    } finally {
      setResumeLoading(false);
    }
  };

  // Handle Project Operations
  const onProjectSubmit = async (data) => {
    try {
      setProjectsLoading(true);
      const projectData = { ...data, isOnHomePage: addToHomePage };
      
      if (editingProject) {
        const response = await projectsAPI.updateProject(editingProject._id, projectData);
        setAllProjects(prev => prev.map(p => p._id === response.data._id ? response.data : p));
        if (response.data.isOnHomePage) {
          setHomeProjects(prev => {
            const existing = prev.find(p => p._id === response.data._id);
            return existing ? prev.map(p => p._id === response.data._id ? response.data : p) : [...prev, response.data];
          });
        } else {
          setHomeProjects(prev => prev.filter(p => p._id !== response.data._id));
        }
        toast.success("Project updated successfully!");
      } else {
        const response = await projectsAPI.createProject(projectData);
        setAllProjects(prev => [response.data, ...prev]);
        if (response.data.isOnHomePage) {
          setHomeProjects(prev => [response.data, ...prev]);
        }
        toast.success("Project created successfully!");
      }
      
      setShowProjectModal(false);
      setEditingProject(null);
      setAddToHomePage(false);
      projectForm.reset();
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Error saving project:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setAddToHomePage(project.isOnHomePage);
    projectForm.reset(project);
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setProjectsLoading(true);
        await projectsAPI.deleteProject(id);
        setAllProjects(prev => prev.filter(p => p._id !== id));
        setHomeProjects(prev => prev.filter(p => p._id !== id));
        toast.success("Project deleted successfully!");
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Error deleting project:', error);
      } finally {
        setProjectsLoading(false);
      }
    }
  };

  const handleToggleHomePage = async (id) => {
    try {
      setProjectsLoading(true);
      const response = await projectsAPI.toggleHomePage(id);
      
      setAllProjects(prev => prev.map(p => p._id === id ? response.data : p));
      
      if (response.data.isOnHomePage) {
        setHomeProjects(prev => [...prev, response.data]);
        toast.success("Project added to home page!");
      } else {
        setHomeProjects(prev => prev.filter(p => p._id !== id));
        toast.success("Project removed from home page!");
      }
    } catch (error) {
      toast.error('Failed to update project');
      console.error('Error toggling home page:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = resumeForm.getValues("skills") || [];
      resumeForm.setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const currentSkills = resumeForm.getValues("skills") || [];
    resumeForm.setValue("skills", currentSkills.filter((_, i) => i !== index));
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        setResumeLoading(true);
        const response = await resumeAPI.deleteExperience(id);
        setResumeData(response.data);
        resumeForm.reset(response.data);
        toast.success("Experience deleted successfully!");
      } catch (error) {
        toast.error('Failed to delete experience');
        console.error('Error deleting experience:', error);
      } finally {
        setResumeLoading(false);
      }
    }
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      try {
        setResumeLoading(true);
        const response = await resumeAPI.deleteEducation(id);
        setResumeData(response.data);
        resumeForm.reset(response.data);
        toast.success("Education deleted successfully!");
      } catch (error) {
        toast.error('Failed to delete education');
        console.error('Error deleting education:', error);
      } finally {
        setResumeLoading(false);
      }
    }
  };

  const handleDeleteResumeProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setResumeLoading(true);
        const response = await resumeAPI.deleteProject(id);
        setResumeData(response.data);
        resumeForm.reset(response.data);
        toast.success("Project deleted successfully!");
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Error deleting project:', error);
      } finally {
        setResumeLoading(false);
      }
    }
  };

  const handleAddExperience = async () => {
    if (newExperience.title && newExperience.period) {
      try {
        setResumeLoading(true);
        const experienceData = {
          company: newExperience.title.split(' at ')[1] || newExperience.title,
          position: newExperience.title.split(' at ')[0] || newExperience.title,
          startDate: newExperience.period.split(' - ')[0] || newExperience.period,
          endDate: newExperience.period.split(' - ')[1] || 'Present',
          description: newExperience.achievements.filter(a => a.trim()).join('. ')
        };
        const response = await resumeAPI.addExperience(experienceData);
        setResumeData(response.data);
        resumeForm.reset(response.data);
        setNewExperience({ title: "", period: "", achievements: [""] });
        toast.success("Experience added successfully!");
      } catch (error) {
        toast.error('Failed to add experience');
        console.error('Error adding experience:', error);
      } finally {
        setResumeLoading(false);
      }
    }
  };

  const handleAddEducation = async () => {
    if (newEducation.degree && newEducation.institution) {
      try {
        setResumeLoading(true);
        const educationData = {
          institution: newEducation.institution,
          degree: newEducation.degree,
          startDate: newEducation.period.split(' - ')[0] || newEducation.period,
          endDate: newEducation.period.split(' - ')[1] || 'Present',
          gpa: newEducation.gpa
        };
        const response = await resumeAPI.addEducation(educationData);
        setResumeData(response.data);
        resumeForm.reset(response.data);
        setNewEducation({ degree: "", institution: "", period: "", gpa: "" });
        toast.success("Education added successfully!");
      } catch (error) {
        toast.error('Failed to add education');
        console.error('Error adding education:', error);
      } finally {
        setResumeLoading(false);
      }
    }
  };

  const handleAddResumeProject = async () => {
    if (newResumeProject.name && newResumeProject.description) {
      try {
        setResumeLoading(true);
        const projectData = {
          name: newResumeProject.name,
          description: newResumeProject.description,
          technologies: newResumeProject.technologies.filter(t => t.trim()),
          link: newResumeProject.link
        };
        const response = await resumeAPI.addProject(projectData);
        setResumeData(response.data);
        resumeForm.reset(response.data);
        setNewResumeProject({ name: "", description: "", technologies: [""], link: "" });
        toast.success("Project added successfully!");
      } catch (error) {
        toast.error('Failed to add project');
        console.error('Error adding project:', error);
      } finally {
        setResumeLoading(false);
      }
    }
  };

  // User Management Functions
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "User", status: "Active" });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (userForm.name && userForm.email) {
      try {
        setUsersLoading(true);
        if (editingUser) {
          const response = await usersAPI.updateUser(editingUser._id, userForm);
          setUsers(users.map(u => u._id === editingUser._id ? response.data : u));
          toast.success("User updated successfully!");
        } else {
          const response = await usersAPI.createUser(userForm);
          setUsers([response.data, ...users]);
          toast.success("User added successfully!");
        }
        setShowUserModal(false);
        setEditingUser(null);
        setUserForm({ name: "", email: "", role: "User", status: "Active" });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to save user');
        console.error('Error saving user:', error);
      } finally {
        setUsersLoading(false);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setUsersLoading(true);
        await usersAPI.deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      } finally {
        setUsersLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUsersLoading(true);
      const response = await usersAPI.updateUserStatus(id, newStatus);
      setUsers(users.map(u => u._id === id ? response.data : u));
      toast.success(`User status updated to ${newStatus}!`);
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Blog Management Functions
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(blogSearchTerm.toLowerCase()));
    const matchesStatus = blogFilterStatus === "All" || blog.status === blogFilterStatus;
    const matchesCategory = blogFilterCategory === "All" || blog.category === blogFilterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const blogIndexOfLast = blogCurrentPage * blogsPerPage;
  const blogIndexOfFirst = blogIndexOfLast - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(blogIndexOfFirst, blogIndexOfLast);
  const blogTotalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleAddBlog = () => {
    setEditingBlog(null);
    blogFormHook.reset();
    setShowBlogModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    blogFormHook.reset({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      category: blog.category,
      tags: blog.tags,
      status: blog.status,
      seo: {
        title: blog.seo?.title || '',
        description: blog.seo?.description || '',
        keywords: blog.seo?.keywords || []
      },
      featured: blog.featured
    });
    setShowBlogModal(true);
  };

  const onBlogSubmit = async (data) => {
    try {
      setBlogsLoading(true);
      if (editingBlog) {
        const response = await blogsAPI.updateBlog(editingBlog._id, data);
        setBlogs(blogs.map(b => b._id === editingBlog._id ? response.data : b));
        toast.success("Blog updated successfully!");
      } else {
        const response = await blogsAPI.createBlog(data);
        setBlogs([response.data, ...blogs]);
        toast.success("Blog created successfully!");
      }
      setShowBlogModal(false);
      setEditingBlog(null);
      blogFormHook.reset();
      // Refresh analytics
      const analyticsResponse = await blogsAPI.getAnalytics();
      setBlogAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
      console.error('Error saving blog:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        setBlogsLoading(true);
        await blogsAPI.deleteBlog(id);
        setBlogs(blogs.filter(b => b._id !== id));
        toast.success("Blog deleted successfully!");
        // Refresh analytics
        const analyticsResponse = await blogsAPI.getAnalytics();
        setBlogAnalytics(analyticsResponse.data);
      } catch (error) {
        toast.error('Failed to delete blog');
        console.error('Error deleting blog:', error);
      } finally {
        setBlogsLoading(false);
      }
    }
  };

  const handleBlogStatusChange = async (id, newStatus) => {
    try {
      setBlogsLoading(true);
      const response = await blogsAPI.updateBlogStatus(id, newStatus);
      setBlogs(blogs.map(b => b._id === id ? response.data : b));
      toast.success(`Blog ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error('Failed to update blog status');
      console.error('Error updating blog status:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

  const addBlogTag = () => {
    if (newTag.trim() && !blogFormHook.watch("tags").includes(newTag.trim())) {
      const currentTags = blogFormHook.getValues("tags");
      blogFormHook.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeBlogTag = (tagToRemove) => {
    const currentTags = blogFormHook.getValues("tags");
    blogFormHook.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const addTag = () => {
    const currentTags = projectForm.getValues("tags");
    projectForm.setValue("tags", [...currentTags, { name: "", color: "blue-text-gradient" }]);
  };

  const removeTag = (index) => {
    const currentTags = projectForm.getValues("tags");
    projectForm.setValue("tags", currentTags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-[#050816] text-gray-200 font-sans overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className={`bg-[#0a1026] text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} border-r border-[#22244a]`}>
        <div className="p-4 flex items-center justify-between border-b border-[#22244a] h-16">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-[#915eff]">Admin Panel</h1>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#915eff] flex items-center justify-center">
              <span className="text-white">A</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#bdbdfc] hover:text-[#915eff] p-1"
          >
            {sidebarOpen ? <FiX /> : <FiSettings />}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors
                    ${activeTab === tab.id ? "bg-[#915eff] text-white" : "text-[#bdbdfc] hover:bg-[#915eff]/30"}
                    ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <span className={`text-xl ${sidebarOpen ? "mr-3" : ""}`}>
                    {tab.icon}
                  </span>
                  {sidebarOpen && <span>{tab.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#0a1026] shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30 border-b border-[#22244a]">
          <h2 className="text-xl font-semibold capitalize">{activeTab.replace("-", " ")}</h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-[#915eff] flex items-center justify-center text-white">
              <span>A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-[#915eff] to-[#7a4eea] p-6 rounded-xl text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
                <p className="text-white/80">Manage your portfolio content from here.</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <FiUsers className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{users.length}</h3>
                      <p className="text-[#bdbdfc] text-sm">Total Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <FiFileText className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{blogs.length}</h3>
                      <p className="text-[#bdbdfc] text-sm">Blog Posts</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FiFolder className="text-purple-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{allProjects.length}</h3>
                      <p className="text-[#bdbdfc] text-sm">Projects</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <FiEye className="text-orange-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{blogs.reduce((sum, b) => sum + b.views, 0)}</h3>
                      <p className="text-[#bdbdfc] text-sm">Total Views</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('hero')}
                    className="bg-[#915eff] text-white p-4 rounded-lg hover:bg-[#7a4eea] transition-colors flex items-center gap-3"
                  >
                    <FiHome size={20} />
                    <span>Update Profile</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="bg-[#0a1026] border border-[#22244a] text-white p-4 rounded-lg hover:bg-[#915eff] transition-colors flex items-center gap-3"
                  >
                    <FiFolder size={20} />
                    <span>Manage Projects</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('blogs')}
                    className="bg-[#0a1026] border border-[#22244a] text-white p-4 rounded-lg hover:bg-[#915eff] transition-colors flex items-center gap-3"
                  >
                    <FiFileText size={20} />
                    <span>Manage Blogs</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="bg-[#0a1026] border border-[#22244a] text-white p-4 rounded-lg hover:bg-[#915eff] transition-colors flex items-center gap-3"
                  >
                    <FiUsers size={20} />
                    <span>Manage Users</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hero Section Tab */}
          {activeTab === "hero" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Hero Section Management */}
              <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                <h3 className="text-xl font-semibold mb-6 text-[#915eff]">Hero Section Management</h3>
                
                {heroLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                    <span className="text-[#bdbdfc]">Loading hero data...</span>
                  </div>
                ) : (
                  <form onSubmit={heroForm.handleSubmit(onHeroSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-white border-b border-[#22244a] pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Name</label>
                      <input
                        {...heroForm.register("name")}
                        className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        placeholder="Your full name"
                      />
                      {heroForm.formState.errors.name && (
                        <p className="text-red-400 text-sm mt-1">{heroForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Title/Description</label>
                      <textarea
                        {...heroForm.register("title")}
                        rows={3}
                        className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent resize-none"
                        placeholder="I develop web applications, user interfaces and digital experiences"
                      />
                      {heroForm.formState.errors.title && (
                        <p className="text-red-400 text-sm mt-1">{heroForm.formState.errors.title.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-white border-b border-[#22244a] pb-2">Images</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Image */}
                    <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                      <label className="block text-sm font-medium text-[#bdbdfc] mb-3">
                        <FiImage className="inline mr-2" />
                        Profile Image
                      </label>
                      
                      {/* Image Preview */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#915eff] bg-[#181b3a] flex items-center justify-center">
                          {heroForm.watch("profileImage") && !heroForm.watch("profileImage").startsWith('data:') ? (
                            <img
                              src={heroForm.watch("profileImage")}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-[#915eff] text-2xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={handleProfileImageClick}
                            className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2 mb-2"
                          >
                            <FiUpload size={16} />
                            Upload Image
                          </button>
                          <p className="text-[#bdbdfc] text-xs">Recommended: 400x400px, JPG/PNG</p>
                        </div>
                      </div>
                      
                      {/* URL Input */}
                      <input
                        {...heroForm.register("profileImage")}
                        placeholder="Or paste image URL"
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent text-sm"
                      />
                      
                      {/* Hidden file input */}
                      <input
                        ref={profileImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0], 'profile')}
                        className="hidden"
                      />
                      
                      {heroForm.formState.errors.profileImage && (
                        <p className="text-red-400 text-sm mt-2">{heroForm.formState.errors.profileImage.message}</p>
                      )}
                    </div>

                    {/* Background Image */}
                    <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                      <label className="block text-sm font-medium text-[#bdbdfc] mb-3">
                        <FiImage className="inline mr-2" />
                        Background Image (Optional)
                      </label>
                      
                      {/* Background Preview */}
                      <div className="mb-4">
                        <div className="w-full h-24 rounded-lg overflow-hidden border-2 border-[#915eff] bg-[#181b3a] flex items-center justify-center">
                          {heroForm.watch("backgroundImage") && !heroForm.watch("backgroundImage").startsWith('data:') ? (
                            <img
                              src={heroForm.watch("backgroundImage")}
                              alt="Background Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <FiImage className="text-[#915eff] text-2xl mx-auto mb-1" />
                              <p className="text-[#bdbdfc] text-xs">No background image</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={handleBackgroundImageClick}
                            className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2 mb-2"
                          >
                            <FiUpload size={16} />
                            Upload Background
                          </button>
                          <p className="text-[#bdbdfc] text-xs">Recommended: 1920x1080px, JPG/PNG</p>
                        </div>
                      </div>
                      
                      {/* URL Input */}
                      <input
                        {...heroForm.register("backgroundImage")}
                        placeholder="Or paste background image URL"
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent text-sm"
                      />
                      
                      {/* Hidden file input */}
                      <input
                        ref={backgroundImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0], 'background')}
                        className="hidden"
                      />
                      
                      <p className="text-[#bdbdfc] text-xs mt-2">
                        Background image will be displayed behind the hero content. Leave empty for default.
                      </p>
                      
                      {heroForm.formState.errors.backgroundImage && (
                        <p className="text-red-400 text-sm mt-2">{heroForm.formState.errors.backgroundImage.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-white border-b border-[#22244a] pb-2">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                        <FiGithub className="inline mr-2" />
                        GitHub URL
                      </label>
                      <input
                        {...heroForm.register("socialLinks.github")}
                        className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        placeholder="https://github.com/username"
                      />
                      {heroForm.formState.errors.socialLinks?.github && (
                        <p className="text-red-400 text-sm mt-1">{heroForm.formState.errors.socialLinks.github.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                        <FiLinkedin className="inline mr-2" />
                        LinkedIn URL
                      </label>
                      <input
                        {...heroForm.register("socialLinks.linkedin")}
                        className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        placeholder="https://linkedin.com/in/username"
                      />
                      {heroForm.formState.errors.socialLinks?.linkedin && (
                        <p className="text-red-400 text-sm mt-1">{heroForm.formState.errors.socialLinks.linkedin.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={heroLoading}
                  className="bg-[#915eff] text-white px-6 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {heroLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Update Hero Section
                    </>
                  )}
                </button>
              </form>
                )}
              </div>

              {/* Resume Management */}
              <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                <h3 className="text-xl font-semibold mb-6 text-[#915eff]">Resume Management</h3>
                
                {resumeLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                    <span className="text-[#bdbdfc]">Loading resume data...</span>
                  </div>
                ) : (
                  <form onSubmit={resumeForm.handleSubmit(onResumeSubmit)} className="space-y-8">
                  {/* Personal Info */}
                  <div>
                    <h4 className="text-lg font-medium mb-4 text-white">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Name</label>
                        <input
                          {...resumeForm.register("personalInfo.name")}
                          className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        />
                        {resumeForm.formState.errors.personalInfo?.name && (
                          <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.personalInfo.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Title</label>
                        <input
                          {...resumeForm.register("personalInfo.title")}
                          className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        />
                        {resumeForm.formState.errors.personalInfo?.title && (
                          <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.personalInfo.title.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                          <FiMail className="inline mr-2" />
                          Email
                        </label>
                        <input
                          {...resumeForm.register("personalInfo.email")}
                          type="email"
                          className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        />
                        {resumeForm.formState.errors.personalInfo?.email && (
                          <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.personalInfo.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                          <FiPhone className="inline mr-2" />
                          Phone
                        </label>
                        <input
                          {...resumeForm.register("personalInfo.phone")}
                          className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        />
                        {resumeForm.formState.errors.personalInfo?.phone && (
                          <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.personalInfo.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                          <FiGithub className="inline mr-2" />
                          GitHub URL
                        </label>
                        <input
                          {...resumeForm.register("personalInfo.github")}
                          className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                          placeholder="https://github.com/username"
                        />
                        {resumeForm.formState.errors.personalInfo?.github && (
                          <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.personalInfo.github.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                          <FiLinkedin className="inline mr-2" />
                          LinkedIn URL
                        </label>
                        <input
                          {...resumeForm.register("personalInfo.linkedin")}
                          className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                          placeholder="https://linkedin.com/in/username"
                        />
                        {resumeForm.formState.errors.personalInfo?.linkedin && (
                          <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.personalInfo.linkedin.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <label className="block text-sm font-medium text-[#bdbdfc] mb-2">About Me</label>
                    <textarea
                      {...resumeForm.register("about")}
                      rows={4}
                      className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                      placeholder="Write about yourself, your experience, and what drives you as a professional"
                    />
                    {resumeForm.formState.errors.about && (
                      <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.about.message}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Skills</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeForm.watch("skills")?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#915eff]/20 text-[#915eff] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    {resumeForm.formState.errors.skills && (
                      <p className="text-red-400 text-sm mt-1">{resumeForm.formState.errors.skills.message}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-white">Experience</h4>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="bg-[#915eff] text-white px-3 py-1 rounded-md hover:bg-[#7a4eea] transition-colors text-sm flex items-center gap-1"
                      >
                        <FiPlus size={14} />
                        Add Experience
                      </button>
                    </div>
                    
                    {/* Add New Experience Form */}
                    <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a] mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          placeholder="Job Title & Company"
                          value={newExperience.title}
                          onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                        <input
                          placeholder="Period (e.g., 2020 - 2022)"
                          value={newExperience.period}
                          onChange={(e) => setNewExperience({...newExperience, period: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                      </div>
                      {newExperience.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            placeholder="Achievement/Responsibility"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...newExperience.achievements];
                              newAchievements[index] = e.target.value;
                              setNewExperience({...newExperience, achievements: newAchievements});
                            }}
                            className="flex-1 bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newAchievements = newExperience.achievements.filter((_, i) => i !== index);
                              setNewExperience({...newExperience, achievements: newAchievements});
                            }}
                            className="text-red-400 hover:text-red-300 px-2"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setNewExperience({...newExperience, achievements: [...newExperience.achievements, ""]})}
                        className="text-[#915eff] hover:text-[#7a4eea] text-sm flex items-center gap-1 mt-2"
                      >
                        <FiPlus size={12} />
                        Add Achievement
                      </button>
                    </div>

                    {/* Existing Experiences */}
                    <div className="space-y-3">
                      {resumeData?.experience?.length > 0 ? (
                        resumeData.experience.map((exp) => (
                          <div key={exp._id} className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="text-white font-medium">{exp.position} at {exp.company}</h5>
                                <p className="text-[#915eff] text-sm">{exp.startDate} - {exp.endDate}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteExperience(exp._id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                            <p className="text-[#bdbdfc] text-sm">{exp.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-[#bdbdfc]">
                          <FiBriefcase className="mx-auto text-2xl mb-2" />
                          <p>No experience added yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-white">Education</h4>
                      <button
                        type="button"
                        onClick={handleAddEducation}
                        className="bg-[#915eff] text-white px-3 py-1 rounded-md hover:bg-[#7a4eea] transition-colors text-sm flex items-center gap-1"
                      >
                        <FiPlus size={14} />
                        Add Education
                      </button>
                    </div>
                    
                    {/* Add New Education Form */}
                    <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a] mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          placeholder="Degree"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                        <input
                          placeholder="Institution"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                        <input
                          placeholder="Period (e.g., 2016 - 2020)"
                          value={newEducation.period}
                          onChange={(e) => setNewEducation({...newEducation, period: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                        <input
                          placeholder="GPA/Grade (optional)"
                          value={newEducation.gpa}
                          onChange={(e) => setNewEducation({...newEducation, gpa: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Existing Education */}
                    <div className="space-y-3">
                      {resumeData?.education?.length > 0 ? (
                        resumeData.education.map((edu) => (
                          <div key={edu._id} className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-white font-medium">{edu.degree}</h5>
                                <p className="text-[#915eff] text-sm">{edu.institution}</p>
                                <p className="text-[#bdbdfc] text-sm">{edu.startDate} - {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteEducation(edu._id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-[#bdbdfc]">
                          <FiBookmark className="mx-auto text-2xl mb-2" />
                          <p>No education added yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resume Projects */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-white">Projects</h4>
                      <button
                        type="button"
                        onClick={handleAddResumeProject}
                        className="bg-[#915eff] text-white px-3 py-1 rounded-md hover:bg-[#7a4eea] transition-colors text-sm flex items-center gap-1"
                      >
                        <FiPlus size={14} />
                        Add Project
                      </button>
                    </div>
                    
                    {/* Add New Project Form */}
                    <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a] mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          placeholder="Project Name"
                          value={newResumeProject.name}
                          onChange={(e) => setNewResumeProject({...newResumeProject, name: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                        <input
                          placeholder="Project Link (optional)"
                          value={newResumeProject.link}
                          onChange={(e) => setNewResumeProject({...newResumeProject, link: e.target.value})}
                          className="bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Project Description"
                        value={newResumeProject.description}
                        onChange={(e) => setNewResumeProject({...newResumeProject, description: e.target.value})}
                        rows={2}
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm mb-3"
                      />
                      {newResumeProject.technologies.map((tech, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            placeholder="Technology/Tool"
                            value={tech}
                            onChange={(e) => {
                              const newTech = [...newResumeProject.technologies];
                              newTech[index] = e.target.value;
                              setNewResumeProject({...newResumeProject, technologies: newTech});
                            }}
                            className="flex-1 bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newTech = newResumeProject.technologies.filter((_, i) => i !== index);
                              setNewResumeProject({...newResumeProject, technologies: newTech});
                            }}
                            className="text-red-400 hover:text-red-300 px-2"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setNewResumeProject({...newResumeProject, technologies: [...newResumeProject.technologies, ""]})}
                        className="text-[#915eff] hover:text-[#7a4eea] text-sm flex items-center gap-1"
                      >
                        <FiPlus size={12} />
                        Add Technology
                      </button>
                    </div>

                    {/* Existing Projects */}
                    <div className="space-y-3">
                      {resumeData?.projects?.length > 0 ? (
                        resumeData.projects.map((project) => (
                          <div key={project._id} className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="text-white font-medium">{project.name}</h5>
                                  {project.link && (
                                    <a
                                      href={project.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#915eff] hover:text-[#7a4eea]"
                                    >
                                      <FiEye size={16} />
                                    </a>
                                  )}
                                </div>
                                <p className="text-[#bdbdfc] text-sm mb-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {project.technologies?.map((tech, techIndex) => (
                                    <span key={techIndex} className="bg-[#915eff]/20 text-[#915eff] px-2 py-1 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteResumeProject(project._id)}
                                className="text-red-400 hover:text-red-300 ml-2"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-[#bdbdfc]">
                          <FiFolder className="mx-auto text-2xl mb-2" />
                          <p>No projects added yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resumeLoading}
                    className="bg-[#915eff] text-white px-6 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resumeLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Update Resume
                      </>
                    )}
                  </button>
                </form>
                )}
              </div>
            </motion.div>
          )}



          {/* Projects Management Tab */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {projectsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                  <span className="text-[#bdbdfc]">Loading projects...</span>
                </div>
              ) : (
                <>
                  {/* All Projects Section */}
                  <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-[#915eff]">
                        <FiBriefcase className="inline mr-2" />
                        All Projects ({allProjects.length})
                      </h3>
                      <button
                        onClick={() => {
                          setEditingProject(null);
                          setAddToHomePage(false);
                          projectForm.reset();
                          setShowProjectModal(true);
                        }}
                        className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2"
                      >
                        <FiPlus />
                        Add Project
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allProjects.map((project) => (
                        <div key={project._id} className="bg-[#0a1026] rounded-lg p-4 border border-[#22244a] relative">
                          {project.isOnHomePage && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              On Home
                            </div>
                          )}
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="text-white font-semibold mb-2">{project.name}</h4>
                          <p className="text-[#bdbdfc] text-sm mb-3 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tags?.slice(0, 2).map((tag, index) => (
                              <span key={index} className="bg-[#915eff]/20 text-[#915eff] px-2 py-1 rounded text-xs">
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-violet-500/20 text-violet-400'
                            }`}>
                              {project.status}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleHomePage(project._id)}
                                className={`text-xs px-2 py-1 rounded ${
                                  project.isOnHomePage ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                } hover:opacity-80`}
                                title={project.isOnHomePage ? 'Remove from home' : 'Add to home'}
                              >
                                <FiHome />
                              </button>
                              <button
                                onClick={() => handleEditProject(project)}
                                className="text-[#915eff] hover:text-[#7a4eea]"
                              >
                                <FiEdit3 />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {allProjects.length === 0 && (
                      <div className="text-center py-8">
                        <FiFolder className="text-[#915eff] text-4xl mx-auto mb-3" />
                        <p className="text-[#bdbdfc]">No projects created yet</p>
                        <p className="text-[#bdbdfc] text-sm">Click "Add Project" to create your first project</p>
                      </div>
                    )}
                  </div>

                  {/* Home Page Projects Section */}
                  <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-[#915eff]">
                        <FiHome className="inline mr-2" />
                        Home Page Projects ({homeProjects.length})
                      </h3>
                      <p className="text-[#bdbdfc] text-sm">
                        Projects displayed on the home page
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {homeProjects.map((project) => (
                        <div key={project._id} className="bg-[#0a1026] rounded-lg p-4 border border-[#22244a] relative">
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Home
                          </div>
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="text-white font-semibold mb-2">{project.name}</h4>
                          <p className="text-[#bdbdfc] text-sm mb-3 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tags?.slice(0, 2).map((tag, index) => (
                              <span key={index} className="bg-[#915eff]/20 text-[#915eff] px-2 py-1 rounded text-xs">
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-violet-500/20 text-violet-400'
                            }`}>
                              {project.status}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleHomePage(project._id)}
                                className="text-red-400 hover:text-red-300"
                                title="Remove from home page"
                              >
                                <FiX />
                              </button>
                              <button
                                onClick={() => handleEditProject(project)}
                                className="text-[#915eff] hover:text-[#7a4eea]"
                              >
                                <FiEdit3 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {homeProjects.length === 0 && (
                      <div className="text-center py-8">
                        <FiHome className="text-[#915eff] text-4xl mx-auto mb-3" />
                        <p className="text-[#bdbdfc]">No projects on home page yet</p>
                        <p className="text-[#bdbdfc] text-sm">Use the home icon on projects above to add them to home page</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Blog Management Tab */}
          {activeTab === "blogs" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Blog Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#181b3a] p-4 rounded-xl border border-[#22244a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#bdbdfc] text-sm">Total Posts</p>
                      <p className="text-2xl font-bold text-white">{blogAnalytics?.totalBlogs || 0}</p>
                    </div>
                    <FiEdit3 className="text-[#915eff] text-2xl" />
                  </div>
                </div>
                <div className="bg-[#181b3a] p-4 rounded-xl border border-[#22244a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#bdbdfc] text-sm">Published</p>
                      <p className="text-2xl font-bold text-green-400">{blogAnalytics?.publishedBlogs || 0}</p>
                    </div>
                    <FiEye className="text-green-400 text-2xl" />
                  </div>
                </div>
                <div className="bg-[#181b3a] p-4 rounded-xl border border-[#22244a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#bdbdfc] text-sm">Total Views</p>
                      <p className="text-2xl font-bold text-blue-400">{blogAnalytics?.totalViews || 0}</p>
                    </div>
                    <FiTrendingUp className="text-blue-400 text-2xl" />
                  </div>
                </div>
                <div className="bg-[#181b3a] p-4 rounded-xl border border-[#22244a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#bdbdfc] text-sm">Total Likes</p>
                      <p className="text-2xl font-bold text-pink-400">{blogAnalytics?.totalLikes || 0}</p>
                    </div>
                    <FiBookmark className="text-pink-400 text-2xl" />
                  </div>
                </div>
              </div>

              {/* Blog Management */}
              <div className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-[#915eff]">
                    <FiEdit3 className="inline mr-2" />
                    Blog Management
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBlogView(blogView === 'grid' ? 'list' : 'grid')}
                      className="bg-[#0a1026] border border-[#22244a] text-white px-3 py-2 rounded-md hover:bg-[#915eff] transition-colors"
                    >
                      {blogView === 'grid' ? 'List View' : 'Grid View'}
                    </button>
                    <button
                      onClick={handleAddBlog}
                      className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2"
                    >
                      <FiPlus />
                      New Post
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#bdbdfc]" />
                      <input
                        type="text"
                        placeholder="Search posts by title, content, or tags..."
                        value={blogSearchTerm}
                        onChange={(e) => setBlogSearchTerm(e.target.value)}
                        className="w-full bg-[#0a1026] border border-[#22244a] rounded-md pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={blogFilterStatus}
                    onChange={(e) => setBlogFilterStatus(e.target.value)}
                    className="bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                  <select
                    value={blogFilterCategory}
                    onChange={(e) => setBlogFilterCategory(e.target.value)}
                    className="bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Blog Posts */}
                {blogsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                    <span className="text-[#bdbdfc]">Loading blogs...</span>
                  </div>
                ) : blogView === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBlogs.map((blog) => (
                      <div key={blog._id} className="bg-[#0a1026] rounded-lg border border-[#22244a] overflow-hidden hover:border-[#915eff] transition-colors">
                        {blog.featured && (
                          <div className="bg-gradient-to-r from-[#915eff] to-[#7a4eea] text-white text-xs px-3 py-1">
                            ⭐ Featured
                          </div>
                        )}
                        <img
                          src={blog.featuredImage || '/api/placeholder/400/200'}
                          alt={blog.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              blog.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                              blog.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {blog.status}
                            </span>
                            <span className="text-xs text-[#bdbdfc]">{blog.category}</span>
                          </div>
                          <h4 className="text-white font-semibold mb-2 line-clamp-2">{blog.title}</h4>
                          <p className="text-[#bdbdfc] text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {blog.tags?.slice(0, 2).map((tag, index) => (
                              <span key={index} className="bg-[#915eff]/20 text-[#915eff] px-2 py-1 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#bdbdfc] mb-3">
                            <span className="flex items-center gap-1">
                              <FiEye size={12} />
                              {blog.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock size={12} />
                              {blog.readTime} min read
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} />
                              {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Not published'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <select
                              value={blog.status}
                              onChange={(e) => handleBlogStatusChange(blog._id, e.target.value)}
                              disabled={blogsLoading}
                              className="text-xs bg-[#181b3a] border border-[#22244a] rounded px-2 py-1 text-white disabled:opacity-50"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Published">Published</option>
                              <option value="Scheduled">Scheduled</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditBlog(blog)}
                                disabled={blogsLoading}
                                className="text-[#915eff] hover:text-[#7a4eea] p-1 disabled:opacity-50"
                                title="Edit Post"
                              >
                                <FiEdit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog._id)}
                                disabled={blogsLoading}
                                className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                                title="Delete Post"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentBlogs.map((blog) => (
                      <div key={blog._id} className="bg-[#0a1026] rounded-lg border border-[#22244a] p-4 hover:border-[#915eff] transition-colors">
                        <div className="flex items-start gap-4">
                          <img
                            src={blog.featuredImage || '/api/placeholder/80/80'}
                            alt={blog.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {blog.featured && <span className="text-yellow-400 text-sm">⭐</span>}
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                blog.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                                blog.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {blog.status}
                              </span>
                              <span className="text-xs text-[#bdbdfc]">{blog.category}</span>
                              <span className="text-xs text-[#bdbdfc]">{blog.readTime} min read</span>
                            </div>
                            <h4 className="text-white font-semibold mb-1">{blog.title}</h4>
                            <p className="text-[#bdbdfc] text-sm mb-2">{blog.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-[#bdbdfc]">
                                <span className="flex items-center gap-1">
                                  <FiEye size={12} />
                                  {blog.views} views
                                </span>
                                <span>{blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Not published'}</span>
                              </div>
                              <div className="flex gap-2">
                                <select
                                  value={blog.status}
                                  onChange={(e) => handleBlogStatusChange(blog._id, e.target.value)}
                                  disabled={blogsLoading}
                                  className="text-xs bg-[#181b3a] border border-[#22244a] rounded px-2 py-1 text-white disabled:opacity-50"
                                >
                                  <option value="Draft">Draft</option>
                                  <option value="Published">Published</option>
                                  <option value="Scheduled">Scheduled</option>
                                </select>
                                <button
                                  onClick={() => handleEditBlog(blog)}
                                  disabled={blogsLoading}
                                  className="text-[#915eff] hover:text-[#7a4eea] p-1 disabled:opacity-50"
                                >
                                  <FiEdit3 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  disabled={blogsLoading}
                                  className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Blog Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-[#bdbdfc]">
                    Showing {blogIndexOfFirst + 1} to {Math.min(blogIndexOfLast, filteredBlogs.length)} of {filteredBlogs.length} posts
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBlogCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={blogCurrentPage === 1}
                      className="px-3 py-1 rounded-md bg-[#0a1026] border border-[#22244a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#915eff] transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: blogTotalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setBlogCurrentPage(page)}
                        className={`px-3 py-1 rounded-md border transition-colors ${
                          blogCurrentPage === page
                            ? 'bg-[#915eff] border-[#915eff] text-white'
                            : 'bg-[#0a1026] border-[#22244a] text-white hover:bg-[#915eff]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setBlogCurrentPage(prev => Math.min(prev + 1, blogTotalPages))}
                      disabled={blogCurrentPage === blogTotalPages}
                      className="px-3 py-1 rounded-md bg-[#0a1026] border border-[#22244a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#915eff] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]"
            >
              {usersLoading && (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-[#915eff]/20 border-t-[#915eff] rounded-full animate-spin mr-3"></div>
                  <span className="text-[#bdbdfc]">Loading users...</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#915eff]">
                  <FiUser className="inline mr-2" />
                  User Management
                </h3>
                <button
                  onClick={handleAddUser}
                  className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2"
                >
                  <FiPlus />
                  Add User
                </button>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#22244a]">
                  <thead className="bg-[#0a1026]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#bdbdfc] uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#bdbdfc] uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#bdbdfc] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#bdbdfc] uppercase tracking-wider">Join Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#bdbdfc] uppercase tracking-wider">Last Login</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#bdbdfc] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22244a]">
                    {currentUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-[#0a1026]/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#915eff]/20 flex items-center justify-center mr-3">
                              <FiUser className="text-[#915eff]" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-[#bdbdfc]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#bdbdfc]">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                            disabled={usersLoading}
                            className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#915eff] disabled:opacity-50 ${
                              user.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                              user.status === 'Inactive' ? 'bg-gray-500/20 text-gray-400' :
                              'bg-red-500/20 text-red-400'
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#bdbdfc]">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#bdbdfc]">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              disabled={usersLoading}
                              className="text-[#915eff] hover:text-[#7a4eea] p-1 disabled:opacity-50"
                              title="Edit User"
                            >
                              <FiEdit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={usersLoading}
                              className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                              title="Delete User"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-[#bdbdfc]">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-[#0a1026] border border-[#22244a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#915eff] transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md border transition-colors ${
                        currentPage === page
                          ? 'bg-[#915eff] border-[#915eff] text-white'
                          : 'bg-[#0a1026] border-[#22244a] text-white hover:bg-[#915eff]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-[#0a1026] border border-[#22244a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#915eff] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#181b3a] p-6 rounded-xl border border-[#22244a]"
            >
              <h3 className="text-xl font-semibold mb-6 text-[#915eff]">Settings</h3>
              <div className="space-y-6">
                <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                  <h4 className="text-white font-medium mb-2">API Configuration</h4>
                  <p className="text-[#bdbdfc] text-sm mb-4">Configure your backend API endpoints</p>
                  <div className="space-y-3">
                    <input
                      placeholder="API Base URL"
                      className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white"
                    />
                    <input
                      placeholder="API Key"
                      type="password"
                      className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                  <h4 className="text-white font-medium mb-2">Data Management</h4>
                  <p className="text-[#bdbdfc] text-sm mb-4">Export or import your portfolio data</p>
                  <div className="flex gap-3">
                    <button className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors">
                      Export Data
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                      Import Data
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181b3a] rounded-xl shadow-lg p-6 w-full max-w-4xl border border-[#22244a] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h3>
              <button
                onClick={() => {
                  setShowBlogModal(false);
                  setEditingBlog(null);
                }}
                className="text-[#bdbdfc] hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={blogFormHook.handleSubmit(onBlogSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Title</label>
                  <input
                    {...blogFormHook.register("title")}
                    onChange={(e) => {
                      blogFormHook.setValue("title", e.target.value);
                      if (!blogFormHook.watch("slug")) {
                        blogFormHook.setValue("slug", generateSlug(e.target.value));
                      }
                    }}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                    placeholder="Enter blog post title"
                  />
                  {blogFormHook.formState.errors.title && (
                    <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Slug (URL)</label>
                  <input
                    {...blogFormHook.register("slug")}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                    placeholder="blog-post-url"
                  />
                  {blogFormHook.formState.errors.slug && (
                    <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Excerpt</label>
                  <textarea
                    {...blogFormHook.register("excerpt")}
                    rows={3}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent resize-none"
                    placeholder="Brief description of the blog post"
                  />
                  {blogFormHook.formState.errors.excerpt && (
                    <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.excerpt.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Content</label>
                  <textarea
                    {...blogFormHook.register("content")}
                    rows={12}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent resize-none"
                    placeholder="Write your blog content here... (HTML supported)"
                  />
                  {blogFormHook.formState.errors.content && (
                    <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.content.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">
                    <FiImage className="inline mr-2" />
                    Featured Image
                  </label>
                  
                  {/* Image Preview */}
                  <div className="mb-4">
                    <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-[#915eff] bg-[#181b3a] flex items-center justify-center">
                      {blogFormHook.watch("featuredImage") ? (
                        <img
                          src={blogFormHook.watch("featuredImage")}
                          alt="Featured Image Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <FiImage className="text-[#915eff] text-2xl mx-auto mb-1" />
                          <p className="text-[#bdbdfc] text-xs">No featured image</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleFeaturedImageClick}
                        className="bg-[#915eff] text-white px-4 py-2 rounded-md hover:bg-[#7a4eea] transition-colors flex items-center gap-2 mb-2"
                      >
                        <FiUpload size={16} />
                        Upload Image
                      </button>
                      <p className="text-[#bdbdfc] text-xs">Recommended: 1200x630px, JPG/PNG</p>
                    </div>
                  </div>
                  
                  {/* URL Input */}
                  <input
                    {...blogFormHook.register("featuredImage")}
                    placeholder="Or paste image URL"
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  />
                  
                  {/* Hidden file input */}
                  <input
                    ref={featuredImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'featured')}
                    className="hidden"
                  />
                  
                  {blogFormHook.formState.errors.featuredImage && (
                    <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.featuredImage.message}</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                  <h4 className="text-white font-medium mb-3">Publish Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[#bdbdfc] mb-1">Status</label>
                      <select
                        {...blogFormHook.register("status")}
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#bdbdfc] mb-1">Category</label>
                      <select
                        {...blogFormHook.register("category")}
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {blogFormHook.formState.errors.category && (
                        <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.category.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          {...blogFormHook.register("featured")}
                          type="checkbox"
                          className="w-4 h-4 text-[#915eff] bg-[#181b3a] border-[#22244a] rounded focus:ring-[#915eff]"
                        />
                        <span className="text-sm text-white">Featured Post</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                  <h4 className="text-white font-medium mb-3">Tags</h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBlogTag())}
                    />
                    <button
                      type="button"
                      onClick={addBlogTag}
                      className="bg-[#915eff] text-white px-3 py-2 rounded-md hover:bg-[#7a4eea] transition-colors text-sm"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blogFormHook.watch("tags").map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#915eff]/20 text-[#915eff] px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeBlogTag(tag)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {blogFormHook.formState.errors.tags && (
                    <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.tags.message}</p>
                  )}
                </div>

                {/* SEO Settings */}
                <div className="bg-[#0a1026] p-4 rounded-lg border border-[#22244a]">
                  <h4 className="text-white font-medium mb-3">SEO Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[#bdbdfc] mb-1">SEO Title</label>
                      <input
                        {...blogFormHook.register("seo.title")}
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm"
                        placeholder="SEO optimized title"
                      />
                      {blogFormHook.formState.errors.seo?.title && (
                        <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.seo.title.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-[#bdbdfc] mb-1">Meta Description</label>
                      <textarea
                        {...blogFormHook.register("seo.description")}
                        rows={3}
                        className="w-full bg-[#181b3a] border border-[#22244a] rounded-md px-3 py-2 text-white text-sm resize-none"
                        placeholder="SEO meta description"
                      />
                      {blogFormHook.formState.errors.seo?.description && (
                        <p className="text-red-400 text-sm mt-1">{blogFormHook.formState.errors.seo.description.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 flex justify-end space-x-3 pt-4 border-t border-[#22244a]">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlogModal(false);
                    setEditingBlog(null);
                    blogFormHook.reset();
                  }}
                  className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    blogFormHook.setValue("status", "Draft");
                    blogFormHook.handleSubmit(onBlogSubmit)();
                  }}
                  className="px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  <FiSave />
                  Save Draft
                </button>
                <button
                  type="submit"
                  onClick={() => blogFormHook.setValue("status", "Published")}
                  className="px-4 py-2 rounded-md text-white bg-[#915eff] hover:bg-[#7a4eea] transition-colors flex items-center gap-2"
                >
                  <FiEye />
                  {editingBlog ? "Update" : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181b3a] rounded-xl shadow-lg p-6 w-full max-w-md border border-[#22244a]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingUser ? "Edit User" : "Add User"}
              </h3>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                className="text-[#bdbdfc] hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  placeholder="Enter user name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 rounded-md text-white bg-[#915eff] hover:bg-[#7a4eea] transition-colors flex items-center gap-2"
              >
                <FiSave />
                {editingUser ? "Update" : "Create"} User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181b3a] rounded-xl shadow-lg p-6 w-full max-w-2xl border border-[#22244a] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingProject ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={() => {
                  setShowProjectModal(false);
                  setEditingProject(null);
                  projectForm.reset();
                }}
                className="text-[#bdbdfc] hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Project Name</label>
                  <input
                    {...projectForm.register("name")}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  />
                  {projectForm.formState.errors.name && (
                    <p className="text-red-400 text-sm mt-1">{projectForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Status</label>
                  <select
                    {...projectForm.register("status")}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Description</label>
                <textarea
                  {...projectForm.register("description")}
                  rows={3}
                  className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                />
                {projectForm.formState.errors.description && (
                  <p className="text-red-400 text-sm mt-1">{projectForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Image URL</label>
                  <input
                    {...projectForm.register("image")}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Source Code URL</label>
                  <input
                    {...projectForm.register("source_code_link")}
                    className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bdbdfc] mb-2">Live Demo URL (Optional)</label>
                <input
                  {...projectForm.register("live_demo_link")}
                  className="w-full bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#bdbdfc]">Tags</label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-[#915eff] hover:text-[#7a4eea] text-sm flex items-center gap-1"
                  >
                    <FiPlus size={14} />
                    Add Tag
                  </button>
                </div>
                {projectForm.watch("tags")?.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      {...projectForm.register(`tags.${index}.name`)}
                      placeholder="Tag name"
                      className="flex-1 bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                    />
                    <select
                      {...projectForm.register(`tags.${index}.color`)}
                      className="bg-[#0a1026] border border-[#22244a] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#915eff] focus:border-transparent"
                    >
                      <option value="blue-text-gradient">Blue</option>
                      <option value="green-text-gradient">Green</option>
                      <option value="pink-text-gradient">Pink</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-400 hover:text-red-300 px-2"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>

              {/* Home Page Checkbox */}
              <div className="border-t border-[#22244a] pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToHomePage}
                    onChange={(e) => setAddToHomePage(e.target.checked)}
                    className="w-4 h-4 text-[#915eff] bg-[#0a1026] border-[#22244a] rounded focus:ring-[#915eff] focus:ring-2"
                  />
                  <div>
                    <span className="text-white font-medium">
                      <FiHome className="inline mr-2" />
                      Add this project to Home Page
                    </span>
                    <p className="text-[#bdbdfc] text-sm">
                      This project will be displayed in the home page hero section
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                    setAddToHomePage(false);
                    projectForm.reset();
                  }}
                  className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-[#915eff] hover:bg-[#7a4eea] transition-colors flex items-center gap-2"
                >
                  <FiSave />
                  {editingProject ? "Update" : "Create"} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;