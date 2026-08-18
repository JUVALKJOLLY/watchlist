import React, { useState, useEffect } from 'react';
import { X, Film, Tv, Sparkles, Star, Image, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';
import StarRating from './StarRating';

const POPULAR_PRESETS = [
  {
    title: 'Gladiator II',
    type: 'Movie',
    genre: 'Action / Drama / Adventure',
    release_year: 2024,
    poster_url: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=600&auto=format&fit=crop&q=80',
    notes: 'Epic sequel directed by Ridley Scott.'
  },
  {
    title: 'Stranger Things',
    type: 'TV',
    genre: 'Sci-Fi / Horror / Drama',
    release_year: 2016,
    poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    notes: 'Final season coming up soon!'
  },
  {
    title: 'The Dark Knight',
    type: 'Movie',
    genre: 'Action / Crime / Drama',
    release_year: 2008,
    poster_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&auto=format&fit=crop&q=80',
    notes: 'Heath Ledger as the Joker is unparalleled.'
  },
  {
    title: 'Succession',
    type: 'TV',
    genre: 'Drama',
    release_year: 2018,
    poster_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    notes: 'Masterpiece television writing.'
  }
];

export default function AddEditMediaModal({
  isOpen,
  onClose,
  onSubmit,
  editItem = null,
  defaultStatus = 'Unwatched',
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie',
    status: defaultStatus,
    rating: 0,
    genre: '',
    release_year: '',
    poster_url: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title || '',
        type: editItem.type || 'Movie',
        status: editItem.status || 'Unwatched',
        rating: editItem.rating || 0,
        genre: editItem.genre || '',
        release_year: editItem.release_year ? String(editItem.release_year) : '',
        poster_url: editItem.poster_url || '',
        notes: editItem.notes || '',
      });
    } else {
      setFormData({
        title: '',
        type: 'Movie',
        status: defaultStatus,
        rating: 0,
        genre: '',
        release_year: '',
        poster_url: '',
        notes: '',
      });
    }
    setErrors({});
  }, [editItem, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      type: preset.type,
      genre: preset.genre,
      release_year: String(preset.release_year),
      poster_url: preset.poster_url,
      notes: preset.notes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        status: formData.status,
        rating: Number(formData.rating) || 0,
        genre: formData.genre.trim(),
        release_year: formData.release_year ? parseInt(formData.release_year, 10) : null,
        poster_url: formData.poster_url.trim(),
        notes: formData.notes.trim(),
      };

      await onSubmit(payload, editItem ? editItem.id : null);
      onClose();
    } catch (err) {
      console.error('Modal submit error:', err);
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">
              {editItem ? 'Edit Media Item' : 'Add to Watchlist'}
            </h2>
            <p className="modal-subtitle">
              {editItem
                ? 'Update media properties and rating'
                : 'Add a new movie or TV show to your watchlist collection'}
            </p>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Presets for New Items */}
        {!editItem && (
          <div className="quick-presets-box">
            <div className="presets-label">
              <Sparkles size={14} className="sparkle-icon" />
              <span>Quick Suggestions:</span>
            </div>
            <div className="presets-tags">
              {POPULAR_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  className="preset-chip"
                  onClick={() => handleApplyPreset(preset)}
                >
                  {preset.type === 'Movie' ? <Film size={11} /> : <Tv size={11} />}
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="media-title">
              Title <span className="required-star">*</span>
            </label>
            <input
              id="media-title"
              type="text"
              className={`form-input ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Inception, Breaking Bad"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              autoFocus
            />
            {errors.title && <span className="form-error-msg">{errors.title}</span>}
          </div>

          {/* Type & Status Rows */}
          <div className="form-row-2col">
            {/* Type selector */}
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="segmented-toggle">
                <button
                  type="button"
                  className={`toggle-option ${formData.type === 'Movie' ? 'selected' : ''}`}
                  onClick={() => handleChange('type', 'Movie')}
                >
                  <Film size={14} />
                  <span>Movie</span>
                </button>
                <button
                  type="button"
                  className={`toggle-option ${formData.type === 'TV' ? 'selected' : ''}`}
                  onClick={() => handleChange('type', 'TV')}
                >
                  <Tv size={14} />
                  <span>TV Show</span>
                </button>
              </div>
            </div>

            {/* Status selector */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="segmented-toggle">
                <button
                  type="button"
                  className={`toggle-option ${formData.status === 'Unwatched' ? 'selected' : ''}`}
                  onClick={() => handleChange('status', 'Unwatched')}
                >
                  <span>To Watch</span>
                </button>
                <button
                  type="button"
                  className={`toggle-option ${formData.status === 'Watched' ? 'selected' : ''}`}
                  onClick={() => handleChange('status', 'Watched')}
                >
                  <span>Watched</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="form-group rating-form-group">
            <label className="form-label">
              Rating (5-Star) {formData.status === 'Unwatched' && <span className="label-hint">(Optional until watched)</span>}
            </label>
            <div className="form-star-picker">
              <StarRating
                rating={formData.rating}
                onRate={(newRating) => handleChange('rating', newRating)}
                size={26}
                showLabel={true}
                showClear={true}
              />
            </div>
          </div>

          {/* Genre & Year */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="media-genre">
                <Tag size={13} /> Genre
              </label>
              <input
                id="media-genre"
                type="text"
                className="form-input"
                placeholder="e.g. Sci-Fi, Drama, Thriller"
                value={formData.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="media-year">
                <Calendar size={13} /> Release Year
              </label>
              <input
                id="media-year"
                type="number"
                min="1900"
                max="2099"
                className="form-input"
                placeholder="e.g. 2024"
                value={formData.release_year}
                onChange={(e) => handleChange('release_year', e.target.value)}
              />
            </div>
          </div>

          {/* Poster Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="media-poster">
              <Image size={13} /> Poster Image URL (Optional)
            </label>
            <input
              id="media-poster"
              type="url"
              className="form-input"
              placeholder="https://... (or leave empty for default poster)"
              value={formData.poster_url}
              onChange={(e) => handleChange('poster_url', e.target.value)}
            />
          </div>

          {/* Notes / Thoughts */}
          <div className="form-group">
            <label className="form-label" htmlFor="media-notes">
              <FileText size={13} /> Notes / Review Thoughts
            </label>
            <textarea
              id="media-notes"
              className="form-textarea"
              rows="2"
              placeholder="Add your review comments, thoughts, or where to stream..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : editItem
                ? 'Update Media'
                : 'Add to Watchlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
