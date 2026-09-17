import { useEffect, useState } from 'react';
import { Link, useViewTransitionState } from 'react-router-dom';

/**
 * Names an element so the browser morphs it across a route change.
 * Only active while navigating to `to`, otherwise the name would
 * collide with other elements on the page.
 */
export function useSharedElement(to, name) {
  // Defensive: if the router context ever lacks view-transition support,
  // degrade to no shared element rather than crashing the tree.
  let transitioning = false;
  try {
    transitioning = useViewTransitionState(to);
  } catch {
    transitioning = false;
  }
  return transitioning ? { viewTransitionName: name } : undefined;
}

/* ------------------------------------------------------------------
   Aurora — the Nocturne atmosphere. Each page passes its own blobs so
   an academy page can take on its category's color.
   ------------------------------------------------------------------ */
export function Aurora({ blobs = [], beam = false, grid = true }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {blobs.map(({ background, ...box }, i) => (
        // `background` becomes --glow so the gradient renders it; no blur filter.
        <div key={i} className="aurora-blob" style={{ ...box, '--glow': background }} />
      ))}
      {beam && <div className="aurora-beam" />}
      {grid && <div className="aurora-grid" />}
    </div>
  );
}

export const Grain = () => <div className="aurora-grain" aria-hidden="true" />;

/* Standard page shell: relative positioning for aurora, consistent gutters. */
export function Page({ children, blobs, beam, className = '' }) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <Aurora blobs={blobs} beam={beam} />
      <div className="relative z-10">{children}</div>
      <Grain />
    </div>
  );
}

export const Shell = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
);

/* ------------------------------------------------------------------
   Text
   ------------------------------------------------------------------ */
export const Eyebrow = ({ children, color }) => (
  <p className="text-micro uppercase m-0 font-medium" style={{ color: color || 'var(--ink-dim)' }}>
    {children}
  </p>
);

export const Led = ({ color, size = 6 }) => (
  <span
    className="inline-block shrink-0 rounded-full"
    style={{ width: size, height: size, background: color, boxShadow: `0 0 10px ${color}` }}
    aria-hidden="true"
  />
);


/* ------------------------------------------------------------------
   Avatar — a real photo when one exists, initials when it doesn't.
   Instructors will not all have photos on day one, and an empty grey
   circle looks broken, so the fallback is a deliberate design state
   rather than a placeholder: initials on the academy's own colour.
   ------------------------------------------------------------------ */
export function Avatar({ src, initials, color, size = 96, rounded = 'rounded-[14px]', className = '' }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${rounded} ${className}`}
      style={{
        width: size,
        height: size,
        background: showImage
          ? 'transparent'
          : `linear-gradient(160deg, color-mix(in srgb, ${color} 26%, transparent), color-mix(in srgb, ${color} 8%, transparent))`,
        border: `1px solid color-mix(in srgb, ${color} 32%, transparent)`,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-display font-bold"
          style={{ color, fontSize: size * 0.34 }}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}
    </div>
  );
}


/** Overlapping mentor portraits — conveys "several people teach here"
 *  faster than a number does. Caps at `max`, then shows a +N chip. */
export function AvatarStack({ people, color, size = 34, max = 3 }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;

  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <div
          key={p.initials + i}
          className="rounded-full ring-2"
          style={{ marginLeft: i === 0 ? 0 : -size * 0.3, zIndex: shown.length - i, '--tw-ring-color': 'var(--bg)' }}
        >
          <Avatar src={p.avatarUrl} initials={p.initials} color={color} size={size} rounded="rounded-full" />
        </div>
      ))}
      {rest > 0 && (
        <span
          className="flex items-center justify-center rounded-full ring-2 font-display text-[11px] font-semibold"
          style={{
            width: size,
            height: size,
            marginLeft: -size * 0.3,
            background: `color-mix(in srgb, ${color} 14%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
            color: 'var(--ink-soft)',
            '--tw-ring-color': 'var(--bg)',
          }}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Surfaces
   ------------------------------------------------------------------ */
export const Card = ({ children, className = '', ...rest }) => (
  <div className={`glass-panel rounded-card ${className}`} {...rest}>
    {children}
  </div>
);

/** A card tinted by a category color — used for academies and course tiles. */
export function TintCard({ color, children, className = '', as: As = 'div', ...rest }) {
  return (
    <As
      className={`rounded-card pressable hover:brightness-110 ${className}`}
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, ${color} 10%, transparent), rgba(255,255,255,0.02))`,
        border: `1px solid color-mix(in srgb, ${color} 24%, transparent)`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
      }}
      {...rest}
    >
      {children}
    </As>
  );
}

/* ------------------------------------------------------------------
   Actions
   ------------------------------------------------------------------ */
export function Cta({ to, href, children, color, className = '', ...rest }) {
  const style = color
    ? {
        background: `linear-gradient(135deg, ${color}, var(--violet))`,
        boxShadow: `0 0 44px color-mix(in srgb, ${color} 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.28)`,
      }
    : {
        background: 'linear-gradient(135deg, #a78bfa, #6366f1)',
        boxShadow: '0 0 44px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.28)',
      };
  const cls = `pressable inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold text-white ${className}`;

  if (to) return <Link to={to} className={cls} style={style} {...rest}>{children}</Link>;
  return <a href={href || '#'} className={cls} style={style} {...rest}>{children}</a>;
}

export function Ghost({ to, children, className = '', ...rest }) {
  const cls = `pressable inline-flex items-center justify-center rounded-pill border border-rule bg-white/5 px-5 py-3 text-sm font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:bg-white/10 ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

export const Chip = ({ color, children, active = false }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-xs font-medium whitespace-nowrap ${
      active ? 'border-white bg-white text-[#050509]' : 'border-white/20 bg-white/[0.04] text-ink'
    }`}
  >
    {color && !active && <Led color={color} />}
    {children}
  </span>
);

/* ------------------------------------------------------------------
   Progress
   ------------------------------------------------------------------ */
export function ProgressBar({ pct, color = 'var(--violet)', label }) {
  // Start at zero and move to the real value on mount, so the bar
  // visibly fills rather than appearing already full.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="relative h-[3px] w-full rounded-pill bg-white/10"
    >
      <div
        className="progress-fill absolute left-0 top-0 h-[3px] rounded-pill"
        style={{ width: `${shown}%`, background: color, boxShadow: pct > 0 ? `0 0 12px ${color}` : 'none' }}
      />
    </div>
  );
}

/* Section heading used across pages. */
export const SectionHead = ({ eyebrow, title, action }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 font-display text-h2 font-bold">{title}</h2>
    </div>
    {action}
  </div>
);
