import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="hero mb-8 mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10">
      <div class="hero-content text-center bg-front shadow-sm lg:rounded-xl w-full">
        <div class="max-w-2xl flex flex-col place-items-center">
          <h1 class="text-5xl font-bold">Zabezpiecz Się</h1>
          <p class="subtitle pb-6">Interaktywna checklista bezpieczeństwa cyfrowego — odhaczaj punkty, śledź postęp, chroń swoją prywatność.</p>
          <p class="opacity-80 mb-6">Wybierz sekcję poniżej i zacznij odhaczać punkty — Twój postęp zapisuje się automatycznie.</p>
          <div class="p-4 rounded-box bg-base-100 shadow-md w-full max-w-md">
            <p class="text-sm opacity-80 mb-2">
              Chcesz zobaczyć, dlaczego to się przydaje? Sprawdź, jakie
              ataki i wycieki danych dotknęły ostatnio polskie firmy.
            </p>
            <p class="text-lg">
              Zobacz historię ataków: <a class="link link-secondary font-bold" href="/cyberataki">Cyberataki na polskie firmy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
