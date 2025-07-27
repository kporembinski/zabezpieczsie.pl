import { component$, useResource$, Resource } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Icon from "~/components/core/icon";
import { projects, socials, intro, contributing, license } from './about-content';
import { marked } from "marked";

export default component$(() => {

  interface Contributor {
    login: string;
    avatar_url: string;
    avatarUrl: string;
    html_url: string;
    contributions: number;
    name: string;
  }

  const parseMarkdown = (text: string | undefined): string => {
    return marked.parse(text || '', { async: false }) as string || '';
  };

  const contributorsResource = useResource$<Contributor[]>(async () => {
    const url = 'https://api.github.com/repos/kporembinski/zabezpieczsie.pl/contributors?per_page=100';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Nie udało się pobrać danych o autorach');
    }
    return await response.json();
  });

  const sponsorsResource = useResource$<Contributor[]>(async () => {
    const url = 'https://github-sponsors.as93.workers.dev/kporembinski';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Nie udało się pobrać sponsorów');
    }
    return await response.json();
  });


  return (
    <div class="m-4 md:mx-16">
      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">O stronie ZabezpieczSie.pl</h2>
        {intro.map((paragraph, index) => (
          <p class="mb-2" key={index}>{paragraph}</p>
        ))}        
      </article>
      <div class="divider"></div>

      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">Rozwijanie</h2>
        {contributing.map((paragraph, index) => (
          <p class="mb-2" key={index} dangerouslySetInnerHTML={parseMarkdown(paragraph)}></p>
        ))}        
      </article>
      <div class="divider"></div>

      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">Podziękowania</h2>


        <h3 class="text-2xl mb-2">Sponsorzy</h3>

        <p>
          Ogromne podziękowania dla poniższych sponsorów za ich nieustające wsparcie.
        </p>

        <div class="flex flex-wrap gap-4 my-4 mx-auto">
          <Resource
              value={sponsorsResource}
              onPending={() => <p>Loading...</p>}
              onResolved={(contributors: Contributor[]) => (
                contributors.map((contributor: Contributor) => (
                  <a
                    class="w-16 tooltip tooltip-bottom"
                    href={contributor.html_url || `https://github.com/${contributor.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={contributor.login}
                    data-tip={`Thank you @${contributor.login}`}
                  >
                    <img
                      class="avatar rounded"
                      width="64" height="64"
                      src={contributor.avatar_url || contributor.avatarUrl}
                      alt={contributor.login}
                    />
                    <p
                      class="text-ellipsis overflow-hidden w-max-16 mx-auto line-clamp-2"
                    >{contributor.name || contributor.login}</p>
                  </a>
                ))
              )}
            />
          </div>

        <div class="divider"></div>

        <h3 class="text-2xl mb-2">Autorzy</h3>
        <p>
          Ten projekt istnieje dzięki wszystkim osobom, które pomogły go stworzyć i utrzymać. Szczególne podziękowania dla poniższych 100 najlepszych współpracowników.
        </p>
        <div class="flex flex-wrap gap-4 my-4 mx-auto">
          <Resource
            value={contributorsResource}
            onPending={() => <p>Loading...</p>}
            onResolved={(contributors: Contributor[]) => (
              contributors.map((contributor: Contributor) => (
                <a
                  class="w-16 tooltip tooltip-bottom"
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={contributor.login}
                  data-tip={`@${contributor.login} has contributed ${contributor.contributions} times\n\nKliknij, aby wyświetlić ich profil`}
                >
                  <img
                    class="avatar rounded"
                    width="64" height="64"
                    src={contributor.avatar_url}
                    alt={contributor.login}
                  />
                  <p
                    class="text-ellipsis overflow-hidden w-max-16 mx-auto"
                  >{contributor.login}</p>
                </a>
              ))
            )}
          />
        </div>

      </article>
      <div class="divider"></div>

      <article class="bg-back p-8 mx-auto max-w-[1200px] my-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2" id="author">O autorze</h2>
          <p>
            Projekt ten został pierwotnie zainicjowany przez <a href="https://aliciasykes.com" class="link link-primary">Alicię Sykes</a> – przy znacznym wsparciu społeczności.
          </p>
          <br />
          <div class="ml-4 float-right">
            <img class="rounded-lg" width="180" height="240" alt="Kamil Porembiński" src="https://kamilporembinski.pl/media/posts/328/gallery/kamil-porembinski-7.jpg" />
            <div class="flex gap-2 my-2 justify-between">
              {
                socials.map((social, index) => (
                  <a key={index} href={social.link}>
                    <Icon icon={social.icon} width={24} height={24} />
                  </a>
                ))
              }
            </div>
          </div>
          <p class="text-lg italic font-thin">
            Szkolę, wykładam, pomagam, zarządzam, doradzam, żegluję, nurkuję, pilotuję.
          </p>
          <br />
          <p>
            Cześć, nazywam się Kamil Porembiński i jestem upierdliwy, ale potrzebny. Od ponad dwudziestu lat pomagam małym i dużym firmom w ulepszaniu ich biznesu, dzięki technologii. Automatyzuję procesy, wdrażam sztuczną inteligencję oraz dbam o ich cyberbezpieczeństwo.
          </p>
          <ul class="list-disc pl-8">
            {
              projects.map((project, index) => (
                <li key={index}>
                  <img class="rounded inline mr-1" width="20" height="20" alt={project.title} src={project.icon} />
                  <a href={project.link} class="link link-secondary" target="_blank" rel="noreferrer">
                    {project.title}
                  </a> - {project.description}
                </li>
              ))
            }
          </ul>
          <br />
          <p>
            Więcej na temat cyberbezpieczeństwa znajdziesz u mnie na stronie <a href="https://kamilporembinski.pl/">kamilporembinski.pl</a> lub obsewrwuj mnie na <a href="https://www.linkedin.com/in/kamilporembinski/">LinkedIn</a>.
          </p>

      </article>

      <div class="divider"></div>

      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">Licencja</h2>
        <p>Projekt ten jest objęty podwójną licencją, przy czym zawartość listy kontrolnej (znajdująca się w pliku <a class="link" href="https://github.com/kporembinski/zabezpieczsie.pl/blob/HEAD/personal-security-checklist.yml">personal-security-checklist.yml)</a> jest objęta licencją CC BY-NC-SA 4.0. Wszystkie pozostałe elementy (w tym cały kod) są objęte licencją MIT.
        </p>
        <pre class="bg-front whitespace-break-spaces rounded text-xs my-2 mx-auto p-2">
          {license}
        </pre>
        <details class="collapse">
          <summary class="collapse-title">
            <h3 class="mt-2">Co to oznacza dla Ciebie?</h3>
          </summary>
          <div class="collapse-content">
            <p class="mb-2">
              Oznacza to, że w odniesieniu do wszystkich elementów (z wyjątkiem pliku YAML zawierającego listę kontrolną) użytkownik ma niemal nieograniczoną swobodę w zakresie użytkowania, kopiowania, modyfikowania, łączenia, publikowania, dystrybucji, udzielania sublicencji i/lub sprzedaży kopii tego oprogramowania. Jedynym wymogiem jest umieszczenie oryginalnej informacji o prawach autorskich i zezwoleniu w każdej kopii oprogramowania.
            </p>
            <p class="mb-2">
              W przypadku treści z listy bezpieczeństwa możesz udostępniać i dostosowywać te treści, o ile podasz odpowiednią informację o autorstwie, nie wykorzystasz ich do celów komercyjnych i udostępnisz swoje materiały na tej samej licencji.
            </p>
          </div>
        </details>

      </article>

    </div>
  );
});

export const head: DocumentHead = {
  title: "O projekcie | ZabezpieczSie.pl",
  meta: [
    {
      name: "description",
      content: "Projekt ten ma na celu dostarczenie praktycznych wskazówek dotyczących poprawy bezpieczeństwa cyfrowego i ochrony prywatności w Internecie.",
    },
  ],
};
