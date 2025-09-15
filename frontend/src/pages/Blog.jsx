import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/blog/${selectedCategory ? `?category=${selectedCategory}` : ''}`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/blog/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const generateContent = async () => {
    try {
      setLoading(true);
      await api.post('/blog/auto-generate');
      await fetchPosts();
      alert('Successfully generated new blog posts!');
    } catch (err) {
      console.error('Error generating content:', err);
      alert('Failed to generate blog posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-5 mb-3">AI Marketing Blog</h1>
          <p className="lead text-muted">
            Latest insights, trends, and tips for AI-powered marketing success
          </p>
        </div>
        <div className="col-md-4 text-end">
          {user && (
            <button
              className="btn btn-primary me-2"
              onClick={generateContent}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory('')}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="row">
        {posts.length === 0 ? (
          <div className="col-12 text-center">
            <div className="py-5">
              <h3>No blog posts found</h3>
              <p className="text-muted">
                {user ? 'Generate some content to get started!' : 'Check back soon for new content.'}
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                {post.featured_image_url && (
                  <img
                    src={post.featured_image_url}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    {post.category && (
                      <span className="badge bg-primary me-2">{post.category}</span>
                    )}
                    <small className="text-muted">
                      {new Date(post.created_at).toLocaleDateString()}
                    </small>
                  </div>

                  <h5 className="card-title">{post.title}</h5>

                  {post.excerpt && (
                    <p className="card-text text-muted flex-grow-1">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Read More
                      </Link>
                      <small className="text-muted">
                        <i className="fas fa-eye"></i> {post.view_count}
                      </small>
                    </div>

                    {post.tags && (
                      <div className="mt-2">
                        {post.tags.split(',').slice(0, 3).map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-1">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SEO Benefits Section */}
      <div className="row mt-5 py-5 bg-light rounded">
        <div className="col-12 text-center">
          <h2 className="mb-4">Why Our AI Marketing Blog Drives Results</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-search fa-3x text-primary mb-3"></i>
              </div>
              <h5>SEO Optimized</h5>
              <p className="text-muted">Every post is optimized for search engines with proper keywords and structure.</p>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-calendar-day fa-3x text-primary mb-3"></i>
              </div>
              <h5>Daily Content</h5>
              <p className="text-muted">Fresh, AI-generated content published daily to keep your audience engaged.</p>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-share-alt fa-3x text-primary mb-3"></i>
              </div>
              <h5>Social Ready</h5>
              <p className="text-muted">Content designed for social sharing to expand your reach organically.</p>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
              </div>
              <h5>Growth Focused</h5>
              <p className="text-muted">Proven strategies that drive traffic, engagement, and conversions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;