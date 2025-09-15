import React, { useState } from 'react';
import HistoryList from '../components/History/HistoryList';
import GeneratedContent from '../components/Dashboard/GeneratedContent';
import { generationAPI } from '../services/api';

const History = () => {
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  const handleSelectGeneration = (generation) => {
    setSelectedGeneration(generation);
  };

  const handleBackToList = () => {
    setSelectedGeneration(null);
  };

  const handleFavoriteToggle = async (generationId) => {
    try {
      const updatedGeneration = await generationAPI.updateGeneration(generationId, {
        is_favorited: !selectedGeneration.is_favorited
      });
      setSelectedGeneration(updatedGeneration.data);
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite status');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {selectedGeneration ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Generation Details</h2>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleBackToList}
                >
                  ← Back to History
                </button>
              </div>
              <GeneratedContent
                generationData={selectedGeneration}
                onFavorite={handleFavoriteToggle}
              />
            </>
          ) : (
            <HistoryList onSelectGeneration={handleSelectGeneration} />
          )}
        </div>
      </div>
    </div>
  );
};

export default History;