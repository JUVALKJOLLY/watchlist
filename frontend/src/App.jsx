import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TabsNav from './components/TabsNav';
import FilterBar from './components/FilterBar';
import MediaCard from './components/MediaCard';
import AddEditMediaModal from './components/AddEditMediaModal';
import AuthModal from './components/AuthModal';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { mediaService, authService } from './api/mediaService';
import { Loader2, Clapperboard, Sparkles, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('watchlist_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('watchlist_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Media Data State
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    watched: 0,
    unwatched: 0,
    movies: 0,
    tv_shows: 0,
    average_rating: 0.0,
  });
  const [loading, setLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // View & Filter State
  const [activeTab, setActiveTab] = useState('Unwatched'); // 'Unwatched' (To Watch) | 'Watched'
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'Movie' | 'TV'
  const [sortBy, setSortBy] = useState('-updated_at');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Auth Handling
  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem('watchlist_token', newToken);
    localStorage.setItem('watchlist_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    showToast(`Welcome back, ${newUser.username}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('watchlist_token');
    localStorage.removeItem('watchlist_user');
    setToken(null);
    setUser(null);
    setItems([]);
    setStats({ total: 0, watched: 0, unwatched: 0, movies: 0, tv_shows: 0, average_rating: 0 });
    showToast('You have been logged out.', 'info');
  };

  // Auto-login to demo account if first time visit
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        // Try automatic demo login for seamless immediate experience
        try {
          const res = await authService.login({ username: 'demo', password: 'demo1234' });
          handleAuthSuccess(res.token, res.user);
        } catch (err) {
          // If demo user is not yet created, prompt auth modal
          setIsAuthModalOpen(true);
        }
      } else {
        // Verify current token
        try {
          const me = await authService.getMe();
          setUser(me.user);
        } catch (err) {
          handleLogout();
        }
      }
    };

    initAuth();

    const handleExpired = () => {
      handleLogout();
      setIsAuthModalOpen(true);
      showToast('Session expired. Please sign in again.', 'info');
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  // Fetch Media Items & Stats
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = {
        status: activeTab,
        ordering: sortBy,
      };

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const [mediaData, statsData] = await Promise.all([
        mediaService.getAll(params),
        mediaService.getStats(),
      ]);

      setItems(mediaData);
      setStats(statsData);
    } catch (err) {
      console.error('Fetch error:', err);
      showToast('Failed to load watchlist items.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, typeFilter, search, sortBy]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [fetchData, token]);

  // Rate 5-star directly
  const handleRate = async (id, newRating) => {
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rating: newRating } : item))
    );

    try {
      const updated = await mediaService.rate(id, newRating);
      // Refresh stats
      const newStats = await mediaService.getStats();
      setStats(newStats);
      showToast(
        newRating > 0
          ? `Rated "${updated.title}" ${newRating} ★`
          : `Rating cleared for "${updated.title}"`,
        'success'
      );
    } catch (err) {
      console.error('Rating failed:', err);
      showToast('Failed to update rating on server.', 'error');
      fetchData();
    }
  };

  // Toggle Watched/Unwatched Status
  const handleToggleStatus = async (id) => {
    const itemToToggle = items.find((i) => i.id === id);
    const prevStatus = itemToToggle ? itemToToggle.status : null;
    const nextStatus = prevStatus === 'Watched' ? 'Unwatched' : 'Watched';

    // Remove from current tab view optimistically
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const updated = await mediaService.toggleStatus(id);
      const newStats = await mediaService.getStats();
      setStats(newStats);

      showToast(
        updated.status === 'Watched'
          ? `Marked "${updated.title}" as Watched! 🎉`
          : `Moved "${updated.title}" to "To Watch" list`,
        'success'
      );
    } catch (err) {
      console.error('Toggle status failed:', err);
      showToast('Failed to toggle status.', 'error');
      fetchData();
    }
  };

  // Create or Update
  const handleSaveMedia = async (formData, editId) => {
    try {
      if (editId) {
        const updated = await mediaService.update(editId, formData);
        showToast(`Updated "${updated.title}"`, 'success');
      } else {
        const created = await mediaService.create(formData);
        showToast(`Added "${created.title}" to watchlist!`, 'success');
      }
      fetchData();
    } catch (err) {
      console.error('Save failed:', err);
      showToast('Failed to save media item.', 'error');
      throw err;
    }
  };

  // Delete
  const handleDeleteMedia = async (id) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (!window.confirm(`Are you sure you want to remove "${itemToDelete?.title || 'this item'}" from your watchlist?`)) {
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await mediaService.delete(id);
      const newStats = await mediaService.getStats();
      setStats(newStats);
      showToast('Item removed from watchlist.', 'info');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete item.', 'error');
      fetchData();
    }
  };

  // Seed sample data
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await mediaService.seed();
      showToast(res.message || 'Sample movies loaded!', 'success');
      await fetchData();
    } catch (err) {
      console.error('Seed failed:', err);
      showToast('Could not load sample data.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        user={user}
        stats={stats}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
      />

      {/* Main Content Area */}
      <main className="main-content-container">
        {user ? (
          <>
            {/* Tab Navigation: "To Watch" vs "Watched" */}
            <div className="tab-control-section">
              <TabsNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                unwatchedCount={stats.unwatched || 0}
                watchedCount={stats.watched || 0}
              />
            </div>

            {/* Filter & Search Bar */}
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onOpenAddModal={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
            />

            {/* Media Items Grid */}
            <section className="media-grid-section">
              {loading ? (
                <div className="loading-state-box">
                  <Loader2 className="spinner-icon" size={36} />
                  <p>Loading your {activeTab === 'Unwatched' ? 'To Watch' : 'Watched'} titles...</p>
                </div>
              ) : items.length > 0 ? (
                <div className="media-cards-grid">
                  {items.map((item) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      onRate={handleRate}
                      onToggleStatus={handleToggleStatus}
                      onEdit={(it) => {
                        setEditingItem(it);
                        setIsAddModalOpen(true);
                      }}
                      onDelete={handleDeleteMedia}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  activeTab={activeTab}
                  hasSearchOrFilter={Boolean(search.trim() || typeFilter !== 'all')}
                  onResetFilters={() => {
                    setSearch('');
                    setTypeFilter('all');
                  }}
                  onOpenAddModal={() => {
                    setEditingItem(null);
                    setIsAddModalOpen(true);
                  }}
                  onSeedData={handleSeedData}
                />
              )}
            </section>
          </>
        ) : (
          /* Guest Hero Prompt */
          <div className="guest-hero-container">
            <div className="guest-hero-card">
              <div className="hero-icon-banner">
                <Clapperboard size={48} className="hero-icon" />
              </div>
              <h2 className="hero-heading">Welcome to CineTrack</h2>
              <p className="hero-description">
                Your cinematic companion to organize everything you want to watch and rate every film and show you’ve experienced.
              </p>
              <div className="hero-actions-row">
                <button
                  type="button"
                  className="btn-primary hero-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Sign In / Try Demo
                </button>
                <button
                  type="button"
                  className="btn-secondary hero-btn"
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      <AddEditMediaModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSaveMedia}
        editItem={editingItem}
        defaultStatus={activeTab}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
