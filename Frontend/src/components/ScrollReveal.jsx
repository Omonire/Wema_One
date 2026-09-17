import { useEffect, useRef, useState } from 'react';

/**
 * Reveal wrapper: animates children in when they scroll into view.
 *
 * Usage:
 *   <Reveal>...</Reveal>
 *   <Reveal direction="left" delay={100} className="grid ...">...</Reveal>
 *
 * Directions: up (default), down, left, right, zoom, none
 */
const dirClass = {
  up: 'reveal-up',
  down: 'reveal-down',
  left: 'reveal-left',
  right: 'reveal-right',
  zoom: 'reveal-zoom',
  none: '',
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  once = true,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback for browsers without IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${dirClass[direction] || ''} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Staggered grid helper: maps children with incremental delays. */
export function RevealGroup({ children, stagger = 80, className = '', ...rest }) {
  return (
    <Reveal className={className} {...rest}>
      {children}
    </Reveal>
  );
}
