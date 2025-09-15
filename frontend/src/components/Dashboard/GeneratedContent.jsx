import React from 'react';

const GeneratedContent = ({ generationData, onSave, onFavorite }) => {
  if (!generationData) {
    return null;
  }

  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy content');
    }
  };

  return (
    <div className="generation-result">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Generated Content for "{generationData.product_name}"</h4>
        <div>
          <button
            className="btn btn-outline-warning me-2"
            onClick={() => onFavorite && onFavorite(generationData.id)}
            title={generationData.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {generationData.is_favorited ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="content-section">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="text-primary">SEO-Optimized Product Description</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => copyToClipboard(generationData.product_description)}
          >
            Copy
          </button>
        </div>
        <p>{formatContent(generationData.product_description)}</p>
      </div>

      {/* Social Media Ads */}
      <div className="content-section">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="text-primary">Social Media Ad Variations</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => copyToClipboard(generationData.social_media_ads)}
          >
            Copy
          </button>
        </div>
        <div>{formatContent(generationData.social_media_ads)}</div>
      </div>

      {/* Email Content */}
      <div className="content-section">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="text-primary">Email Marketing Content</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => copyToClipboard(generationData.email_content)}
          >
            Copy
          </button>
        </div>
        <div>{formatContent(generationData.email_content)}</div>
      </div>

      {/* Generation Info */}
      <div className="mt-3">
        <small className="text-muted">
          Generated on {new Date(generationData.created_at).toLocaleString()}
          {generationData.category && ` • Category: ${generationData.category}`}
          {generationData.target_audience && ` • Target: ${generationData.target_audience}`}
          {generationData.tone_of_voice && ` • Tone: ${generationData.tone_of_voice}`}
        </small>
      </div>
    </div>
  );
};

export default GeneratedContent;