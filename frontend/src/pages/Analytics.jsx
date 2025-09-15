import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generationAPI } from '../services/api';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalBlogPosts: 0,
    totalViews: 0,
    favoriteCount: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch generation history
      const generationsResponse = await generationAPI.getHistory();
      const generations = generationsResponse.data;

      // Fetch blog posts
      let blogPosts = [];
      try {
        const blogResponse = await api.get('/blog/admin/posts');
        blogPosts = blogResponse.data;
      } catch (err) {
        console.log('Blog posts not available:', err);
      }

      // Calculate stats
      const totalGenerations = generations.length;
      const favoriteCount = generations.filter(g => g.is_favorited).length;
      const totalBlogPosts = blogPosts.length;
      const totalViews = blogPosts.reduce((sum, post) => sum + (post.view_count || 0), 0);

      // Recent activity
      const recentActivity = [
        ...generations.slice(0, 5).map(g => ({
          type: 'generation',
          title: `Generated content for "${g.product_name}"`,
          date: g.created_at,
          icon: 'fas fa-magic'
        })),
        ...blogPosts.slice(0, 3).map(p => ({
          type: 'blog',
          title: `Published blog post: "${p.title}"`,
          date: p.created_at,
          icon: 'fas fa-blog'
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

      setStats({
        totalGenerations,
        totalBlogPosts,
        totalViews,
        favoriteCount,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
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
      <h1 className="display-5 mb-4">Analytics Dashboard</h1>

      {/* Key Metrics */}
      <div className="row mb-5">
        <div className="col-md-3 mb-4">
          <div className="card text-center h-100 border-primary">
            <div className="card-body">
              <i className="fas fa-magic fa-3x text-primary mb-3"></i>
              <h3 className="text-primary">{stats.totalGenerations}</h3>
              <p className="card-text">Total Content Generated</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card text-center h-100 border-success">
            <div className="card-body">
              <i className="fas fa-star fa-3x text-success mb-3"></i>
              <h3 className="text-success">{stats.favoriteCount}</h3>
              <p className="card-text">Favorite Content</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card text-center h-100 border-info">
            <div className="card-body">
              <i className="fas fa-blog fa-3x text-info mb-3"></i>
              <h3 className="text-info">{stats.totalBlogPosts}</h3>
              <p className="card-text">Blog Posts Published</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card text-center h-100 border-warning">
            <div className="card-body">
              <i className="fas fa-eye fa-3x text-warning mb-3"></i>
              <h3 className="text-warning">{stats.totalViews}</h3>
              <p className="card-text">Total Blog Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Tips */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Growth Strategies in Action
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>✅ SEO Optimization</h6>
                  <ul>
                    <li>Meta tags implemented for better search visibility</li>
                    <li>Schema markup added for rich snippets</li>
                    <li>Blog content optimized with keywords</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>✅ Content Marketing</h6>
                  <ul>
                    <li>Automated blog system for daily content</li>
                    <li>Social sharing integration</li>
                    <li>View tracking for engagement metrics</li>
                  </ul>
                </div>
              </div>
              <div className="alert alert-info mt-3">
                <strong>Next Steps:</strong> Set up Google Analytics, create backlink tracking, and implement email marketing automation.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              {stats.recentActivity.length === 0 ? (
                <p className="text-muted">No recent activity</p>
              ) : (
                <div className="timeline">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="d-flex mb-3">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-light rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                          <i className={`${activity.icon} text-primary`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{activity.title}</h6>
                        <small className="text-muted">
                          {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body d-grid gap-2">
              <button
                className="btn btn-primary"
                onClick={() => window.location.href = '/dashboard'}
              >
                <i className="fas fa-magic me-2"></i>
                Generate Content
              </button>
              <button
                className="btn btn-info"
                onClick={() => window.location.href = '/blog'}
              >
                <i className="fas fa-blog me-2"></i>
                View Blog
              </button>
              <button
                className="btn btn-success"
                onClick={fetchAnalytics}
              >
                <i className="fas fa-sync me-2"></i>
                Refresh Data
              </button>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">Growth Resources</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google Search Console</a></li>
                <li><a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">Google Analytics</a></li>
                <li><a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer">SEMrush (Backlink Analysis)</a></li>
                <li><a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer">Ahrefs (SEO Tools)</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;