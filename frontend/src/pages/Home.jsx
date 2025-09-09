import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container">
      <div className="hero">
        <h1>AI-Powered Marketing Content Generator</h1>
        <p>
          Transform your product ideas into compelling marketing content with AI. 
          Generate SEO-optimized descriptions, social media ads, and email campaigns 
          in seconds.
        </p>
        
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Generating Content
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature">
          <h3>🎯 SEO-Optimized Descriptions</h3>
          <p>
            Generate compelling product descriptions that rank well in search engines 
            and convert visitors into customers.
          </p>
        </div>
        
        <div className="feature">
          <h3>📱 Social Media Ad Copy</h3>
          <p>
            Create engaging ad copy variations for Facebook, Instagram, and other 
            social media platforms that drive clicks and sales.
          </p>
        </div>
        
        <div className="feature">
          <h3>📧 Email Marketing Content</h3>
          <p>
            Craft perfect email marketing blurbs for product launches, promotions, 
            and newsletter announcements.
          </p>
        </div>
        
        <div className="feature">
          <h3>⚡ Lightning Fast</h3>
          <p>
            Get professional marketing content in seconds, not hours. 
            Perfect for dropshippers and small businesses.
          </p>
        </div>
        
        <div className="feature">
          <h3>🎨 Multiple Tones</h3>
          <p>
            Choose from professional, playful, luxury, or informative tones 
            to match your brand voice perfectly.
          </p>
        </div>
        
        <div className="feature">
          <h3>💾 Save & Edit</h3>
          <p>
            Save your favorite generations, edit content as needed, 
            and build your marketing content library.
          </p>
        </div>
      </div>

      {!isAuthenticated && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '4rem', 
          padding: '2rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to transform your marketing?</h2>
          <p style={{ marginBottom: '2rem', color: '#64748b' }}>
            Join thousands of entrepreneurs and marketers who trust our AI to create 
            compelling content that sells.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Your Free Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;