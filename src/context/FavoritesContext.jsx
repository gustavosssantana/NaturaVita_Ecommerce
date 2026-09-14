import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'naturavita_favorites_v2';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // Storage unavailable — favorites stay in memory for this session.
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.has(id), [favorites]);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, favoritesCount: favorites.size }),
    [favorites, toggleFavorite, isFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
