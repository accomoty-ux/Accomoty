/**
 * Design tokens live in src/index.css as CSS custom properties.
 * This config maps them into Tailwind so components never hardcode a hex value.
 * Changing a color anywhere in the product means changing index.css only.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          dim: 'var(--ink-dim)',
        },
        rule: 'var(--rule)',
        // Brand accents
        violet: 'var(--violet)',
        indigo: 'var(--indigo)',
        cyan: 'var(--cyan)',
        // The six category colors — the core of Accomoty's visual system.
        cat: {
          trading: 'var(--c-trading)',
          business: 'var(--c-business)',
          programming: 'var(--c-programming)',
          design: 'var(--c-design)',
          ai: 'var(--c-ai)',
          marketing: 'var(--c-marketing)',
          others: 'var(--c-others)',
        },
      },
      fontFamily: {
        display: ['Inter Tight', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale — a fourth, rounded to whole pixels.
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        meta: ['0.75rem', { lineHeight: '1.5' }],
        body: ['0.9375rem', { lineHeight: '1.65' }],
        lead: ['1rem', { lineHeight: '1.65' }],
        h3: ['1.3125rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        h2: ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        h1: ['2.25rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        hero: ['3.25rem', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
      },
      maxWidth: {
        shell: '1200px',
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
