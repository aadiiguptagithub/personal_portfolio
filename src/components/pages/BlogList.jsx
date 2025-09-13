import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlog } from "../context/BlogContext";
import { styles } from "../../config/styles";
import { fadeIn, textVariant } from "../../utils/motion";

const BlogCard = ({ blog, index, featured = false }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.1, 0.75)}
    className={`bg-tertiary rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 ${featured ? 'lg:col-span-1' : ''}`}
  >
    <div className="relative">
      <img 
        src={blog.featuredImage || '/api/placeholder/400/200'} 
        alt={blog.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="absolute top-4 left-4">
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {featured ? 'Featured' : 'Latest'}
        </span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2 text-white text-sm">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
          {blog.views || 0}
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-secondary text-sm">{blog.category}</span>
        <span className="text-secondary text-sm">•</span>
        <span className="text-secondary text-sm">{blog.readTime} min read</span>
      </div>
      <h3 className="text-white text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
      <p className="text-secondary text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="text-secondary text-sm">
          {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Draft'}
        </span>
        <Link 
          to={`/blog/${blog._id}`}
          className="text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors"
        >
          Read Article →
        </Link>
      </div>
    </div>
  </motion.div>
);

const BlogList = () => {
  const { featuredBlogs, latestBlogs, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, loading } = useBlog();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-400/20 border-t-violet-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary relative z-0">
      <div className="pt-32 pb-24 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div variants={textVariant()} className="text-center mb-16">
            <h1 className="text-white text-5xl font-bold mb-4">
              Our <span className="text-violet-400">Blog</span>
            </h1>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Explore our collection of articles covering web development, programming best practices, and the latest trends in technology.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-tertiary text-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-violet-400 transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-violet-500 text-white'
                        : 'bg-tertiary text-secondary hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Articles */}
          {featuredBlogs.length > 0 && (
            <div className="mb-20">
              <motion.h2 
                variants={textVariant()}
                className="text-white text-3xl font-bold mb-8"
              >
                Featured Articles
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBlogs.map((blog, index) => (
                  <BlogCard key={blog._id} blog={blog} index={index} featured={true} />
                ))}
              </div>
            </div>
          )}

          {/* Latest Articles */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <motion.h2 
                variants={textVariant()}
                className="text-white text-3xl font-bold"
              >
                Latest Articles
              </motion.h2>
              <span className="text-secondary text-sm">{latestBlogs.length} Articles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} index={index + featuredBlogs.length} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
