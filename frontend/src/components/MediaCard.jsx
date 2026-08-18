import React, { useState } from 'react';
import { Film, Tv, CheckCircle2, Clock, Trash2, Edit3, MessageSquareQuote, Calendar, Tag, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import StarRating from './StarRating';

export default function MediaCard({
  item,
  onRate,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const [imgError, setImgError] = useState(false);
  const isWatched = item.status === 'Watched';

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!isWatched) {
      // Trigger subtle confetti celebration when moving to Watched
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'],
        });
      } catch (err) {
        // ignore confetti errors if unsupported
      }
    }
    await onToggleStatus(item.id);
  };

  const defaultPoster =
    item.type === 'Movie'
      ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80';

  return (
    <article className={`media-card ${isWatched ? 'is-watched' : 'is-unwatched'}`}>
      {/* Poster / Thumbnail Box */}
      <div className="media-poster-box">
        <img
          src={!imgError && item.poster_url ? item.poster_url : defaultPoster}
          alt={item.title}
          className="media-poster-img"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Type Badge (Movie vs TV Show) */}
        <div className={`media-type-badge ${item.type.toLowerCase()}`}>
          {item.type === 'Movie' ? <Film size={12} /> : <Tv size={12} />}
          <span>{item.type === 'Movie' ? 'Movie' : 'TV Show'}</span>
        </div>

        {/* Status Toggle overlay button */}
        <button
          type="button"
          className={`poster-status-btn ${isWatched ? 'watched' : 'unwatched'}`}
          onClick={handleToggle}
          title={isWatched ? 'Mark as Unwatched (Move to Watchlist)' : 'Mark as Watched'}
        >
          {isWatched ? (
            <>
              <CheckCircle2 size={15} />
              <span>Watched</span>
            </>
          ) : (
            <>
              <Clock size={15} />
              <span>To Watch</span>
            </>
          )}
        </button>
      </div>

      {/* Card Body */}
      <div className="media-card-body">
        <div className="media-header-row">
          <h3 className="media-title" title={item.title}>
            {item.title}
          </h3>
          {item.release_year && (
            <span className="media-year">
              <Calendar size={12} /> {item.release_year}
            </span>
          )}
        </div>

        {item.genre && (
          <div className="media-genre-pill">
            <Tag size={11} />
            <span>{item.genre}</span>
          </div>
        )}

        {item.notes && (
          <p className="media-notes" title={item.notes}>
            <MessageSquareQuote size={13} className="notes-icon" />
            <span>{item.notes}</span>
          </p>
        )}

        {/* 5-Star Clickable Rating Component */}
        <div className="media-rating-section">
          <div className="rating-section-header">
            <span className="rating-heading">
              {isWatched ? 'Your Rating' : 'Rate upon watching'}
            </span>
            {item.rating > 0 && (
              <span className="rating-number-badge">{item.rating} / 5</span>
            )}
          </div>
          
          <StarRating
            rating={item.rating || 0}
            onRate={(newRating) => onRate(item.id, newRating)}
            size={22}
            showLabel={false}
            showClear={true}
          />
        </div>

        {/* Card Footer Actions */}
        <div className="media-card-footer">
          <button
            type="button"
            className={`btn-toggle-status ${isWatched ? 'btn-status-watched' : 'btn-status-unwatched'}`}
            onClick={handleToggle}
          >
            {isWatched ? (
              <>
                <Clock size={14} /> Move to "To Watch"
              </>
            ) : (
              <>
                <CheckCircle2 size={14} /> Mark as Watched
              </>
            )}
          </button>

          <div className="footer-icon-actions">
            <button
              type="button"
              className="btn-card-icon edit"
              onClick={() => onEdit(item)}
              title="Edit media details"
            >
              <Edit3 size={15} />
            </button>
            <button
              type="button"
              className="btn-card-icon delete"
              onClick={() => onDelete(item.id)}
              title="Delete from list"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
