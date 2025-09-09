import React, { useState } from 'react';
import { generationAPI } from '../../services/api';

const GeneratedContent = ({ content, onUpdate }) => {
  const [editing, setEditing] = useState({});
  const [editedContent, setEditedContent] = useState({});
  const [updating, setUpdating] = useState(false);

  if (!content) {
    return null;
  }

  const handleEdit = (section) => {
    setEditing(prev => ({ ...prev, [section]: true }));
    if (section === 'description') {
      setEditedContent(prev => ({ 
        ...prev, 
        [section]: content.generated_description 
      }));
    } else if (section === 'email') {
      setEditedContent(prev => ({ 
        ...prev, 
        [section]: content.generated_email_blurb 
      }));
    }
  };

  const handleSave = async (section) => {
    setUpdating(true);
    try {
      let updateData = {};
      
      if (section === 'description') {
        updateData.generated_description = editedContent[section];
      } else if (section === 'email') {
        updateData.generated_email_blurb = editedContent[section];
      }

      const updatedContent = await generationAPI.updateGeneration(content.id, updateData);
      onUpdate(updatedContent);
      
      setEditing(prev => ({ ...prev, [section]: false }));
      setEditedContent(prev => ({ ...prev, [section]: '' }));
    } catch (error) {
      console.error('Failed to update content:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = (section) => {
    setEditing(prev => ({ ...prev, [section]: false }));
    setEditedContent(prev => ({ ...prev, [section]: '' }));
  };

  const handleToggleFavorite = async () => {
    try {
      const updatedContent = await generationAPI.updateGeneration(
        content.id, 
        { is_favorite: !content.is_favorite }
      );
      onUpdate(updatedContent);
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title mb-0">Generated Content</h2>
          <button
            onClick={handleToggleFavorite}
            className={`favorite-btn ${content.is_favorite ? 'active' : ''}`}
            title={content.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {content.is_favorite ? '★' : '☆'}
          </button>
        </div>
        <p className="card-description mb-0">
          AI-generated marketing content for {content.product_name}
        </p>
      </div>

      {/* Product Description */}
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Product Description (SEO Optimized)</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => copyToClipboard(content.generated_description)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Copy
            </button>
            {!editing.description ? (
              <button
                onClick={() => handleEdit('description')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSave('description')}
                  disabled={updating}
                  className="btn btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel('description')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        {editing.description ? (
          <textarea
            value={editedContent.description}
            onChange={(e) => setEditedContent(prev => ({ ...prev, description: e.target.value }))}
            className="form-textarea"
            rows={8}
            style={{ marginTop: '1rem' }}
          />
        ) : (
          <div className="content-text">
            {content.generated_description}
          </div>
        )}
      </div>

      {/* Social Media Ad Copy */}
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Social Media Ad Copy</h3>
          <button
            onClick={() => copyToClipboard(content.generated_ad_copy.join('\n\n'))}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            Copy All
          </button>
        </div>
        
        <ul className="ad-copy-list">
          {content.generated_ad_copy.map((ad, index) => (
            <li key={index} className="ad-copy-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ flex: 1 }}>{ad}</span>
                <button
                  onClick={() => copyToClipboard(ad)}
                  className="btn btn-secondary"
                  style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem',
                    marginLeft: '1rem',
                    flexShrink: 0
                  }}
                >
                  Copy
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Email Marketing Blurb */}
      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Email Marketing Blurb</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => copyToClipboard(content.generated_email_blurb)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Copy
            </button>
            {!editing.email ? (
              <button
                onClick={() => handleEdit('email')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSave('email')}
                  disabled={updating}
                  className="btn btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel('email')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        {editing.email ? (
          <textarea
            value={editedContent.email}
            onChange={(e) => setEditedContent(prev => ({ ...prev, email: e.target.value }))}
            className="form-textarea"
            rows={4}
            style={{ marginTop: '1rem' }}
          />
        ) : (
          <div className="content-text">
            {content.generated_email_blurb}
          </div>
        )}
      </div>

      {/* Generation Info */}
      <div style={{ 
        marginTop: '2rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: '#64748b'
      }}>
        <span>Generated on {new Date(content.created_at).toLocaleString()}</span>
        <span>Category: {content.product_category}</span>
      </div>
    </div>
  );
};

export default GeneratedContent;