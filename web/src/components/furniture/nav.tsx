
import { $, component$, useContext } from "@builder.io/qwik";
import Icon from "~/components/core/icon";
import type { Section } from '~/types/PSC';
import { useTheme } from '~/store/theme-store';
import { ChecklistContext } from '~/store/checklist-context';


export default component$(() => {

  const data = useContext(ChecklistContext);

  const { theme, setTheme } = useTheme();

  const themes = [
    'dark', 'light', 'night', 'cupcake', 
    'bumblebee', 'corporate', 'synthwave', 'retro', 
    'valentine', 'halloween', 'aqua', 'lofi', 
    'fantasy', 'dracula'
  ];

    const deleteAllData = $(() => {
    const isConfirmed = confirm('Czy na pewno chcesz usunąć wszystkie dane lokalne? Spowoduje to utratę postępów.');
    if (isConfirmed) {
      localStorage.clear();
      location.reload();
    }
  });

  return (
    <>
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" /> 
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost text-xl flex capitalize">
            <label for="my-drawer-3" aria-label="open sidebar" class="tooltip tooltip-bottom" data-tip="Strona główna"><Icon class="mr-2" icon="shield" width={28} height={28}  /></label>
            <h1>Zabezpiecz Się</h1>
          </a>
        </div>
        <div class="flex-none hidden md:flex">
          <ul class="menu menu-horizontal px-1">
            <li>
              <a href="https://suppi.pl/kporembinski"
                class="tooltip flex tooltip-bottom" data-tip="Postaw mi kawkę za dobrą robotę">
                <Icon icon="coffee" width={16} height={16}  />Postaw kawkę
              </a>
            </li>
            <li>
              <details>
                <summary>
                  <Icon icon="checklist" width={16} height={16}  />
                  Checklisty
                </summary>
                <ul class="p-2 bg-base-100 rounded-t-none z-10">
                  {data.value.map((item: Section, index: number) => (
                    <li key={`checklist-nav-${index}`} class={`hover:bg-${item.color}-600 hover:bg-opacity-15`}>
                      <a href={`/checklist/${item.slug}`}>
                      <Icon color={item.color} class="mr-2" icon={item.icon} width={16} height={16}  />
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <a href="https://github.com/kporembinski/zabezpieczsie.pl"
                class="tooltip flex tooltip-bottom" data-tip="Zobacz/edycja źródła i danych">
                <Icon icon="github" width={16} height={16}  />GitHub
              </a>
            </li>
          </ul>
          <div class="tooltip tooltip-bottom" data-tip="Motyw">
            <label class="cursor-pointer grid place-items-center">
              <input
                type="checkbox"
                checked={theme.theme === 'dark'}
                onClick$={() => {
                  setTheme(theme.theme === 'dark' ? 'light' : 'dark');
                }}
                class="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
              />
              <svg class="col-start-1 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              <svg class="col-start-2 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </label>
          </div>
          <li class="list-none px-2">
            <p
              onClick$={() => ((document.getElementById('settings_modal') || {}) as HTMLDialogElement).showModal()}
              class="cursor-pointer tooltip flex tooltip-bottom" data-tip="Ustawienia">
                <Icon icon="settings" width={20} height={20}  />
            </p>
          </li>
        </div>
      </div>

      <dialog id="settings_modal" class="modal">
        <div class="modal-box">
          <div class="tabs tabs-lifted">
            <p class="tab tab-active">Ustawienia</p>
            <a class="tab" href="/about">O projekcie</a>
          </div>
          <div class="modal-action justify-start w-full flex flex-col gap-4">
              <div class="flex items-between w-full justify-between">
                <label for="theme" class="label">Motyw</label>
                <select 
                  id="theme" 
                  class="select select-bordered w-full max-w-xs"
                  onChange$={(event) => setTheme((event.target as HTMLSelectElement).value) }
                  >
                  <option disabled selected>Motyw</option>
                  {themes.map((someTheme) => (
                    <option
                      key={someTheme}
                      value={someTheme}
                      selected={someTheme === theme.theme}
                      >
                      {someTheme.charAt(0).toUpperCase() + someTheme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div class="flex items-between w-full justify-between">
                <label class="label">Postęp</label>
                <button class="btn btn-primary" onClick$={deleteAllData}>Skasuj wszystko</button>
              </div>
              <button
                class="btn my-1 mx-auto"
                onClick$={() => ((document.getElementById('settings_modal') || {}) as HTMLDialogElement).close()}
              >Zamknij</button>
            </div>
        </div>
      </dialog>
    </>
  );
});
