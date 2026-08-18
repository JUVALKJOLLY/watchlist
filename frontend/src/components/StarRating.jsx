import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Masterpiece',
};

export default function StarRating({
  rating = 0,
  onRate,
  readonly = false,
  size = 20,
  showLabel = false,
  showClear = true,
  disabled = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const activeRating = hoverRating || rating || 0;

  const handleStarClick = async (e, starValue) => {
    e.stopPropagation();
    if (readonly || disabled || isUpdating) return;

    // If clicking the current rating, allow resetting to 0
    const newRating = rating === starValue ? 0 : starValue;

    try {
      setIsUpdating(true);
      await onRate(newRating);
    } catch (err) {
      console.error('Failed to update rating:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClear = async (e) => {
    e.stopPropagation();
    if (readonly || disabled || isUpdating || rating === 0) return;
    try {
      setIsUpdating(true);
      await onRate(0);
    } catch (err) {
      console.error('Failed to clear rating:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`star-rating-container ${readonly ? 'readonly' : 'interactive'} ${
        isUpdating ? 'updating' : ''
      }`}
      onMouseLeave={() => !readonly && setHoverRating(0)}
    >
      <div className="stars-row" role="group" aria-label="5-star rating">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeRating;
          const isCurrentHover = starValue === hoverRating;

          return (
            <button
              key={starValue}
              type="button"
              className={`star-btn ${isFilled ? 'filled' : 'empty'} ${
                isCurrentHover ? 'hovered' : ''
              }`}
              onClick={(e) => handleStarClick(e, starValue)}
              onMouseEnter={() => !readonly && !disabled && setHoverRating(starValue)}
              disabled={readonly || disabled || isUpdating}
              title={RATING_LABELS[starValue]}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''} (${
                RATING_LABELS[starValue]
              })`}
            >
              <Star
                size={size}
                className="star-icon"
                fill={isFilled ? 'currentColor' : 'none'}
              />
            </button>
          );
        })}

        {!readonly && showClear && rating > 0 && (
          <button
            type="button"
            className="star-clear-btn"
            onClick={handleClear}
            title="Clear rating"
            aria-label="Clear rating"
            disabled={disabled || isUpdating}
          >
            <X size={size * 0.75} />
          </button>
        )}
      </div>

      {showLabel && (
        <span className="rating-text-label">
          {activeRating > 0 ? (
            <>
              <strong>{activeRating}/5</strong>{' '}
              <span className="rating-desc-text">
                ({RATING_LABELS[activeRating]})
              </span>
            </>
          ) : (
            <span className="rating-unrated-text">Unrated</span>
          )}
        </span>
      )}
    </div>
  );
}
