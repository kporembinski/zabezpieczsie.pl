const applyCustomColors = (theme, front, back, primary = "220 100% 50%") => {
  return {
    ...require("daisyui/src/theming/themes")[`[data-theme=${theme}]`],
    "--front":front,
    "--back": back || `${front} /0.75`,
    "--p": primary,
  };
};

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('daisyui'), require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        "front": "hsl(var(--front, 0deg 0% 60% / 10%))",
        "back": "hsl(var(--back, 212 14% 10% / 1))",
      },
    },
  },
  daisyui: {
    themes: [
      { light: applyCustomColors("light", "237 9% 86% / 0.75", "237 9% 86% / 1", "220 100% 50%") },
      { dark: applyCustomColors("dark", "217 14% 17%", "212 14% 10%") },
    ],
  },
  safelist: [
    {
      // Colors are interpolated dynamically from `section.color` (YAML content) in
      // nav.tsx, section-link-grid.tsx, progress.tsx and checklist/index.tsx, so
      // Tailwind's static scanner can't see the literal class names — only the
      // combinations actually built at runtime are listed here.
      pattern: /(bg|outline|text|border)-(yellow|lime|emerald|teal|cyan|blue|indigo|violet|purple|fuchsia|pink|red)-(400|500|600)/,
      variants: ['hover'],
    },
    {
      // Same reason: badgeColor in checklist-table.tsx is built dynamically from
      // getBadgeClass(), which only ever returns these four DaisyUI status names.
      pattern: /(badge|bg|checkbox|toggle)-(success|warning|error|neutral)/,
      variants: ['hover', 'checked'],
    }
  ],
};
