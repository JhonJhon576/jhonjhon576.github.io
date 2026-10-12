import { useMemo, useState } from "react";
import { STATS, STAT_COL, finalsFrom } from "../lib/data.js";
import { NATURES, PRICE_DEFAULTS, abilName, abilityRanking, breedInfo, buildTree, natFx, natName, planSummary, recommend } from "../lib/breeding.js";
import { nameOf, useLang } from "../lib/i18n.js";
import { useStored } from "../lib/storage.js";
import { href } from "../lib/router.js";
import { Dropdown, Section, Sprite } from "../components/ui.jsx";

export default function Breeding({ p }) {
  const { lang, t } = useLang();
  const info = useMemo(() => breedInfo(p), [p]);
  const finals = useMemo(() => finalsFrom(p), [p]);

  const [ivs, setIvs] = useStored("ivs", STATS);
  const [natured, setNatured] = useStored("natured", true);
  const [view, setView] = useStored("bview", "tree");
  const [prices, setPrices] = useStored("prices", PRICE_DEFAULTS);
  const [pricesOpen, setPricesOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [natureChoice, setNatureChoice] = useState(null);

  const target = finals.find(f => f.id === targetId) || finals[0];
  const rec = recommend(target.stats);
  const nature = natureChoice && natureChoice.for === target.id ? natureChoice.k : rec.primary;
  const abil = abilityRanking(target);
  const chosen = STATS.filter(s => ivs.includes(s));
  const price = { ...PRICE_DEFAULTS, ...prices };
  const femaleShare = info.gender.female;
  const pct = x => `${Math.round(x * 1000) / 10} %`;
  const genderTxt = info.gender.kind === "N" ? t.genderless : info.gender.kind === "M" ? t.maleOnly : info.gender.kind === "F" ? t.femaleOnly : `♂ ${pct(1 - femaleShare)} · ♀ ${pct(femaleShare)}`;

  const head = (
    <div className="flex items-center gap-4">
      <span className="grid size-[76px] flex-none place-items-center rounded-[20px] bg-accent-soft"><Sprite p={info.root} className="size-[68px]" /></span>
      <div className="min-w-0">
        <h1 className="mb-1 text-balance text-[clamp(1.7rem,3.6vw,2.5rem)] font-light leading-[1.05] tracking-[-0.04em]">{t.breedTitle} {nameOf(target, lang)}</h1>
        <p className="text-[0.88rem] text-muted">
          {t.eggOf} <b className="font-medium text-fg">{nameOf(info.root, lang)}</b> · {t.eggGroups}{" "}
          {info.groups.map(g => <span key={g} className="mr-1 inline-block rounded-full bg-sunk px-2 py-px text-[0.78rem] text-fg">{t.egg[g] || g}</span>)}
          · {genderTxt}
        </p>
      </div>
    </div>
  );
  if (!info.canBreed) return <>{head}<p className="rounded-xl bg-sunk p-4">{t.cannotBreed}</p></>;

  const best = abil[0], bestReg = abil.find(a => !a.hidden);
  const recIvs = STATS.filter(s => !rec.useless.includes(s));
  const card = "grid content-start gap-1 rounded-2xl border border-line bg-panel p-4";
  const miniBtn = "mt-2 h-[30px] justify-self-start rounded-[9px] border border-line bg-sunk px-3 text-[0.8rem] hover:border-accent";

  const advice = (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
      <div className={card}>
        <span className="eyebrow">{t.recNature}</span>
        <div className="text-2xl tracking-[-0.03em]">{natName(rec.primary, lang)}</div>
        <span className="font-mono text-[0.76rem] text-accent-ink">{natFx(rec.primary, t)}</span>
        <p className="mt-1.5 text-[0.84rem] text-muted">{t.roles[rec.role]}</p>
        <span className="mt-1.5 text-[0.82rem] text-muted">{t.alternative} : <b className="font-medium text-fg">{natName(rec.alt, lang)}</b> <span className="font-mono text-[0.76rem] text-accent-ink">{natFx(rec.alt, t)}</span></span>
      </div>
      <div className={card}>
        <span className="eyebrow">{t.recAbility}</span>
        <div className="text-2xl tracking-[-0.03em]">
          {abilName(best.name, lang)}
          {best.hidden && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 align-middle text-[0.7rem] font-medium tracking-normal text-accent-ink">{t.hidden}</span>}
        </div>
        <span className="font-mono text-[0.76rem] text-accent-ink">{abil.map(a => abilName(a.name, lang) + (a.hidden ? ` (${t.hiddenShort})` : "")).join(" · ")}</span>
        <p className="mt-1.5 text-[0.84rem] text-muted">{best.hidden && bestReg ? t.haNote(abilName(bestReg.name, lang)) : t.abilityNote}</p>
      </div>
      <div className={card}>
        <span className="eyebrow">{t.usefulIvs}</span>
        <div className="text-2xl tracking-[-0.03em]">{recIvs.length}×31{natured ? ` + ${t.nature.toLowerCase()}` : ""}</div>
        <span className="font-mono text-[0.76rem] text-accent-ink">{recIvs.map(s => t.short[s]).join(" · ")}</span>
        <p className="mt-1.5 text-[0.84rem] text-muted">{rec.useless.length ? t.uselessIv(rec.useless.map(s => t.stats[s]).join(", ")) : t.allUseful}{rec.trickRoom ? " " + t.trickRoom : ""}</p>
        {rec.useless.length > 0 && chosen.length === 6 && (
          <button type="button" className={miniBtn} onClick={() => setIvs(recIvs)}>{t.applyRec(recIvs.length)}</button>
        )}
      </div>
    </section>
  );

  const toggleIv = s => setIvs(cur => (cur.includes(s) ? cur.filter(x => x !== s) : STATS.filter(x => cur.includes(x) || x === s)));
  const goal = (
    <Section title={t.goal}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1" role="group">
          {STATS.map(s => {
            const on = chosen.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggleIv(s)}
                style={{ "--s": STAT_COL[s] }}
                className={`grid h-11 min-w-[52px] place-content-center rounded-[11px] px-2.5 text-[0.8rem] font-medium leading-tight ${on ? "iv-chip border border-transparent text-fg" : "border border-dashed border-line text-faint"}`}
              >
                {t.short[s]}
                <small className="font-mono text-[0.66rem] font-normal">31</small>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-pressed={natured}
          onClick={() => setNatured(!natured)}
          className={`h-11 min-w-[76px] rounded-[11px] px-3 text-[0.82rem] font-medium ${natured ? "border border-transparent bg-accent-soft text-accent-ink" : "border border-dashed border-line text-faint"}`}
        >
          {t.nature}
        </button>
        <Dropdown
          size="lg"
          label={t.nature}
          active
          value={nature}
          onChange={k => { setNatureChoice({ k, for: target.id }); setNatured(true); }}
          options={Object.keys(NATURES).filter(k => NATURES[k][0]).map(k => ({ value: k, label: natName(k, lang), tag: natFx(k, t) }))}
        />
        {finals.length > 1 && (
          <Dropdown
            size="lg"
            label={t.evolvesTo}
            active
            value={String(target.id)}
            onChange={v => setTargetId(+v)}
            options={finals.map(f => ({ value: String(f.id), label: nameOf(f, lang), short: `→ ${nameOf(f, lang)}` }))}
          />
        )}
      </div>
    </Section>
  );

  if (!chosen.length && !natured) return <>{head}{advice}{goal}<p className="rounded-xl bg-sunk p-4">{t.pickSomething}</p></>;

  const tree = buildTree(chosen, natured);
  const sum = planSummary(tree, femaleShare);
  const cost = sum.braceTotal * price.brace + sum.ever * price.ever + (sum.genderSel - sum.rareSel) * price.gender + sum.rareSel * price.rare;
  const money = n => n.toLocaleString(lang === "fr" ? "fr-FR" : "en-US") + " $";
  const ctx = { info, nature, lang, t };

  const groups = {};
  sum.leaves.filter(l => !l.spine).forEach(l => {
    const g = (groups[l.ivs[0]] ||= { M: 0, F: 0 });
    g[l.gender]++;
  });
  const spineLeaf = sum.leaves.find(l => l.spine);

  return (
    <>
      {head}
      {advice}
      {goal}

      <section>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {[[t.basePokemon, sum.leaves.length], [t.breeds, sum.breeds]].map(([k, v]) => (
            <div key={k} className="grid content-start gap-0.5 bg-panel px-4 py-3.5"><span className="eyebrow">{k}</span><b className="font-mono text-[1.6rem] font-normal tabular-nums">{v}</b></div>
          ))}
          <div className="grid content-start gap-0.5 bg-panel px-4 py-3.5">
            <span className="eyebrow">{t.items}</span><b className="font-mono text-[1.6rem] font-normal">{sum.braceTotal + sum.ever}</b>
            <small className="text-[0.74rem] text-muted">{[...STATS.filter(s => sum.braces[s]).map(s => `${sum.braces[s]} ${t.braces[s]}`), ...(sum.ever ? [`${sum.ever} ${t.everstone}`] : [])].join(" · ")}</small>
          </div>
          <div className="grid content-start gap-0.5 bg-panel px-4 py-3.5">
            <span className="eyebrow">{t.genderSel}</span><b className="font-mono text-[1.6rem] font-normal">{sum.genderSel}</b>
            {sum.rareSel > 0 && <small className="text-[0.74rem] text-muted">{t.rareSel(sum.rareSel)}</small>}
          </div>
          <div className="grid content-start gap-0.5 bg-panel px-4 py-3.5">
            <span className="eyebrow">{t.estCost}</span><b className="font-mono text-[1.35rem] font-normal text-accent-ink">{money(cost)}</b>
            <button type="button" aria-expanded={pricesOpen} className={miniBtn + " !mt-1"} onClick={() => setPricesOpen(o => !o)}>{pricesOpen ? t.closePrices : t.editPrices}</button>
          </div>
        </div>
        {pricesOpen && (
          <div className="mt-2 flex flex-wrap items-end gap-2.5 rounded-[14px] bg-sunk p-3.5">
            {[["brace", t.priceBrace], ["ever", t.priceEver], ["gender", t.priceGender], ["rare", t.priceRare]].map(([k, label]) => (
              <label key={k} className="grid gap-1 text-[0.78rem] text-muted">
                {label}
                <input
                  id={"price-" + k}
                  type="number"
                  min="0"
                  step="500"
                  value={price[k]}
                  onChange={e => setPrices({ ...price, [k]: Math.max(0, +e.target.value || 0) })}
                  className="h-9 w-[130px] rounded-[9px] border border-line bg-panel px-2.5 font-mono text-[0.86rem]"
                />
              </label>
            ))}
            <p className="basis-full text-[0.84rem] text-muted">{t.priceNote}</p>
          </div>
        )}
      </section>

      <Section title={t.toGet} aside={`${sum.leaves.length} ${t.pokemon}`}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2">
          <div className="flex items-center gap-3 rounded-[14px] border border-accent bg-accent-soft px-3 py-2.5">
            <span className="grid size-10 flex-none place-items-center"><Sprite p={info.root} className="size-10" /></span>
            <div className="grid min-w-0">
              <b className="text-[0.92rem] font-medium">1 × {nameOf(info.root, lang)} ♀</b>
              <span className="text-[0.78rem] text-muted">{spineLeaf.nat ? t.spineNat(natName(nature, lang)) : t.spineIv(t.stats[spineLeaf.ivs[0]])}</span>
            </div>
          </div>
          {STATS.filter(s => groups[s]).map(s => (
            <div key={s} className="flex items-center gap-3 rounded-[14px] border border-line bg-panel px-3 py-2.5">
              <span className="iv-chip grid size-10 flex-none place-items-center rounded-xl text-[0.74rem] font-semibold" style={{ "--s": STAT_COL[s] }}>{t.short[s]}</span>
              <div className="grid min-w-0">
                <b className="text-[0.92rem] font-medium">{groups[s].M + groups[s].F} × 31 {t.stats[s]}</b>
                <span className="text-[0.78rem] text-muted">{groups[s].M} ♂ · {groups[s].F} ♀ · {t.anyCompatible}</span>
              </div>
            </div>
          ))}
        </div>
        {info.males.length > 0 && (
          <p className="mt-3 text-[0.84rem] text-muted">
            {t.compatHint(info.groups.map(g => t.egg[g] || g).join(" / "))}{" "}
            {info.males.map(({ q, horde }, i) => (
              <span key={q.id}>
                {i > 0 && ", "}
                <a className="text-accent-ink underline decoration-accent/40 underline-offset-[3px]" href={href({ page: "pokemon", id: q.id, tab: "lieux" })}>{nameOf(q, lang)}</a>
                {horde && <sup className="ml-0.5 text-[0.65rem] text-accent-ink">H</sup>}
              </span>
            ))}
            .
          </p>
        )}
        {info.needsDitto && <p className="mt-3 rounded-xl bg-sunk p-3 text-[0.9rem]">{t.dittoWarn}</p>}
        {info.gender.kind === "F" && <p className="mt-3 text-[0.84rem] text-muted">{t.femaleOnlyHint}</p>}
      </Section>

      <Section
        title={
          <span className="flex items-center gap-3">
            {t.plan}
            <span className="inline-flex gap-0.5 rounded-[9px] bg-sunk p-0.5 normal-case tracking-normal" role="group">
              {[["tree", t.tree], ["steps", t.steps]].map(([v, label]) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-[7px] px-2.5 py-0.5 text-[0.78rem] ${view === v ? "bg-panel text-fg" : "text-muted"}`}>{label}</button>
              ))}
            </span>
          </span>
        }
      >
        {view === "tree" ? (
          <div className="max-h-[78vh] overflow-auto rounded-2xl bg-sunk p-3 [scrollbar-width:thin]">
            <div className="inline-flex min-w-max"><TreeNode n={tree} ctx={ctx} /></div>
          </div>
        ) : (
          <div className="grid gap-[22px]">
            {sum.steps.map((list, i) => (
              <div key={i} className="grid gap-2">
                <div className="flex items-baseline gap-2.5 text-[0.86rem]"><b className="font-medium">{t.step} {i + 1}</b><span className="text-faint">{t.nBreeds(list.length)}</span></div>
                {list.map(n => (
                  <div key={n.id} className="flex items-center gap-2 overflow-x-auto pb-0.5">
                    <Node n={n.kids[0]} ctx={ctx} /><span className="flex-none text-faint">×</span>
                    <Node n={n.kids[1]} ctx={ctx} /><span className="flex-none text-faint">→</span>
                    <Node n={n} ctx={ctx} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-3.5 text-[0.76rem] text-muted">
          {STATS.map(s => <span key={s} className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-[3px]" style={{ background: STAT_COL[s] }} />{t.stats[s]}</span>)}
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-3.5 rounded-[3px] border-[1.5px] border-accent" />{t.spineLegend}</span>
        </div>
      </Section>

      <Section title={t.rulesTitle}>
        <ul className="grid max-w-[70ch] list-disc gap-1 pl-[18px] text-[0.86rem] text-muted">{t.rules.map(r => <li key={r}>{r}</li>)}</ul>
      </Section>
    </>
  );
}

function TreeNode({ n, ctx }) {
  if (!n.kids) return <div className="tree-br"><Node n={n} ctx={ctx} /></div>;
  return (
    <div className="tree-br">
      <div className="tree-kids">{n.kids.map(k => <TreeNode key={k.id} n={k} ctx={ctx} />)}</div>
      <Node n={n} ctx={ctx} root={n.id === 0} />
    </div>
  );
}

function Node({ n, ctx, root = false }) {
  const { info, nature, lang, t } = ctx;
  const who = n.spine ? nameOf(info.root, lang) : n.gender === "M" ? t.anyMale : t.anyFemale;
  return (
    <div
      className={`tree-node grid flex-none gap-[5px] rounded-[11px] border bg-panel px-[9px] py-[7px] text-[0.76rem] ${
        root ? "w-[176px] border-[1.5px] border-accent shadow-soft" : n.spine ? "w-[156px] border-accent/55" : "w-[156px] border-line"
      }`}
    >
      <div className="flex min-w-0 items-center gap-[5px]">
        {n.gender && <span className={`text-[0.86rem] font-semibold leading-none ${n.gender === "F" ? "text-[oklch(0.62_0.16_0)]" : "text-[oklch(0.6_0.13_250)]"}`}>{n.gender === "F" ? "♀" : "♂"}</span>}
        <span className={`min-w-0 flex-1 truncate ${n.spine ? "font-medium text-fg" : "text-muted"}`}>{who}</span>
        {n.ivs.length > 0 && <span className="font-mono text-[0.68rem] text-faint">{n.ivs.length}×31</span>}
      </div>
      <div className="flex flex-wrap gap-[3px]">
        {n.ivs.length || n.nat ? (
          <>
            {STATS.filter(s => n.ivs.includes(s)).map(s => <b key={s} className="iv-chip rounded-[5px] px-[5px] py-px text-[0.68rem] font-medium" style={{ "--s": STAT_COL[s] }}>{t.short[s]}</b>)}
            {n.nat && <b className="rounded-[5px] bg-accent-soft px-[5px] py-px text-[0.68rem] font-medium text-accent-ink">{natName(nature, lang)}</b>}
          </>
        ) : (
          <span className="text-[0.7rem] text-faint">{t.anyIv}</span>
        )}
      </div>
      {n.item && (
        <span className="truncate border-t border-dashed border-line pt-1 text-[0.68rem] text-muted">
          <span className="text-accent">◆ </span>{n.item === "ever" ? t.everstone : t.braces[n.item]}
        </span>
      )}
    </div>
  );
}
