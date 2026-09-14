// Minimal client-side router: pushState navigation without a full page reload,
// so the catalog (1000+ products) is fetched once per session instead of on
// every click.

export function navigate(path, { replace = false } = {}) {
  if (!path) return;
  const current = window.location.pathname + window.location.search;
  if (path === current) return;

  if (replace) window.history.replaceState({}, '', path);
  else window.history.pushState({}, '', path);

  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

// Intercepts a click on an internal link so it routes in-app.
// Modifier clicks (ctrl/cmd/middle) keep the browser's default behaviour.
export function handleLinkClick(event, href) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
    return;
  }
  event.preventDefault();
  navigate(href);
}

export function parseLocation(pathname, search) {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const params = new URLSearchParams(search || '');
  return { segments: parts, first: parts[0] || '', second: parts[1] || '', params };
}
