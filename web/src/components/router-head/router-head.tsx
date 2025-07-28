import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      {/* Basics */}
      <title>{head.title || 'ZabezpieszSie.pl - Kompletna lista kontrolna bezpieczeństwa osobistego, która zapewni bezpieczeństwo Twojego cyfrowego życia'}</title>
      <meta name="description" content="Kompletna lista kontrolna bezpieczeństwa osobistego, która zapewni bezpieczeństwo Twojego cyfrowego życia" />
      
      {/* Site config */}
      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#0047ff" />
      <link rel="manifest" href="/manifest.json" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={loc.url.href} />
      <meta property="og:title" content="ZabezpieszSie.pl - Kompletna lista kontrolna bezpieczeństwa osobistego, która zapewni bezpieczeństwo Twojego cyfrowego życia" />
      <meta property="og:description" content="Kompletna lista kontrolna bezpieczeństwa osobistego, która zapewni bezpieczeństwo Twojego cyfrowego życia" />
      <meta property="og:image" content="/banner.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={loc.url.href} />
      <meta name="twitter:title" content="ZabezpieszSie.pl - Kompletna lista kontrolna bezpieczeństwa osobistego, która zapewni bezpieczeństwo Twojego cyfrowego życia" />
      <meta name="twitter:description" content="Kompletna lista kontrolna bezpieczeństwa osobistego, która zapewni bezpieczeństwo Twojego cyfrowego życia" />
      <meta name="twitter:image" content="/banner.png" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}

      {head.scripts.map((s) => (
        <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
      ))}
    </>
  );
});
