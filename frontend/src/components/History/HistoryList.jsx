import React, { useState, useEffect } from 'react';
import { generationAPI } from '../../services/api';

const HistoryList = ({ onSelectGeneration }) => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'favorites'

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    try {
      setLoading(true);
      const data = await generationAPI.getGenerations();
      setGenerations(data);
    } catch (error) {
      setError('Failed to fetch generation history');
      console.error('Failed to fetch generations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (generationId, currentFavorite) => {
    try {
      const updatedGeneration = await generationAPI.updateGeneration(
        generationId,
        { is_favorite: !currentFavorite }
      );
      
      setGenerations(prev =>
        prev.map(gen =>
          gen.id === generationId ? updatedGeneration : gen
        )
      );
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  const handleDelete = async (generationId) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      try {
        await generationAPI.deleteGeneration(generationId);
        setGenerations(prev => prev.filter(gen => gen.id !== generationId));
      } catch (error) {
        console.error('Failed to delete generation:', error);
      }
    }
  };

  const filteredGenerations = generations.filter(gen => {
    if (filter === 'favorites') {
      return gen.is_favorite;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <span className="spinner"></span>
          Loading your content history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center" style={{ color: '#ef4444' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Content History</h2>
        <p className="card-description">
          View and manage your previously generated marketing content
        </p>
      </div>

      {/* Filter Controls */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All ({generations.length})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`btn ${filter === 'favorites' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Favorites ({generations.filter(g => g.is_favorite).length})
        </button>
      </div>

      {filteredGenerations.length === 0 ? (
        <div className="text-center" style={{ padding: '2rem', color: '#64748b' }}>
          {filter === 'favorites' 
            ? "You haven't marked any content as favorites yet."
            : "No content generated yet. Start by creating your first marketing content!"
          }
        </div>
      ) : (
        <div>
          {filteredGenerations.map((generation) => (
            <div key={generation.id} className="generation-card">
              <div className="generation-header">
                <div className="generation-meta">
                  <h3 className="generation-title">{generation.product_name}</h3>
                  <div className="generation-date">
                    {new Date(generation.created_at).toLocaleDateString()} • {generation.product_category}
                  </div>
                  <div style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                    Target: {generation.input_audience} • Tone: {generation.input_tone}
                  </div>
                </div>
                
                <div className="generation-actions">
                  <button
                    onClick={() => handleToggleFavorite(generation.id, generation.is_favorite)}
                    className={`favorite-btn ${generation.is_favorite ? 'active' : ''}`}
                    title={generation.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {generation.is_favorite ? '★' : '☆'}
                  </button>
                  
                  <button
                    onClick={() => onSelectGeneration(generation)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    View
                  </button>
                  
                  <button
                    onClick={() => handleDelete(generation.id)}
                    className="btn btn-danger"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Preview of content */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  <strong>Preview:</strong> {generation.generated_description.substring(0, 150)}
                  {generation.generated_description.length > 150 ? '...' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;