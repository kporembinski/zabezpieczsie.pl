import { component$ } from "@builder.io/qwik";

import Icon from "~/components/core/icon";

export default component$(() => {
  return (
    <div class="hero mb-8 mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10">
      <div class="hero-content text-center bg-front shadow-sm lg:rounded-xl w-full">
        <div class="max-w-2xl flex flex-col place-items-center">
          <p>zabezpieczsie.pl</p>
          <h1 class="text-5xl font-bold">Zabezpiecz Się</h1>
          <p class="subtitle pb-6">Twój przewodnik po zabezpieczaniu życia cyfrowego i ochronie prywatności</p>
          <Icon class="mb-4" icon="shield" width={60} height={60}  />
        </div>
      </div>
    </div>
  );
});
