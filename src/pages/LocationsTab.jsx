import { LOCATIONS, METHODS, RARITIES, REGIONS } from "../lib/data.js";
import { locName, useLang } from "../lib/i18n.js";
import { href } from "../lib/router.js";
import { Icon, Section } from "../components/ui.jsx";

export const HORDE = RARITIES.indexOf("Horde");

export function RarityChip({ r }) {
  const { t } = useLang();
  const name = RARITIES[r];
  const horde = r === HORDE;
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[0.74rem] font-medium ${horde ? "bg-accent text-panel" : "bg-sunk text-muted"}`}>
      {t.rarities[name] || name}
    </span>
  );
}

export default function LocationsTab({ p }) {
  const { lang, t } = useLang();
  if (!p.locs.length) return <p className="rounded-2xl border border-line bg-panel p-5 text-muted">{t.noLocations}</p>;

  // Regroupe par région puis par lieu
  const byRegion = new Map();
  for (const [key, method, rarity, min, max] of p.locs) {
    const loc = LOCATIONS[key];
    if (!byRegion.has(loc.region)) byRegion.set(loc.region, new Map());
    const places = byRegion.get(loc.region);
    if (!places.has(key)) places.set(key, []);
    places.get(key).push({ method, rarity, min, max });
  }
  const hasHorde = p.locs.some(l => l[2] === HORDE);

  return (
    <>
      <div>
        <h1 className="text-balance text-[clamp(1.7rem,3.6vw,2.5rem)] font-light leading-[1.05] tracking-[-0.04em]">{t.locationsTitle}</h1>
        {hasHorde && <p className="mt-2 text-[0.9rem] text-muted">{t.hordeHint}</p>}
      </div>
      {[...byRegion.entries()].sort((a, b) => a[0] - b[0]).map(([region, places]) => (
        <Section key={region} title={t.regions[region] ?? REGIONS[region]} aside={`${places.size}`}>
          <ul className="grid gap-2">
            {[...places.entries()].map(([key, rows]) => (
              <li key={key}>
                <a href={href({ page: "location", key })} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-line bg-panel px-4 py-3 hover:border-accent">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-accent">{Icon.pin}</span>
                      <span className="truncate">{locName(LOCATIONS[key], lang)}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {rows.map((r, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 text-[0.8rem] text-muted">
                          <RarityChip r={r.rarity} />
                          <span>{t.methods[METHODS[r.method]] || METHODS[r.method]}</span>
                          <span className="font-mono text-[0.74rem] text-faint">{t.levels(r.min, r.max)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[0.8rem] text-faint group-hover:text-accent-ink">
                    <span className="max-[520px]:hidden">{t.openLocation}</span>{Icon.right}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
