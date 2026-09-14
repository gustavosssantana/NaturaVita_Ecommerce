import { handleLinkClick } from '../../lib/router';

// Internal link that routes client-side. Renders a real <a> so middle-click,
// "open in new tab" and right-click → copy address all keep working.
export default function Link({ href, children, className, onClick, ...rest }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        handleLinkClick(e, href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
