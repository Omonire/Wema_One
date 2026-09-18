import Reveal from '../ScrollReveal';
import SvgIcon from './SvgIcon';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-on-surface-variant text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-on-error-container text-xl">!</span>
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-2">Something went wrong</h3>
      <p className="text-on-surface-variant text-sm mb-4">{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm hover:bg-primary transition-all">
          Try Again
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    SCHEDULED: 'bg-primary-fixed text-primary',
    CONFIRMED: 'bg-tertiary-fixed text-tertiary',
    WAITING: 'bg-surface-container-highest text-on-surface-variant',
    CHECKED_IN: 'bg-primary-fixed text-primary',
    CALLED: 'bg-primary-fixed text-primary',
    IN_SERVICE: 'bg-primary-fixed text-primary',
    COMPLETED: 'bg-tertiary-fixed text-tertiary',
    CANCELLED: 'bg-error-container text-on-error-container',
    PENDING: 'bg-surface-container-highest text-on-surface-variant',
    SUCCESSFUL: 'bg-tertiary-fixed text-tertiary',
    FAILED: 'bg-error-container text-on-error-container',
    VERIFIED: 'bg-tertiary-fixed text-tertiary',
    ACTION_REQUIRED: 'bg-error-container text-on-error-container',
    PENDING_REVIEW: 'bg-surface-container-highest text-on-surface-variant',
    UPLOADED: 'bg-surface-container text-on-surface-variant',
    SUBMITTED: 'bg-primary-fixed text-primary',
    ANALYZED: 'bg-primary-fixed text-primary',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-surface-container text-on-surface-variant'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

/** Standard page header used across app pages. */
export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <Reveal direction="down" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <span className="font-data-mono-xs text-xs uppercase text-primary font-semibold tracking-wider">{eyebrow}</span>
        )}
        <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface tracking-tight mt-0.5">{title}</h1>
        {subtitle && <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  );
}

/** Themed card wrapper. */
export function Card({ children, className = '', reveal = true, delay = 0, direction = 'up', ...rest }) {
  const classes = `bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-sm ${className}`;
  if (!reveal) return <div className={classes} {...rest}>{children}</div>;
  return (
    <Reveal delay={delay} direction={direction} className={classes} {...rest}>
      {children}
    </Reveal>
  );
}

/** Section title inside a page. */
export function CardTitle({ children, icon }) {
  return (
    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-outline-variant/20">
      {icon && <SvgIcon name={icon} size={20} className="text-primary-container shrink-0" />}
      <h3 className="font-semibold text-on-surface">{children}</h3>
    </div>
  );
}

/** Primary button in design tokens. */
export function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)] disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Form field primitives with themed focus rings. */
const fieldBase = 'w-full px-3 py-2 border border-outline-variant/60 rounded-lg text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-shadow';

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
      {children}
    </div>
  );
}

export function Input(props) {
  return <input className={fieldBase} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={fieldBase} {...props}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea className={fieldBase} {...props} />;
}

/** Inline alert banners. */
export function Alert({ kind = 'info', children, className = '' }) {
  const styles = {
    info: 'bg-primary-fixed/40 text-primary border-primary/30',
    success: 'bg-tertiary-fixed/40 text-tertiary border-tertiary/30',
    error: 'bg-error-container text-on-error-container border-error/30',
    warn: 'bg-surface-container-highest text-on-surface border-outline-variant/40',
  };
  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-sm ${styles[kind] || styles.info} ${className}`}>
      {children}
    </div>
  );
}
