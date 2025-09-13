import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useBlog } from "../context/BlogContext";
import { fadeIn, textVariant } from "../../utils/motion";
import { FiThumbsUp, FiMessageCircle, FiBookmark, FiTwitter, FiFacebook, FiLink, FiArrowLeft, FiEye } from "react-icons/fi";

const BlogDetail = () => {
  const { id } = useParams();
  const { getBlogById, blogs, trackView, toggleLike } = useBlog();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blogData = await getBlogById(id);
        if (blogData) {
          setBlog(blogData);
          setLikes(blogData.likes || 0);
          // Track view when blog is loaded
          await trackView(id);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBlog();
    }
  }, [id, getBlogById, trackView]);
  
  const relatedBlogs = blogs.filter(b => b._id !== blog?._id && b.category === blog?.category).slice(0, 3);
  
  const handleLike = async () => {
    try {
      const action = hasLiked ? 'unlike' : 'like';
      const result = await toggleLike(id, action);
      if (result) {
        setLikes(result.likes);
        setHasLiked(!hasLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-400/20 border-t-violet-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-4">Blog Not Found</h1>
          <Link to="/blog" className="text-violet-400 hover:text-violet-300 transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img 
          src={blog.featuredImage || '/api/placeholder/1200/600'} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-8 left-0 right-0 z-10 px-6 sm:px-16">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-black/40 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div variants={textVariant()} className="mb-6">
              <span className="inline-block bg-violet-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>
              <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{blog.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{blog.author}</p>
                    <p className="text-sm text-white/60">
                      {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'Draft'} • {blog.readTime} min read
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 text-sm ml-auto">
                    <span className="flex items-center gap-1">
                      <FiEye className="w-4 h-4" />
                      {blog.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiThumbsUp className="w-4 h-4" />
                      {likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-20 px-6 sm:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <motion.article 
              variants={fadeIn("up", "tween", 0.2, 0.8)}
              className="lg:w-2/3"
            >
              {/* Article Actions */}
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/10">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${
                      hasLiked ? 'text-violet-400' : 'text-secondary hover:text-white'
                    }`}
                  >
                    <FiThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} /> {likes}
                  </button>
                  <button className="flex items-center gap-2 text-secondary hover:text-white transition-colors">
                    <FiMessageCircle className="w-5 h-5" /> 8
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 transition-colors ${
                      isBookmarked ? 'text-violet-400' : 'text-secondary hover:text-white'
                    }`}
                  >
                    <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-secondary text-sm">Share:</span>
                  <button className="text-secondary hover:text-white transition-colors p-2">
                    <FiTwitter className="w-5 h-5" />
                  </button>
                  <button className="text-secondary hover:text-white transition-colors p-2">
                    <FiFacebook className="w-5 h-5" />
                  </button>
                  <button className="text-secondary hover:text-white transition-colors p-2">
                    <FiLink className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <div 
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  className="text-white/90 leading-relaxed"
                  style={{ lineHeight: '1.8' }}
                />
              </div>

              {/* Tags */}
              <div className="mb-12">
                <h3 className="text-white text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-tertiary text-secondary px-3 py-1 rounded-full text-sm hover:bg-violet-500 hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside 
              variants={fadeIn("left", "tween", 0.3, 0.8)}
              className="lg:w-1/3 space-y-8 lg:pl-8"
            >
              {/* Author Card */}
              <div className="bg-tertiary rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{blog.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{blog.author}</h3>
                    <p className="text-secondary text-sm">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-secondary text-sm mb-4">
                  Passionate developer sharing insights about modern web technologies and best practices.
                </p>
                <Link 
                  to="/about-us" 
                  className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                >
                  View Profile →
                </Link>
              </div>

              {/* Table of Contents */}
              <div className="bg-tertiary rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Table of Contents</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-secondary hover:text-violet-400 transition-colors">Introduction</a></li>
                  <li><a href="#" className="text-secondary hover:text-violet-400 transition-colors">Key Concepts</a></li>
                  <li><a href="#" className="text-secondary hover:text-violet-400 transition-colors">Best Practices</a></li>
                  <li><a href="#" className="text-secondary hover:text-violet-400 transition-colors">Conclusion</a></li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-2xl p-6 border border-violet-500/20">
                <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
                <p className="text-secondary text-sm mb-4">
                  Get the latest articles and insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full bg-tertiary text-white px-4 py-2 rounded-lg outline-none border border-white/10 focus:border-violet-400 transition-colors text-sm"
                  />
                  <button className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2 rounded-lg font-medium transition-colors text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <div className="py-24 px-6 sm:px-16 bg-black-100">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              variants={textVariant()}
              className="text-white text-3xl font-bold mb-16 text-center"
            >
              Related Articles
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog._id}
                  variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                  className="bg-tertiary rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <img 
                    src={relatedBlog.featuredImage || '/api/placeholder/400/200'} 
                    alt={relatedBlog.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-8">
                    <span className="text-violet-400 text-sm font-medium">{relatedBlog.category}</span>
                    <h3 className="text-white font-semibold mt-3 mb-4 line-clamp-2 text-lg">{relatedBlog.title}</h3>
                    <p className="text-secondary text-sm mb-6 line-clamp-3 leading-relaxed">{relatedBlog.excerpt}</p>
                    <Link 
                      to={`/blog/${relatedBlog._id}`}
                      className="text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
