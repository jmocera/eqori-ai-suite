import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/blog/${slug}`);
      setPost(response.data);

      // Update page meta for SEO
      if (response.data) {
        document.title = `${response.data.title} | Eqori AI Marketing Blog`;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && response.data.meta_description) {
          metaDescription.setAttribute('content', response.data.meta_description);
        }

        // Update keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && response.data.keywords) {
          metaKeywords.setAttribute('content', response.data.keywords);
        }
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt || post.title;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
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

  if (error || !post) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h2>Post Not Found</h2>
          <p className="text-muted">{error}</p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/blog">Blog</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          <article>
            {/* Post Header */}
            <header className="mb-4">
              {post.category && (
                <span className="badge bg-primary mb-2">{post.category}</span>
              )}

              <h1 className="display-5 mb-3">{post.title}</h1>

              <div className="d-flex justify-content-between align-items-center text-muted mb-3">
                <div>
                  <small>
                    Published on {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                </div>
                <div>
                  <small>
                    <i className="fas fa-eye"></i> {post.view_count} views
                  </small>
                </div>
              </div>

              {post.excerpt && (
                <div className="lead mb-4 p-3 bg-light rounded">
                  {post.excerpt}
                </div>
              )}
            </header>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-4">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="img-fluid rounded"
                />
              </div>
            )}

            {/* Post Content */}
            <div
              className="post-content mb-5"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
              style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
            />

            {/* Tags */}
            {post.tags && (
              <div className="mb-4">
                <h6>Tags:</h6>
                <div>
                  {post.tags.split(',').map((tag, index) => (
                    <span key={index} className="badge bg-light text-dark me-2 mb-1">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div className="border-top pt-4 mb-4">
              <h6>Share this post:</h6>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => shareOnSocial('twitter')}
                >
                  <i className="fab fa-twitter"></i> Twitter
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => shareOnSocial('linkedin')}
                >
                  <i className="fab fa-linkedin"></i> LinkedIn
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => shareOnSocial('facebook')}
                >
                  <i className="fab fa-facebook"></i> Facebook
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={copyToClipboard}
                >
                  <i className="fas fa-link"></i> Copy Link
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '2rem' }}>
            {/* CTA Card */}
            <div className="card mb-4">
              <div className="card-body text-center">
                <h5 className="card-title">Try Our AI Marketing Suite</h5>
                <p className="card-text">
                  Generate SEO-optimized product descriptions, social media ads, and email content in seconds.
                </p>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Related Posts</h6>
              </div>
              <div className="card-body">
                <p className="text-muted">
                  <Link to="/blog" className="text-decoration-none">
                    View all blog posts →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.meta_description || post.excerpt,
            "author": {
              "@type": "Organization",
              "name": "Eqori AI Marketing Suite"
            },
            "datePublished": post.published_at || post.created_at,
            "dateModified": post.updated_at || post.created_at,
            "publisher": {
              "@type": "Organization",
              "name": "Eqori",
              "logo": {
                "@type": "ImageObject",
                "url": "https://eqori-frontend.onrender.com/logo192.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            },
            "keywords": post.keywords
          })
        }}
      />
    </div>
  );
};

export default BlogPost;