/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'surface-variant': 'var(--color-surface-variant)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'on-background': 'var(--color-on-background)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'outline': 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        'primary': 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        'primary-container': 'var(--color-primary-container)',
        'on-primary-container': 'var(--color-on-primary-container)',
        'inverse-primary': 'var(--color-inverse-primary)',
        'secondary': 'var(--color-secondary)',
        'on-secondary': 'var(--color-on-secondary)',
        'tertiary': 'var(--color-tertiary)',
        'on-tertiary': 'var(--color-on-tertiary)',
        'tertiary-container': 'var(--color-tertiary-container)',
        'on-tertiary-container': 'var(--color-on-tertiary-container)',
        'error': 'var(--color-error)',
        'on-error': 'var(--color-on-error)',
        
        // Aliases / Legacy mappings
        'surface-dim': 'var(--color-surface-variant)',
        'surface-bright': '#39393c',
        'surface-tint': 'var(--color-primary)',
        'inverse-surface': 'var(--color-on-surface)',
        'inverse-on-surface': 'var(--color-surface)',
        
        'primary-fixed': '#f0dbff',
        'primary-fixed-dim': '#ddb7ff',
        'on-primary-fixed': '#2c0051',
        'on-primary-fixed-variant': '#6900b3',
        
        'secondary-container': 'var(--color-secondary)',
        'on-secondary-container': '#00311f',
        'secondary-fixed': '#6ffbbe',
        'secondary-fixed-dim': '#4edea3',
        'on-secondary-fixed': '#002113',
        'on-secondary-fixed-variant': '#005236',
        
        'tertiary-fixed': '#ffe088',
        'tertiary-fixed-dim': '#e9c349',
        'on-tertiary-fixed': '#241a00',
        'on-tertiary-fixed-variant': '#574500',
        
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "container-max": "1440px",
        "gutter": "24px",
        "unit": "4px",
        "margin-mobile": "16px",
        "margin-desktop": "64px"
      },
      fontFamily: {
        "label-sm": ["JetBrains Mono", "monospace"],
        "body-md": ["Manrope", "sans-serif"],
        "body-lg": ["Manrope", "sans-serif"],
        "title-md": ["Playfair Display", "serif"],
        "headline-lg-mobile": ["Playfair Display", "serif"],
        "display-lg": ["Playfair Display", "serif"],
        "headline-lg": ["Playfair Display", "serif"]
      },
      fontSize: {
        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "title-md": ["20px", { "lineHeight": "28px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "fontWeight": "700" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "700" }]
      }
    }
  },
  plugins: [],
}
