import { useMemo, useState } from "react";
import { ALL, BY_ID, STATS, STAT_COL, genderInfo, pad } from "../lib/data.js";
import { NATURES, abilName, natFx, natName } from "../lib/breeding.js";
import { nameOf, useLang } from "../lib/i18n.js";
import { Dropdown, Sprite } from "./ui.jsx";

const DITTO = 132;
const fieldCls = "h-10 w-full rounded-[10px] border border-line bg-panel px-3 text-[0.9rem] focus:border-accent focus:outline-none";

/**
 * Formulaire d'un Pokémon de la boîte.
 * allowed : espèces proposées (compatibles avec l'élevage en cours)
 */
export default function PokemonForm({ initial, allowed, title, onSave, onCancel }) {
  const { lang, t } = useLang();
  const [species, setSpecies] = useState(initial?.species ?? null);
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState(initial?.gender ?? "F");
  const [ivs, setIvs] = useState(() => ({ hp: "", atk: "", def: "", spa: "", spd: "", spe: "", ...(initial?.ivs || {}) }));
  const [nature, setNature] = useState(initial?.nature ?? "");
  const [ability, setAbility] = useState(initial?.ability ?? "");
  const [error, setError] = useState("");

  const p = species ? BY_ID.get(species) : null;
  const g = p ? (p.id === DITTO ? { kind: "N" } : genderInfo(p)) : null;
  const fixedGender = g && (g.kind === "N" ? "N" : g.kind === "M" ? "M" : g.kind === "F" ? "F" : null);
  const shownGender = fixedGender || gender;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
    const list = (allowed || ALL).filter(x => !q || x.keyFr.includes(q) || x.keyEn.includes(q) || String(x.id) === q);
    return list.slice(0, 8);
  }, [query, allowed]);

  const setIv = (s, v) => {
    const n = v === "" ? "" : Math.max(0, Math.min(31, parseInt(v, 10) || 0));
    setIvs(cur => ({ ...cur, [s]: n }));
  };

  const save = e => {
    e.preventDefault();
    if (!p) { setError(t.formNeedSpecies); return; }
    const clean = Object.fromEntries(STATS.map(s => [s, ivs[s] === "" ? null : +ivs[s]]));
    onSave({ ...(initial || {}), id: initial?.id ?? Date.now() + Math.random(), species: p.id, gender: shownGender, ivs: clean, nature: nature || null, ability: ability || null });
  };

  const abilities = p ? [...new Set(p.abilities.filter(Boolean))] : [];

  return (
    <form onSubmit={save} className="grid gap-4 rounded-2xl border border-accent bg-panel p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[1.05rem] font-medium">{title}</h3>
        <button type="button" onClick={onCancel} className="text-[0.84rem] text-muted hover:text-fg">{t.cancel}</button>
      </div>

      {/* Espèce */}
      <div className="grid gap-1.5">
        <span className="eyebrow">{t.formSpecies}</span>
        {p ? (
          <div className="flex items-center gap-3 rounded-xl bg-sunk px-3 py-2">
            <span className="grid size-10 place-items-center"><Sprite p={p} className="size-10" /></span>
            <span className="flex-1 font-medium">{nameOf(p, lang)} <span className="font-mono text-[0.75rem] text-faint">#{pad(p.id)}</span></span>
            <button type="button" className="text-[0.84rem] text-accent-ink underline underline-offset-4" onClick={() => { setSpecies(null); setAbility(""); }}>{t.change}</button>
          </div>
        ) : (
          <div className="grid gap-1.5">
            <input id="form-species" autoFocus className={fieldCls} placeholder={t.formSpeciesPh} value={query} onChange={e => setQuery(e.target.value)} />
            <div className="flex flex-wrap gap-1.5">
              {matches.map(x => (
                <button key={x.id} type="button" onClick={() => { setSpecies(x.id); setError(""); }} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel py-0.5 pl-1 pr-3 text-[0.84rem] hover:border-accent">
                  <span className="grid size-7 place-items-center"><Sprite p={x} className="size-7" fallbackClass="size-4" /></span>
                  {nameOf(x, lang)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* Genre */}
        <div className="grid gap-1.5">
          <span className="eyebrow">{t.formGender}</span>
          {fixedGender ? (
            <span className="inline-flex h-10 items-center rounded-[10px] bg-sunk px-3 text-[0.9rem] text-muted">{fixedGender === "N" ? t.genderless : fixedGender === "M" ? "♂" : "♀"}</span>
          ) : (
            <div className="inline-flex gap-1 rounded-[11px] bg-sunk p-1">
              {[["M", "♂"], ["F", "♀"]].map(([v, l]) => (
                <button key={v} type="button" aria-pressed={gender === v} onClick={() => setGender(v)} className={`h-8 w-11 rounded-lg text-[1rem] ${gender === v ? "bg-panel font-semibold text-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)]" : "text-muted"}`}>{l}</button>
              ))}
            </div>
          )}
        </div>
        {/* Nature */}
        <div className="grid gap-1.5">
          <span className="eyebrow">{t.nature}</span>
          <Dropdown
            size="lg"
            label={t.formAnyNature}
            active={!!nature}
            value={nature}
            onChange={setNature}
            options={[{ value: "", label: t.formAnyNature }, { sep: true }, ...Object.keys(NATURES).map(k => ({ value: k, label: natName(k, lang), tag: natFx(k, t) }))]}
          />
        </div>
        {/* Talent */}
        {abilities.length > 0 && (
          <div className="grid gap-1.5">
            <span className="eyebrow">{t.formAbility}</span>
            <Dropdown
              size="lg"
              label={t.formAnyAbility}
              active={!!ability}
              value={ability}
              onChange={setAbility}
              options={[{ value: "", label: t.formAnyAbility }, { sep: true }, ...abilities.map(a => ({ value: a, label: abilName(a, lang), tag: p.abilities[2] === a ? t.hiddenShort : undefined }))]}
            />
          </div>
        )}
      </div>

      {/* IV */}
      <div className="grid gap-1.5">
        <span className="eyebrow">{t.formIvs}</span>
        <div className="grid grid-cols-6 gap-1.5 max-[520px]:grid-cols-3">
          {STATS.map(s => {
            const is31 = +ivs[s] === 31;
            return (
              <label key={s} className={`grid gap-1 rounded-[11px] border p-1.5 text-center ${is31 ? "iv-chip border-transparent" : "border-line"}`} style={{ "--s": STAT_COL[s] }}>
                <span className="text-[0.74rem] font-medium">{t.short[s]}</span>
                <input
                  id={"iv-" + s}
                  inputMode="numeric"
                  value={ivs[s]}
                  placeholder="?"
                  onChange={e => setIv(s, e.target.value)}
                  className="h-8 w-full rounded-lg border border-line bg-panel text-center font-mono text-[0.95rem] focus:border-accent focus:outline-none"
                />
                <button type="button" onClick={() => setIv(s, is31 ? "" : 31)} className="text-[0.7rem] text-muted hover:text-fg">{is31 ? t.formClear : "31"}</button>
              </label>
            );
          })}
        </div>
        <p className="text-[0.78rem] text-faint">{t.formIvHint}</p>
      </div>

      {error && <p className="text-[0.86rem] text-[oklch(0.6_0.18_25)]">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="h-10 rounded-xl bg-fg px-5 text-[0.9rem] font-medium text-bg hover:bg-accent-ink">{t.save}</button>
        <button type="button" onClick={onCancel} className="h-10 rounded-xl border border-line px-4 text-[0.9rem] text-muted hover:text-fg">{t.cancel}</button>
      </div>
    </form>
  );
}
