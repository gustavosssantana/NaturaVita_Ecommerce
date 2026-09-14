import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'naturavita_cart_v1';

// Cart lines are stored as { id, variantId, qty } — the product details are
// resolved from the live catalog at render time, so prices are never stale.
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l.id !== 'undefined' && l.qty > 0);
  } catch {
    return [];
  }
}

function persist(lines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable (private mode) — cart stays in memory only.
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadCart);
  const [lastAdded, setLastAdded] = useState(null);

  const update = useCallback((next) => {
    setLines(next);
    persist(next);
  }, []);

  const addItem = useCallback(
    (product, qty = 1, variantId = null) => {
      if (!product) return;
      const vId = variantId || product.variantId || null;
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.id === product.id && l.variantId === vId);
        let next;
        if (idx >= 0) {
          next = prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
        } else {
          next = [...prev, { id: product.id, variantId: vId, qty }];
        }
        persist(next);
        return next;
      });
      setLastAdded({ product, qty, at: Date.now() });
    },
    []
  );

  const setQty = useCallback((id, variantId, qty) => {
    setLines((prev) => {
      const next =
        qty <= 0
          ? prev.filter((l) => !(l.id === id && l.variantId === variantId))
          : prev.map((l) => (l.id === id && l.variantId === variantId ? { ...l, qty } : l));
      persist(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id, variantId) => {
    setLines((prev) => {
      const next = prev.filter((l) => !(l.id === id && l.variantId === variantId));
      persist(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => update([]), [update]);

  const dismissToast = useCallback(() => setLastAdded(null), []);

  const value = useMemo(
    () => ({
      lines,
      addItem,
      setQty,
      removeItem,
      clear,
      lastAdded,
      dismissToast,
      count: lines.reduce((s, l) => s + l.qty, 0),
    }),
    [lines, addItem, setQty, removeItem, clear, lastAdded, dismissToast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}

// Resolves stored cart lines against the live catalog.
export function useCartItems(products) {
  const { lines } = useCart();
  return useMemo(() => {
    if (!products?.length) return [];
    const byId = new Map(products.map((p) => [p.id, p]));
    return lines
      .map((l) => {
        const product = byId.get(l.id);
        if (!product) return null;
        const variant =
          product.variants?.find((v) => v.id === l.variantId) || product.variants?.[0] || null;
        const unit = variant?.price || product.price;
        return { ...l, product, variant, unit, subtotal: unit * l.qty };
      })
      .filter(Boolean);
  }, [lines, products]);
}
