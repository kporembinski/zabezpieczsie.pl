import { component$, useContext } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { marked } from 'marked';

import Icon from '~/components/core/icon';
import { ChecklistContext } from '~/store/checklist-context';
import type { Section } from "~/types/PSC";
import Table from '~/components/psc/checklist-table';

export default component$(() => {
  const checklists = useContext(ChecklistContext);
  const loc = useLocation();
  const slug = loc.params.title;

  const section: Section | undefined = checklists.value.find(
    (item: Section) => item.slug === slug
  );

  const parseMarkdown = (text: string | undefined): string => {
    return marked.parse(text || '', { async: false }) as string || '';
  };

  if (!section) {
    return (
      <div class="p-8 text-center text-error">
        <h2 class="text-2xl font-bold">Nie znaleziono sekcji</h2>
        <p class="mt-2">Sprawdź, czy adres URL jest poprawny.</p>
      </div>
    );
  }

  return (
    <div class="md:my-8 md:px-16 sm:px-2 rounded-md">
      <article class="bg-back p-8 mx-auto w-full max-w-[1200px] rounded-lg shadow-md">
        <h1 class="gap-2 text-5xl font-bold capitalize flex">
          <Icon height={36} width={36} icon={section.icon || 'star'} />
          {section.title}
        </h1>

        {section.intro && (
          <p class="py-2" dangerouslySetInnerHTML={parseMarkdown(section.intro)}></p>
        )}

        <div class="mt-8">
          <h2 class="text-2xl font-semibold mb-4">Debug: Lista punktów</h2>
          {section.checklist.map((item, index) => {
            const rawPointId = `${slug}-${item.point}`;
            const pointId = rawPointId
              .toLowerCase()
              .normalize('NFD')
              .replace(/[̀-ͯ]/g, '')
              .replace(/[^a-z0-9\-]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');

            return (
              <div key={pointId} class="border p-2 mb-2 bg-base-200 rounded">
                <div class="font-semibold">#{index + 1}: {item.point ?? '[brak punktu]'}</div>
                <div class="text-sm italic">{item.details ?? '[brak szczegółów]'}</div>
                <div class="text-xs mt-1 text-gray-500">ID: {pointId}</div>
              </div>
            );
          })}
        </div>

        {section.softwareLinks && section.softwareLinks.length > 0 && (
          <>
            <div class="divider my-4">Przydatne linki</div>
            <h3 class="text-xl my-2">Zalecane oprogramowanie</h3>
            <ul class="list-disc pl-4">
              {section.softwareLinks.map((link, index) => (
                <li key={`${link.url}-${index}`}>
                  <a
                    class="link link-primary"
                    href={link.url}
                    title={link.description}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>

      {import.meta.env.DEV && (
        <pre class="mt-4 bg-base-200 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(section, null, 2)}
        </pre>
      )}
    </div>
  );
});
