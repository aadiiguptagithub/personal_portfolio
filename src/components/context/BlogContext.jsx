import React, { createContext, useContext, useState, useEffect } from 'react';
import { blogsAPI } from '../../services/api';

const BlogContext = createContext();

const blogData = [
  {
    id: 1,
    title: "Building Modern React Applications",
    excerpt: "Learn how to build scalable and maintainable React applications using modern development practices and tools.",
    content: `
      <h2>Introduction to Modern React Development</h2>
      <p>React has evolved significantly over the years, and modern React development involves understanding hooks, context, and performance optimization techniques.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>Functional Components and Hooks</li>
        <li>State Management with Context API</li>
        <li>Performance Optimization</li>
        <li>Testing Strategies</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>When building React applications, it's important to follow established patterns and practices that ensure your code is maintainable and scalable.</p>
      
      <p>This includes proper component structure, efficient state management, and comprehensive testing strategies.</p>
    `,
    author: "Aditya Gupta",
    date: "Jun 15, 2024",
    readTime: "5 min read",
    category: "React",
    tags: ["React", "JavaScript", "Frontend"],
    image: "/carrent.png",
    featured: true
  },
  {
    id: 2,
    title: "Advanced CSS Grid Techniques",
    excerpt: "Master advanced CSS Grid techniques to create complex and responsive layouts with ease.",
    content: `
      <h2>Mastering CSS Grid</h2>
      <p>CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease.</p>
      
      <h3>Advanced Techniques</h3>
      <ul>
        <li>Grid Template Areas</li>
        <li>Implicit vs Explicit Grids</li>
        <li>Grid Auto-placement</li>
        <li>Responsive Grid Layouts</li>
      </ul>
      
      <p>Understanding these concepts will help you create more sophisticated layouts and improve your CSS skills significantly.</p>
    `,
    author: "Aditya Gupta",
    date: "Jun 10, 2024",
    readTime: "4 min read",
    category: "CSS",
    tags: ["CSS", "Grid", "Layout"],
    image: "/jobit.png",
    featured: true
  },
  {
    id: 3,
    title: "TypeScript Best Practices",
    excerpt: "Discover TypeScript best practices that will help you write more maintainable and type-safe code.",
    content: `
      <h2>TypeScript in Modern Development</h2>
      <p>TypeScript adds static type checking to JavaScript, helping catch errors early and improve code quality.</p>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Proper Type Definitions</li>
        <li>Interface vs Type Aliases</li>
        <li>Generic Types</li>
        <li>Utility Types</li>
      </ul>
      
      <p>Following these practices will help you leverage TypeScript's full potential in your projects.</p>
    `,
    author: "Aditya Gupta",
    date: "Jun 5, 2024",
    readTime: "6 min read",
    category: "TypeScript",
    tags: ["TypeScript", "JavaScript", "Types"],
    image: "/tripguide.png",
    featured: true
  },
  {
    id: 4,
    title: "Building Modern Node.js Applications",
    excerpt: "Learn how to build scalable and maintainable Node.js applications using modern development practices.",
    content: `<h2>Modern Node.js Development</h2><p>Node.js continues to evolve with new features and best practices for building scalable applications.</p>`,
    author: "Aditya Gupta",
    date: "May 28, 2024",
    readTime: "7 min read",
    category: "Node.js",
    tags: ["Node.js", "Backend", "API"],
    image: "/carrent.png",
    featured: false
  },
  {
    id: 5,
    title: "Advanced CSS Grid Techniques",
    excerpt: "Master advanced CSS Grid techniques to create complex and responsive layouts with modern CSS.",
    content: `<h2>Advanced CSS Grid</h2><p>Take your CSS Grid skills to the next level with these advanced techniques and patterns.</p>`,
    author: "Aditya Gupta",
    date: "May 20, 2024",
    readTime: "5 min read",
    category: "CSS",
    tags: ["CSS", "Grid", "Advanced"],
    image: "/jobit.png",
    featured: false
  },
  {
    id: 6,
    title: "JavaScript ES6+ Features",
    excerpt: "Explore the newest JavaScript features and how they can improve your development workflow.",
    content: `<h2>Modern JavaScript Features</h2><p>JavaScript continues to evolve with new features that make development more efficient and enjoyable.</p>`,
    author: "Aditya Gupta",
    date: "May 15, 2024",
    readTime: "4 min read",
    category: "JavaScript",
    tags: ["JavaScript", "ES6+", "Modern"],
    image: "/tripguide.png",
    featured: false
  }
];

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogs({ status: 'Published' });
      const blogData = response.data.blogs || [];
      setBlogs(blogData);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(blogData.map(blog => blog.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBlogs = blogs.filter(blog => blog.featured && blog.status === 'Published');
  const latestBlogs = blogs.filter(blog => !blog.featured && blog.status === 'Published');

  const getBlogById = async (id) => {
    try {
      const response = await blogsAPI.getBlog(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  };

  const getBlogBySlug = async (slug) => {
    try {
      const response = await blogsAPI.getBlogBySlug(slug);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      return null;
    }
  };

  const trackView = async (id) => {
    try {
      await blogsAPI.trackView(id);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const toggleLike = async (id, action) => {
    try {
      const response = await blogsAPI.toggleLike(id, action);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    }
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      loading,
      filteredBlogs,
      featuredBlogs,
      latestBlogs,
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      categories,
      getBlogById,
      getBlogBySlug,
      trackView,
      toggleLike,
      fetchBlogs
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider');
  }
  return context;
};