import React, { useState } from 'react';
import HistoryList from '../components/History/HistoryList';
import GeneratedContent from '../components/Dashboard/GeneratedContent';

const History = () => {
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  const handleSelectGeneration = (generation) => {
    setSelectedGeneration(generation);
  };

  const handleBackToList = () => {
    setSelectedGeneration(null);
  };

  const handleContentUpdate = (updatedContent) => {
    setSelectedGeneration(updatedContent);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Content History
        </h1>
        <p style={{ color: '#64748b' }}>
          View and manage your previously generated marketing content
        </p>
      </div>

      {!selectedGeneration ? (
        <HistoryList onSelectGeneration={handleSelectGeneration} />
      ) : (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={handleBackToList}
              className="btn btn-secondary"
            >
              ← Back to History
            </button>
          </div>
          
          <GeneratedContent 
            content={selectedGeneration}
            onUpdate={handleContentUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default History;