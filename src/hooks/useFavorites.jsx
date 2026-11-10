import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { readFavorites, writeFavorites } from '../services/favoritesService';
const Context = createContext(null);
export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(null);
  const ref = useRef([]),
    queue = useRef(Promise.resolve());
  const read = async () => {
    try {
      const data = await readFavorites();
      ref.current = data;
      setIds(data);
      setError(null);
    } catch {
      setError('Your collection could not be loaded. Retry before changing saved plants.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let live = true;
    readFavorites()
      .then((data) => {
        if (live) {
          ref.current = data;
          setIds(data);
          setError(null);
        }
      })
      .catch(() => {
        if (live)
          setError('Your collection could not be loaded. Retry before changing saved plants.');
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);
  const toggle = async (id) => {
    if (loading || error) return;
    queue.current = queue.current.then(async () => {
      const next = ref.current.includes(id)
        ? ref.current.filter((x) => x !== id)
        : [...ref.current, id];
      try {
        await writeFavorites(next);
        ref.current = next;
        setIds(next);
      } catch {
        setError('Your change could not be saved. Retry to reload your collection.');
      }
    });
    await queue.current;
  };
  return (
    <Context.Provider
      value={{
        ids,
        loading,
        error,
        toggle,
        retry: () => {
          setLoading(true);
          void read();
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useFavorites() {
  const value = useContext(Context);
  if (!value) throw new Error('FavoritesProvider is missing');
  return value;
}
