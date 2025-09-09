import React, { useState } from 'react';

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Fitness',
  'Books & Media',
  'Toys & Games',
  'Automotive',
  'Food & Beverages',
  'Pet Supplies',
  'Office Supplies',
  'Jewelry & Accessories',
  'Other'
];

const TONE_OPTIONS = [
  'Professional',
  'Playful', 
  'Luxury',
  'Informative'
];

const ProductForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_category: '',
    input_features: '',
    input_audience: '',
    input_tone: '',
    input_keywords: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData.product_category) {
      newErrors.product_category = 'Product category is required';
    }

    if (!formData.input_features.trim()) {
      newErrors.input_features = 'Product features are required';
    }

    if (!formData.input_audience.trim()) {
      newErrors.input_audience = 'Target audience is required';
    }

    if (!formData.input_tone) {
      newErrors.input_tone = 'Tone of voice is required';
    }

    if (!formData.input_keywords.trim()) {
      newErrors.input_keywords = 'Keywords are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Product Information</h2>
        <p className="card-description">
          Fill in your product details to generate AI-powered marketing content
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product_name" className="form-label">
            Product Name *
          </label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Wireless Noise-Canceling Headphones"
            disabled={loading}
          />
          {errors.product_name && (
            <div className="form-error">{errors.product_name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="product_category" className="form-label">
            Product Category *
          </label>
          <select
            id="product_category"
            name="product_category"
            value={formData.product_category}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="">Select a category...</option>
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.product_category && (
            <div className="form-error">{errors.product_category}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="input_features" className="form-label">
            Key Features & Benefits *
          </label>
          <textarea
            id="input_features"
            name="input_features"
            value={formData.input_features}
            onChange={handleChange}
            className="form-textarea"
            placeholder="e.g., Waterproof, 40-hour battery life, Noise-canceling, Bluetooth 5.0"
            rows={4}
            disabled={loading}
          />
          {errors.input_features && (
            <div className="form-error">{errors.input_features}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="input_audience" className="form-label">
            Target Audience *
          </label>
          <input
            type="text"
            id="input_audience"
            name="input_audience"
            value={formData.input_audience}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Gamers, Athletes, Students, Professionals"
            disabled={loading}
          />
          {errors.input_audience && (
            <div className="form-error">{errors.input_audience}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="input_tone" className="form-label">
            Tone of Voice *
          </label>
          <select
            id="input_tone"
            name="input_tone"
            value={formData.input_tone}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            <option value="">Select a tone...</option>
            {TONE_OPTIONS.map(tone => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
          {errors.input_tone && (
            <div className="form-error">{errors.input_tone}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="input_keywords" className="form-label">
            SEO Keywords *
          </label>
          <input
            type="text"
            id="input_keywords"
            name="input_keywords"
            value={formData.input_keywords}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., wireless headphones, best for travel, noise cancelling"
            disabled={loading}
          />
          {errors.input_keywords && (
            <div className="form-error">{errors.input_keywords}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating Content...
            </>
          ) : (
            'Generate Marketing Content'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;