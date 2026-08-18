import React from 'react';
import { Clapperboard, Film, Tv, CheckCircle2, Clock, Star, Sparkles, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({
  user,
  stats,
  onOpenAuth,
  onLogout,
  onSeedData,
  isSeeding,
}) {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand-logo-wrap">
          <div className="brand-icon-box">
            <Clapperboard className="brand-icon" size={24} />
          </div>
          <div className="brand-text-block">
            <h1 className="brand-title">Cine<span className="brand-highlight">Track</span></h1>
            <span className="brand-tagline">Movie & TV Watchlist</span>
          </div>
        </div>

        {/* Quick Stats Summary */}
        {user && stats && (
          <div className="navbar-stats-strip">
            <div className="nav-stat-pill" title="Items in To Watch list">
              <Clock size={14} className="stat-icon-yellow" />
              <span><strong>{stats.unwatched || 0}</strong> To Watch</span>
            </div>
            <div className="nav-stat-pill" title="Items marked Watched">
              <CheckCircle2 size={14} className="stat-icon-green" />
              <span><strong>{stats.watched || 0}</strong> Watched</span>
            </div>
            {stats.average_rating > 0 && (
              <div className="nav-stat-pill" title="Average Rating across watched items">
                <Star size={14} className="stat-icon-gold" fill="currentColor" />
                <span><strong>{stats.average_rating}</strong> Avg</span>
              </div>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <button
                type="button"
                className="btn-seed"
                onClick={onSeedData}
                disabled={isSeeding}
                title="Populate demo movies and shows"
              >
                <Sparkles size={16} />
                <span>{isSeeding ? 'Seeding...' : 'Load Sample Movies'}</span>
              </button>

              <div className="user-profile-badge">
                <div className="user-avatar">
                  <UserIcon size={16} />
                </div>
                <span className="user-name">{user.username}</span>
                <button
                  type="button"
                  className="btn-logout"
                  onClick={onLogout}
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-btn-group">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onOpenAuth('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onOpenAuth('register')}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
