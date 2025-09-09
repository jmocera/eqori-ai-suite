import React, { useState } from 'react';
import ProductForm from '../components/Dashboard/ProductForm';
import GeneratedContent from '../components/Dashboard/GeneratedContent';
import { generationAPI } from '../services/api';

const Dashboard = () => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generationAPI.generateContent(productData);
      setGeneratedContent(result);
    } catch (error) {
      setError('Failed to generate content. Please try again.');
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpdate = (updatedContent) => {
    setGeneratedContent(updatedContent);
  };

  const handleNewGeneration = () => {
    setGeneratedContent(null);
    setError(null);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Content Generator
        </h1>
        <p style={{ color: '#64748b' }}>
          Create AI-powered marketing content for your products
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {!generatedContent ? (
          <ProductForm onSubmit={handleFormSubmit} loading={loading} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Your Generated Content</h2>
              <button
                onClick={handleNewGeneration}
                className="btn btn-primary"
              >
                Generate New Content
              </button>
            </div>
            
            <GeneratedContent 
              content={generatedContent} 
              onUpdate={handleContentUpdate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;