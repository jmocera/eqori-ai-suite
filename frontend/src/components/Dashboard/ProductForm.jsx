import React, { useState } from 'react';
import { generationAPI } from '../../services/api';

const ProductForm = ({ onGenerationComplete }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    features: '',
    target_audience: '',
    tone_of_voice: '',
    seo_keywords: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await generationAPI.generateContent(formData);
      onGenerationComplete(response.data);

      // Reset form
      setFormData({
        product_name: '',
        category: '',
        features: '',
        target_audience: '',
        tone_of_voice: '',
        seo_keywords: ''
      });
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.response?.data?.detail || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3 className="text-center mb-4">Generate AI Marketing Content</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="product_name" className="form-label">
            Product Name *
          </label>
          <input
            type="text"
            className="form-control"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="e.g., Wireless Bluetooth Headphones"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Product Category
          </label>
          <select
            className="form-control"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Books & Media">Books & Media</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="features" className="form-label">
            Key Features
          </label>
          <textarea
            className="form-control"
            id="features"
            name="features"
            value={formData.features}
            onChange={handleChange}
            rows="3"
            placeholder="List the main features and benefits of your product"
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="target_audience" className="form-label">
                Target Audience
              </label>
              <input
                type="text"
                className="form-control"
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="e.g., Young professionals, Fitness enthusiasts"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="tone_of_voice" className="form-label">
                Tone of Voice
              </label>
              <select
                className="form-control"
                id="tone_of_voice"
                name="tone_of_voice"
                value={formData.tone_of_voice}
                onChange={handleChange}
              >
                <option value="">Select Tone</option>
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Friendly">Friendly</option>
                <option value="Luxury">Luxury</option>
                <option value="Energetic">Energetic</option>
                <option value="Authoritative">Authoritative</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="seo_keywords" className="form-label">
            SEO Keywords
          </label>
          <input
            type="text"
            className="form-control"
            id="seo_keywords"
            name="seo_keywords"
            value={formData.seo_keywords}
            onChange={handleChange}
            placeholder="e.g., bluetooth headphones, wireless audio, noise cancelling"
          />
          <small className="text-muted">Separate keywords with commas</small>
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner me-2"></span>
                Generating Content...
              </>
            ) : (
              'Generate Marketing Content'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;