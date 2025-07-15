// src/routes/_404.tsx
import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div>
      <h1>404 Nie znaleziono</h1>
      <p>Szukana strona nie istnieje.</p>
      <a href="/">Wróć do strony głównej</a>
    </div>
  );
});
