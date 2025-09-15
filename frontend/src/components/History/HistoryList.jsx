import React, { useState, useEffect } from 'react';
import { generationAPI } from '../../services/api';

const HistoryList = ({ onSelectGeneration }) => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await generationAPI.getHistory();
      setGenerations(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load generation history');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id, currentStatus) => {
    try {
      await generationAPI.updateGeneration(id, { is_favorited: !currentStatus });
      setGenerations(generations.map(gen =>
        gen.id === id ? { ...gen, is_favorited: !currentStatus } : gen
      ));
    } catch (error) {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite status');
    }
  };

  const deleteGeneration = async (id) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      try {
        await generationAPI.deleteGeneration(id);
        setGenerations(generations.filter(gen => gen.id !== id));
      } catch (error) {
        console.error('Error deleting generation:', error);
        alert('Failed to delete generation');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-2">Loading your generation history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-5">
        <h5>No generations yet</h5>
        <p className="text-muted">Create your first AI-generated marketing content from the Dashboard!</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4">Your Generation History</h3>

      {generations.map((generation) => (
        <div key={generation.id} className="history-item">
          <div className="row">
            <div className="col-md-8">
              <h5 className="mb-2">
                {generation.product_name}
                {generation.is_favorited && (
                  <span className="text-warning ms-2" title="Favorited">★</span>
                )}
              </h5>

              <div className="mb-2">
                {generation.category && (
                  <span className="badge bg-secondary me-2">{generation.category}</span>
                )}
                {generation.target_audience && (
                  <span className="badge bg-info me-2">{generation.target_audience}</span>
                )}
                {generation.tone_of_voice && (
                  <span className="badge bg-success">{generation.tone_of_voice}</span>
                )}
              </div>

              <p className="text-muted mb-2">
                {truncateText(generation.product_description)}
              </p>

              <small className="text-muted">
                Generated on {formatDate(generation.created_at)}
              </small>
            </div>

            <div className="col-md-4 text-end">
              <div className="btn-group-vertical" role="group">
                <button
                  className="btn btn-sm btn-primary mb-2"
                  onClick={() => onSelectGeneration && onSelectGeneration(generation)}
                >
                  View Details
                </button>

                <button
                  className="btn btn-sm btn-outline-warning mb-2"
                  onClick={() => toggleFavorite(generation.id, generation.is_favorited)}
                >
                  {generation.is_favorited ? 'Remove Favorite' : 'Add Favorite'}
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteGeneration(generation.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;