import React, { useState } from 'react';
import ProductForm from '../components/Dashboard/ProductForm';
import GeneratedContent from '../components/Dashboard/GeneratedContent';
import { generationAPI } from '../services/api';

const Dashboard = () => {
  const [currentGeneration, setCurrentGeneration] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleGenerationComplete = (generationData) => {
    setCurrentGeneration(generationData);
    setShowForm(false);
  };

  const handleFavoriteToggle = async (generationId) => {
    try {
      const updatedGeneration = await generationAPI.updateGeneration(generationId, {
        is_favorited: !currentGeneration.is_favorited
      });
      setCurrentGeneration(updatedGeneration.data);
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite status');
    }
  };

  const handleNewGeneration = () => {
    setCurrentGeneration(null);
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Dashboard</h2>
            {currentGeneration && (
              <button
                className="btn btn-outline-primary"
                onClick={handleNewGeneration}
              >
                Generate New Content
              </button>
            )}
          </div>

          {showForm ? (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <ProductForm onGenerationComplete={handleGenerationComplete} />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <GeneratedContent
                  generationData={currentGeneration}
                  onFavorite={handleFavoriteToggle}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;