import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">
                AI-Powered Marketing Content Generator
              </h1>
              <p className="lead mb-4">
                Transform your product information into compelling marketing content with AI.
                Generate SEO-optimized descriptions, social media ads, and email campaigns in seconds.
              </p>
              {user ? (
                <Link to="/dashboard" className="btn btn-light btn-lg me-3">
                  Go to Dashboard
                </Link>
              ) : (
                <div>
                  <Link to="/register" className="btn btn-light btn-lg me-3">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 mb-3">Powerful AI Marketing Tools</h2>
              <p className="lead text-muted">
                Everything you need to create compelling marketing content for your products
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center p-4">
                <div className="card-body">
                  <div className="mb-3">
                    <i className="fas fa-file-alt fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">SEO-Optimized Descriptions</h5>
                  <p className="card-text">
                    Generate 200-300 word product descriptions that rank higher in search engines
                    and convert visitors into customers.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card feature-card h-100 text-center p-4">
                <div className="card-body">
                  <div className="mb-3">
                    <i className="fas fa-share-alt fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Social Media Ads</h5>
                  <p className="card-text">
                    Create 3 unique ad variations optimized for Facebook, Twitter, and LinkedIn
                    with compelling calls-to-action.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card feature-card h-100 text-center p-4">
                <div className="card-body">
                  <div className="mb-3">
                    <i className="fas fa-envelope fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Email Marketing</h5>
                  <p className="card-text">
                    Generate complete email campaigns with subject lines and compelling body
                    content that drives conversions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 mb-3">How It Works</h2>
              <p className="lead text-muted">
                Generate professional marketing content in 3 simple steps
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                  1
                </div>
              </div>
              <h5>Input Product Details</h5>
              <p className="text-muted">
                Enter your product name, features, target audience, and other details
                to help AI understand your product.
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                  2
                </div>
              </div>
              <h5>AI Generates Content</h5>
              <p className="text-muted">
                Our advanced AI analyzes your input and generates compelling marketing
                content tailored to your needs.
              </p>
            </div>

            <div className="col-md-4 text-center">
              <div className="mb-3">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                  3
                </div>
              </div>
              <h5>Use & Manage</h5>
              <p className="text-muted">
                Copy, edit, favorite, and manage all your generated content
                from your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-5">
          <div className="container text-center">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2 className="display-5 mb-3">Ready to Get Started?</h2>
                <p className="lead mb-4">
                  Join thousands of marketers who trust our AI to create compelling content.
                  Sign up for free and start generating marketing content today!
                </p>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start Creating Content
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;