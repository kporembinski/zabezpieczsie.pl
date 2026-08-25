import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";

import AttacksTable from "~/components/attacks/attacks-table";
import type { Attack } from "~/types/Attack";
import attacksData from "~/data/attacks.json";

export const useAttacks = routeLoader$((): Attack[] => {
  return attacksData as Attack[];
});

export default component$(() => {
  const attacks = useAttacks();

  return (
    <main class="mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10 mb-8">
      <div class="bg-front shadow-sm lg:rounded-xl w-full p-8">
        <h1 class="text-3xl font-bold mb-4">Cyberataki na polskie firmy</h1>
        <p class="mb-4">
          Poniższa lista pokazuje realne ataki i wycieki danych dotykające
          polskich firm — kontekst dla checklisty bezpieczeństwa: to się dzieje
          naprawdę.{' '}
          <a href="/checklist" class="link link-primary">
            Zobacz, jak się zabezpieczyć.
          </a>
        </p>
        <div role="alert" class="alert alert-warning mb-6">
          <span>
            Wpisy oznaczone jako „niepotwierdzone” pochodzą z deklaracji grup
            ransomware na ich własnych stronach — nie są zweryfikowane przez
            ofiarę ani stronę trzecią. Wpisy z bezpiecznedane.gov.pl (NASK/CERT)
            są oficjalne.
          </span>
        </div>
        <AttacksTable attacks={attacks.value} />
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Cyberataki na polskie firmy | ZabezpieczSie.pl",
  meta: [
    {
      name: "description",
      content: "Chronologiczna lista cyberataków i wycieków danych dotykających polskich firm.",
    },
  ],
};
