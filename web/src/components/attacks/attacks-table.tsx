import { component$, useStore } from "@builder.io/qwik";
import type { Attack, AttackType } from "~/types/Attack";

const TYPE_LABELS: Record<AttackType, string> = {
  ransomware: 'Ransomware',
  wyciek_danych: 'Wyciek danych',
};

const TYPE_BADGE_CLASS: Record<AttackType, string> = {
  ransomware: 'badge-error',
  wyciek_danych: 'badge-warning',
};

const MONTHS = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

const formatMonthLabel = (date: string): string => {
  const [year, month] = date.split('-');
  const monthIndex = month ? parseInt(month, 10) - 1 : -1;
  return monthIndex >= 0 && monthIndex < 12 ? `${MONTHS[monthIndex]} ${year}` : year;
};

type Group = { label: string; items: Attack[] };

const groupByMonth = (attacks: Attack[]): Group[] => {
  const groups: Group[] = [];
  for (const attack of attacks) {
    const label = formatMonthLabel(attack.date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(attack);
    } else {
      groups.push({ label, items: [attack] });
    }
  }
  return groups;
};

const MONTHS_PER_PAGE = 6;

export default component$((props: { attacks: Attack[] }) => {
  const filterState = useStore<{ type: 'all' | AttackType; visibleMonths: number }>({
    type: 'all',
    visibleMonths: MONTHS_PER_PAGE,
  });

  const sorted = [...props.attacks].sort((a, b) => (a.date < b.date ? 1 : -1));
  const filtered = sorted.filter(
    (attack) => filterState.type === 'all' || attack.type === filterState.type
  );
  const allGroups = groupByMonth(filtered);
  const groups = allGroups.slice(0, filterState.visibleMonths);
  const hasMore = allGroups.length > groups.length;

  const filterButtons: { value: 'all' | AttackType; label: string }[] = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'ransomware', label: 'Ransomware' },
    { value: 'wyciek_danych', label: 'Wyciek danych' },
  ];

  return (
    <div>
      <div class="flex gap-2 my-4">
        {filterButtons.map((button) => (
          <button
            key={button.value}
            class={`btn btn-sm ${filterState.type === button.value ? 'btn-primary' : ''}`}
            onClick$={() => {
              filterState.type = button.value;
              filterState.visibleMonths = MONTHS_PER_PAGE;
            }}
          >
            {button.label}
          </button>
        ))}
      </div>

      {groups.length === 0 && <p class="opacity-70">Brak danych do wyświetlenia.</p>}

      {groups.map((group) => (
        <div key={group.label} class="mb-8">
          <h3 class="text-lg font-bold mb-2 capitalize">{group.label}</h3>
          <div class="join join-vertical w-full">
            {group.items.map((attack, index) => (
              <div
                key={`${attack.source}-${attack.company}-${attack.date}-${index}`}
                class="p-4 rounded bg-base-200 mb-2"
              >
                <div class="flex flex-wrap items-center gap-2 justify-between">
                  <span class="font-bold">{attack.company}</span>
                  <div class="flex gap-2 items-center flex-wrap">
                    {attack.sector && <span class="badge badge-ghost">{attack.sector}</span>}
                    <span class={`badge ${TYPE_BADGE_CLASS[attack.type]}`}>
                      {TYPE_LABELS[attack.type]}
                    </span>
                    {!attack.verified && (
                      <span
                        class="badge badge-error tooltip tooltip-left"
                        data-tip="Deklaracja grupy przestępczej, niepotwierdzona przez ofiarę"
                        title="Deklaracja grupy przestępczej, niepotwierdzona przez ofiarę"
                        aria-label="Deklaracja grupy przestępczej, niepotwierdzona przez ofiarę"
                      >
                        ⚠ niepotwierdzone
                      </span>
                    )}
                  </div>
                </div>
                {attack.description && (
                  <p class="text-sm opacity-70 mt-2">{attack.description}</p>
                )}
                <a
                  href={attack.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs link mt-2 inline-block"
                >
                  Źródło: {attack.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          class="btn btn-sm w-full"
          onClick$={() => (filterState.visibleMonths += MONTHS_PER_PAGE)}
        >
          Pokaż więcej
        </button>
      )}
    </div>
  );
});
