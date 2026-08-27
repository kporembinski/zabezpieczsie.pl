import { component$ } from "@builder.io/qwik";
import Icon from "~/components/core/icon";

export default component$(() => {
  return (
    <div class="hero mb-8 mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10">
      <div class="hero-content text-center bg-front shadow-sm lg:rounded-xl w-full">
        <div class="max-w-3xl flex flex-col place-items-center">
          <a
            href="/cyberataki"
            class="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full
                   text-sm font-medium bg-warning/10 text-warning border border-warning/30
                   hover:bg-warning/20 transition"
          >
            <Icon icon="articles" width={14} height={14} />
            Nowe ataki i wycieki danych w polskich firmach — zobacz historię
          </a>
          <h1 class="text-5xl font-bold">Zabezpiecz Się</h1>
          <p class="text-lg leading-snug pt-3 pb-2">Interaktywna checklista bezpieczeństwa cyfrowego — odhaczaj punkty, śledź postęp, chroń swoją prywatność.</p>
          <p class="text-sm opacity-70 pb-6">Wybierz sekcję poniżej i zacznij odhaczać punkty — postęp zapisuje się tylko lokalnie w Twojej przeglądarce. Nie widzę ani nie zbieram tego, co odhaczasz.</p>
        </div>
      </div>
    </div>
  );
});
