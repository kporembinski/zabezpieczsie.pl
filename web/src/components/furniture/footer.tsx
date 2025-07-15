import { component$ } from "@builder.io/qwik";

export default component$(() => {

  const ghLink = 'https://github.com/kporembinski/personal-security-checklist';
  const licenseLink = 'https://github.com/kporembinski/personal-security-checklist/blob/master/LICENSE';
  const authorLink = 'https://aliciasykes.com';
  const translatorLink = 'https://kamilporembinski.pl';

  return (
  <footer class="footer footer-center px-4 py-2 mt-4 text-base-content bg-base-200 bg-opacity-25">
    <aside>
      <p>Licencja <a href={licenseLink} class="link link-primary">MIT</a> -
      © <a href={authorLink} class="link link-primary">Alicia Sykes</a> 2024. Tłumaczenie <a href={translatorLink} class="link link-primary">Kamil Porembiński</a> 2024.
      Zobacz źródło na <a href={ghLink} class="link link-primary">GitHub</a></p>
    </aside>
  </footer>
  );
});
