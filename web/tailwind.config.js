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
    { // TODO: This adds a lot of overhead. Go through code, and remove any un-needed variants.
      pattern: /(bg|outline|text|tw-color|border)-(yellow|lime|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|red)-(200|300|400|500|600)/,
      variants: ['light', 'dark', 'hover', 'focus'],
    },
    {
      pattern: /(badge|bg|checkbox|toggle)-(success|warning|error|info|neutral)/,
      variants: ['light', 'dark', 'hover', 'focus', 'checked'],
    }
  ],
};
