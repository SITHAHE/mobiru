import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CONTACTS, NAV, SERVICES, ADVANTAGES, STEPS, FAQ,
  REVIEW_STATS, REVIEW_HIGHLIGHTS, REAL_REVIEWS,
  BRANDS, REPAIRS, priceFor, minPriceFor, fmt, buildMessage,
} from './data.js'
import { Logo, Stars, Reveal, TgIcon, WaIcon, ease } from './ui.jsx'

const tgLink = (msg) => `${CONTACTS.telegram}?text=${encodeURIComponent(msg)}`
const waLink = (msg) => `${CONTACTS.whatsapp}?text=${encodeURIComponent(msg)}`

/* ============================================================== HEADER === */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-soft border-b border-brand-100/70' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
        <Logo textClass={scrolled ? 'text-ink' : 'text-white'} />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`rounded-full px-3.5 py-2 text-[15px] font-semibold transition ${
                scrolled ? 'text-ink-soft hover:bg-brand-50 hover:text-brand-700' : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={CONTACTS.phoneHref}
            className={`text-[15px] font-bold tabular-nums transition ${scrolled ? 'text-ink' : 'text-white'}`}
          >
            {CONTACTS.phone}
          </a>
          <a
            href="#calc"
            className="rounded-full bg-brand-600 px-5 py-2.5 text-[15px] font-bold text-white shadow-[0_8px_24px_-8px_rgba(10,95,212,.7)] transition hover:bg-brand-700 hover:-translate-y-0.5"
          >
            Рассчитать ремонт
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl md:hidden ${scrolled ? 'text-ink' : 'text-white'}`}
          aria-label="Меню"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden glass border-b border-brand-100 md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-ink hover:bg-brand-50">
                  {n.label}
                </a>
              ))}
              <a href={CONTACTS.phoneHref} className="rounded-xl px-4 py-3 text-base font-bold text-brand-700">
                {CONTACTS.phone}
              </a>
              <a href="#calc" onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-brand-600 px-4 py-3 text-center text-base font-bold text-white">
                Рассчитать ремонт
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ================================================================ HERO === */
const HERO_CHIPS = ['Бесплатная диагностика', 'Ремонт от 20 минут', 'Гарантия до 12 мес.']

function Hero() {
  // на iPhone в режиме энергосбережения автозапуск блокируется и iOS рисует
  // свою кнопку «play». Показываем поверх статичный кадр (= первый кадр видео):
  // если видео не заигралось — кадр остаётся и прячет нативную кнопку.
  const [playing, setPlaying] = useState(false)
  const media = import.meta.env.BASE_URL
  const videoPos = 'absolute inset-y-0 right-0 h-full w-full object-cover object-[66%_center] md:w-[68%] md:object-[54%_center]'
  return (
    <section id="top" className="h-hero relative flex items-end overflow-hidden bg-black md:items-center">
      {/* ---- видео: на мобиле фон, на ПК — крупный блок справа (айфон уходит вправо) ---- */}
      <video
        className={videoPos}
        src={`${media}media/hero.mp4`}
        poster={`${media}img/hero-poster.jpg`}
        autoPlay muted playsInline preload="auto"
        onPlaying={() => setPlaying(true)}
      />
      {/* статичный кадр-заглушка поверх видео (виден, пока видео не пошло) */}
      <img
        src={`${media}img/hero-poster.jpg`} alt="" aria-hidden="true"
        className={`${videoPos} z-[1] transition-opacity duration-500 ${playing ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* На ПК подложки нет — видео чистое, читаемость даёт мягкая тень текста.
          На мобиле видео идёт фоном, поэтому нужен лёгкий градиент снизу под текст. */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/45 to-transparent md:hidden" />

      {/* ---- текст поверх видео, слева (на ПК ближе к краю, шире и крупнее) ---- */}
      <div className="relative z-10 w-full px-6 pb-20 pt-28 sm:px-10 md:py-0 lg:pl-16 xl:pl-24">
        <div className="max-w-[34rem] md:max-w-3xl">
          <motion.a href={REVIEW_STATS.yandex.href} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.08] px-4 py-1.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            <Stars n={5} className="scale-90" />
            {CONTACTS.rating} · {CONTACTS.reviewsCount} отзывов на Яндексе
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05, ease }}
            className="text-[2.6rem] font-extrabold leading-[1.03] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-[4.75rem] lg:leading-[1.01]"
          >
Ремонт телефона<br className="hidden sm:block" /> <span className="text-gradient whitespace-nowrap">за 20 минут</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] sm:mt-8 sm:text-xl"
          >
            iPhone, Samsung, Xiaomi и ещё 20+ брендов. Бесплатная диагностика,
            честная цена и гарантия до года.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-10 flex flex-col gap-3.5 sm:mt-12 sm:flex-row sm:items-center sm:gap-3"
          >
            <a href="#calc"
              className="pulse-ring group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-brand-800 shadow-glow transition hover:-translate-y-0.5">
              Узнать цену ремонта
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a href={tgLink(buildMessage({}))} target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[.06] px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/15">
              <TgIcon /> Написать в Telegram
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="hidden flex-wrap gap-x-6 gap-y-3 sm:mt-14 sm:flex"
          >
            {HERO_CHIPS.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                <svg className="h-5 w-5 text-cyan-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-white/50 lg:block">
        <svg className="h-6 w-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}

/* ========================================================= TRUST STRIP === */
function TrustStrip() {
  const items = ['⚡ Ремонт от 20 минут', '🔍 Бесплатная диагностика', '🛡️ Гарантия до 12 месяцев', '⭐ 5,0 на Яндексе · 130 отзывов', '💯 Честные цены без навязывания', '🧩 Запчасти в наличии', '🚗 Выезд мастера на дом']
  const row = [...items, ...items]
  return (
    <div className="relative border-y border-brand-100 bg-brand-600 py-3.5">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="text-sm font-bold text-white/95">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================ SECTION UI = */
function SectionHead({ eyebrow, title, sub, center = true, light = false }) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} mb-12`}>
      {eyebrow && (
        <span className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider ${light ? 'bg-white/10 text-cyan-accent' : 'bg-brand-50 text-brand-700'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-[2.5rem] ${light ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {sub && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/70' : 'text-ink-soft'}`}>{sub}</p>}
    </div>
  )
}

/* ============================================================= SERVICES == */
function Services() {
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Что мы делаем"
          title="Вернём к жизни любимую технику"
          sub="Специализируемся на смартфонах, но выручим и с ноутбуком, и с аксессуарами. Всё в одном месте — рядом с домом."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className={`group h-full rounded-3xl border p-7 transition duration-300 hover:-translate-y-1.5 ${
                s.accent
                  ? 'border-brand-200 bg-gradient-to-b from-brand-50 to-white shadow-card'
                  : 'border-slate-200/80 bg-white shadow-soft hover:shadow-card'
              }`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-[0_10px_24px_-10px_rgba(10,95,212,.8)]">
                  {s.icon}
                </div>
                {s.accent && (
                  <span className="mt-4 inline-block rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Основное направление
                  </span>
                )}
                <h3 className="mt-4 text-xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
                <ul className="mt-5 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[15px] font-medium text-ink">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================================================== CALCULATOR == */
function Calculator() {
  const [brandId, setBrandId] = useState('apple')
  const [repairId, setRepairId] = useState('display')
  const brand = BRANDS.find((b) => b.id === brandId)
  const [modelName, setModelName] = useState(brand.models[0].name)

  useEffect(() => {
    setModelName(brand.models[0].name)
  }, [brandId]) // eslint-disable-line react-hooks/exhaustive-deps

  const model = brand.models.find((m) => m.name === modelName) || brand.models[0]
  const repair = REPAIRS.find((r) => r.id === repairId)
  const price = useMemo(() => priceFor(model, repairId), [model, repairId])

  const msg = buildMessage({ brand: brand.tag, model: model.name, repair: repair.label })

  return (
    <section id="calc" className="relative overflow-hidden bg-brand-950 py-20 sm:py-28">
      <div className="grid-dots absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-accent/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionHead
          light
          eyebrow="Калькулятор ремонта"
          title="Узнайте цену за 15 секунд"
          sub="Выберите бренд, модель и что случилось — покажем ориентировочную стоимость. Точную цену назовём после бесплатной диагностики."
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5 backdrop-blur sm:p-7">
            <div className="text-sm font-bold uppercase tracking-wide text-white/50">1 · Бренд</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <button key={b.id} onClick={() => setBrandId(b.id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    brandId === b.id ? 'bg-white text-brand-800 shadow-lg' : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}>
                  {b.tag}
                </button>
              ))}
            </div>

            <div className="mt-7 text-sm font-bold uppercase tracking-wide text-white/50">2 · Модель</div>
            <div className="relative mt-3">
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/15 bg-white/95 px-5 py-4 text-base font-bold text-ink outline-none transition focus:ring-2 focus:ring-cyan-accent"
              >
                {brand.models.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="mt-7 text-sm font-bold uppercase tracking-wide text-white/50">3 · Что случилось</div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {REPAIRS.map((r) => (
                <button key={r.id} onClick={() => setRepairId(r.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${
                    repairId === r.id
                      ? 'border-cyan-accent bg-white text-brand-800 shadow-lg'
                      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}>
                  <span className="text-2xl">{r.icon}</span>
                  <span className="text-xs font-bold leading-tight">{r.short}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
                <div className="text-sm font-semibold text-white/70">{brand.tag} · {model.name}</div>
                <div className="mt-1 flex items-center gap-2 text-lg font-extrabold">
                  <span>{repair.icon}</span> {repair.label}
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-ink-soft">Ориентировочная стоимость</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${model.name}-${repairId}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1 text-5xl font-extrabold tracking-tight text-ink"
                  >
                    от {fmt(price)}
                  </motion.div>
                </AnimatePresence>
                <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft">
                  <span className="mt-0.5">💡</span>
                  {repair.desc}. Точная цена — после бесплатной диагностики.
                </p>

                <a href={tgLink(msg)} target="_blank" rel="noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-4 text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(10,95,212,.8)] transition hover:bg-brand-700">
                  <TgIcon /> Оставить заявку на этот ремонт
                </a>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={CONTACTS.phoneHref}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-brand-200 bg-brand-50 px-3 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-100">
                    📞 Позвонить
                  </a>
                  <a href={waLink(msg)} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
                    <WaIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================================================= PRICE HIGHLIGHTS = */
function PriceHighlights() {
  // 6 самых частых работ (сетка ровно заполняется на 2 и 3 колонки).
  // честный нижний порог «от» по каждой работе (минимум среди всех моделей)
  const shown = ['display', 'glass', 'battery', 'port', 'camera', 'water']
  const cards = shown.map((id) => {
    const r = REPAIRS.find((x) => x.id === id)
    return { ...r, from: minPriceFor(id) }
  })
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Цены"
          title="Понятные цены на всё"
          sub="Ориентир по самым частым работам. Точную стоимость для вашей модели покажет калькулятор выше — за 15 секунд и без звонка."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.06}>
              <a href="#calc"
                className="group flex h-full items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card sm:p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl transition group-hover:bg-brand-600 group-hover:grayscale-0">
                  {c.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-extrabold text-ink">{c.short}</h3>
                  <p className="mt-1 text-[13.5px] leading-snug text-ink-soft">{c.desc}</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-slate-400">от</span>
                    <span className="text-2xl font-extrabold text-brand-700">{fmt(c.from)}</span>
                  </div>
                </div>
                <span className="mt-1 shrink-0 text-brand-300 transition group-hover:translate-x-1 group-hover:text-brand-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6 sm:flex-row sm:p-7">
            <p className="text-center text-[15px] font-medium text-ink-soft sm:text-left">
              Также меняем корпус и крышки, кнопки, динамики, микрофоны, восстанавливаем Face ID и делаем прошивку.
              <span className="font-bold text-ink"> Вашей модели нет в калькуляторе?</span> Напишите — подскажем цену за пару минут.
            </p>
            <a href={tgLink(buildMessage({}))} target="_blank" rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_26px_-10px_rgba(10,95,212,.8)] transition hover:bg-brand-700">
              <TgIcon /> Спросить цену
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ============================================================== WHY US === */
function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Почему нам доверяют"
          title="Чиним быстро, честно и с гарантией"
          sub="130 жителей района уже поставили нам 5,0 на Яндексе. Вот за что."
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative">
              <img src={`${import.meta.env.BASE_URL}img/bluemat.jpg`} alt="Разобранный смартфон на рабочем мате мастера"
                className="w-full rounded-3xl object-cover shadow-card" loading="lazy" />
              <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white p-4 shadow-2xl sm:-right-5 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-brand-700">5,0★</div>
                  <div className="text-xs font-semibold leading-tight text-ink-soft">130 отзывов<br />на Яндексе</div>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                  <div className="text-2xl">{a.icon}</div>
                  <h3 className="mt-2.5 text-base font-extrabold text-ink">{a.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============================================================== PROCESS = */
function Process() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Как это работает"
          title="Всё просто и прозрачно"
          sub="Никаких сюрпризов в чеке. Вы всегда знаете цену заранее и решаете сами."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="text-5xl font-extrabold text-brand-100">{s.n}</div>
                <h3 className="mt-2 text-lg font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
                {i < STEPS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-brand-300 lg:block">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =============================================================== REVIEWS = */
function Reviews() {
  const hasReal = REAL_REVIEWS.length > 0
  return (
    <section id="reviews" className="relative overflow-hidden bg-brand-950 py-20 sm:py-28">
      <div className="grid-dots absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-cyan-accent/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionHead
          light
          eyebrow="Отзывы"
          title="Нас любят за честность"
          sub="Рейтинг 5,0 — не с одной площадки. Оценки живые: их оставляют жители района, которые приносят технику снова."
        />

        {/* реальные агрегаты со ссылками */}
        <div className="mx-auto mb-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {[REVIEW_STATS.yandex, REVIEW_STATS.gis].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="group flex items-center gap-4 rounded-3xl border border-white/12 bg-white/[.05] p-5 backdrop-blur transition hover:bg-white/[.09]">
              <div className="text-5xl font-extrabold text-white">{s.rating}</div>
              <div className="flex-1">
                <Stars n={5} />
                <div className="mt-1 text-sm font-semibold text-white/75">{s.count} отзывов</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
              <span className="text-white/40 transition group-hover:translate-x-1 group-hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          ))}
        </div>

        {hasReal ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {REAL_REVIEWS.map((r, i) => (
              <Reveal key={i} delay={(i % 3) * 0.06}>
                <figure className="flex flex-col rounded-3xl border border-white/10 bg-white/[.05] p-6 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <Stars n={r.rating} />
                    {r.tag && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70">{r.tag}</span>}
                  </div>
                  <blockquote className="mt-3 text-[15px] leading-relaxed text-white/85">«{r.text}»</blockquote>
                  <figcaption className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-white/55">
                    <svg className="h-4 w-4 text-[#fc3f1d]" viewBox="0 0 24 24" fill="currentColor"><path d="M13.3 3h2.2v18h-2.2v-8.2l-3.4 8.2H7.6l3.5-8.4C9.4 12 8.3 10.5 8.3 8.3 8.3 5.2 10.3 3 13.3 3zm.2 1.9c-1.6 0-2.9 1.3-2.9 3.4 0 2 1.1 3.2 2.7 3.2h.2V4.9z"/></svg>
                    Отзыв на Яндекс.Картах
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <>
            <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-white/40">За что чаще всего благодарят</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REVIEW_HIGHLIGHTS.map((h, i) => (
                <Reveal key={h.title} delay={(i % 4) * 0.07}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[.05] p-6 backdrop-blur transition hover:bg-white/[.08]">
                    <div className="text-3xl">{h.icon}</div>
                    <h3 className="mt-3 text-lg font-extrabold text-white">{h.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">{h.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 text-center">
          <a href={REVIEW_STATS.yandex.href} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-800 shadow-glow transition hover:-translate-y-0.5">
            Читать все отзывы на Яндексе →
          </a>
        </div>
      </div>
    </section>
  )
}

/* ========================================================= BRANDS MARQUEE */
function BrandsMarquee() {
  const brands = ['Apple', 'iPhone', 'Samsung', 'Xiaomi', 'Redmi', 'POCO', 'Huawei', 'Honor', 'Google Pixel', 'OnePlus', 'Realme', 'OPPO', 'vivo', 'Sony', 'Nokia', 'ASUS', 'Tecno', 'Infinix']
  const row = [...brands, ...brands]
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <p className="mb-7 text-center text-sm font-bold uppercase tracking-wider text-ink-soft">
        Ремонтируем устройства всех популярных брендов
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-4">
          {row.map((b, i) => (
            <span key={i} className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-lg font-extrabold text-ink-soft">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================== FAQ == */
function FAQItem({ item, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5">
        <span className="text-base font-bold text-ink sm:text-lg">{item.q}</span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition ${open ? 'rotate-45' : ''}`}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
            <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft sm:px-6">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x max-w-3xl">
        <SectionHead eyebrow="Вопросы и ответы" title="Отвечаем на частые вопросы" />
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <FAQItem key={i} item={item} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================= LEAD FORM = */
function LeadForm() {
  const [form, setForm] = useState({ name: '', phone: '', model: '', problem: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // TODO(backend): подключить Web3Forms/Formspree, чтобы заявка падала на e-mail.
    // Сейчас — открываем Telegram с готовым текстом заявки.
    const msg = buildMessage({ model: form.model, repair: form.problem, name: form.name, phone: form.phone })
    window.open(tgLink(msg), '_blank')
    setSent(true)
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">Заявка почти готова!</h3>
            <p className="mt-2 text-ink-soft">Мы открыли Telegram — отправьте сообщение, и мастер ответит с точной ценой и сроком. Или просто позвоните нам.</p>
            <a href={CONTACTS.phoneHref} className="mt-5 inline-block rounded-full bg-brand-600 px-6 py-3 font-bold text-white">{CONTACTS.phone}</a>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div>
              <h3 className="text-2xl font-extrabold text-ink">Оставьте заявку</h3>
              <p className="mt-1.5 text-[15px] text-ink-soft">Ответим в течение 15 минут с точной ценой. Диагностика — бесплатно.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required value={form.name} onChange={set('name')} placeholder="Как вас зовут"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100" />
              <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="Телефон"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100" />
            </div>
            <input value={form.model} onChange={set('model')} placeholder="Модель телефона (например, iPhone 13)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100" />
            <textarea value={form.problem} onChange={set('problem')} rows={3} placeholder="Что случилось? (разбит экран, не заряжается…)"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-base font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100" />
            <button type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 text-base font-bold text-white shadow-[0_14px_34px_-12px_rgba(10,95,212,.9)] transition hover:bg-brand-700">
              Получить бесплатный расчёт →
            </button>
            <p className="text-center text-xs text-slate-400">Нажимая кнопку, вы соглашаетесь на обработку данных. Мы не передаём их третьим лицам.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================== CONTACTS = */
function Contacts() {
  const infoCards = [
    { icon: '📍', label: 'Адрес', value: CONTACTS.addressShort, sub: CONTACTS.metro },
    { icon: '🕐', label: 'Часы работы', value: CONTACTS.hours, sub: 'Без выходных' },
    { icon: '📞', label: 'Телефон', value: CONTACTS.phone, href: CONTACTS.phoneHref },
    { icon: '✈️', label: 'Telegram', value: CONTACTS.telegramHandle, href: CONTACTS.telegram },
  ]
  return (
    <section id="contacts" className="relative bg-slate-50 py-20 sm:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Контакты"
          title="Приезжайте или пишите — как удобно"
          sub="Мы рядом: пр. Маршала Блюхера, 11к1. Оставьте заявку — и мы подготовим запчасть к вашему приходу."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {infoCards.map((c) => {
                const Inner = (
                  <>
                    <div className="text-2xl">{c.icon}</div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-wide text-ink-soft">{c.label}</div>
                    <div className="mt-0.5 text-base font-extrabold text-ink">{c.value}</div>
                    {c.sub && <div className="text-[13px] text-ink-soft">{c.sub}</div>}
                  </>
                )
                return c.href ? (
                  <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                    {Inner}
                  </a>
                ) : (
                  <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">{Inner}</div>
                )
              })}
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-soft">
              <iframe title="Карта — MOBi.ru" src={CONTACTS.mapEmbed} className="h-[300px] w-full sm:h-[340px]" loading="lazy" />
            </div>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}

/* ================================================================ FOOTER = */
function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo textClass="text-white" />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
              Сервисный центр по ремонту телефонов, компьютеров и продаже аксессуаров в Санкт-Петербурге.
              Честно, быстро и с гарантией — с заботой о вашей технике.
            </p>
            <div className="mt-5 flex gap-3">
              <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" aria-label="Telegram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-600"><TgIcon /></a>
              <a href={CONTACTS.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-emerald-600"><WaIcon /></a>
              <a href={CONTACTS.vk} target="_blank" rel="noreferrer" aria-label="ВКонтакте"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-extrabold text-white transition hover:bg-brand-600">VK</a>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-white/50">Разделы</div>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} className="text-[15px] text-white/70 transition hover:text-white">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-white/50">Контакты</div>
            <ul className="mt-4 space-y-2.5 text-[15px] text-white/70">
              <li><a href={CONTACTS.phoneHref} className="font-bold text-white">{CONTACTS.phone}</a></li>
              <li>{CONTACTS.addressShort}</li>
              <li>{CONTACTS.hours}</li>
              <li className="flex items-center gap-1.5 pt-1"><Stars n={5} className="scale-90" /> {CONTACTS.rating} · {CONTACTS.reviewsCount} отзывов</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} MOBi.ru — ремонт телефонов в Санкт-Петербурге</span>
          <span>Цены на сайте ориентировочные и не являются публичной офертой</span>
        </div>
      </div>
    </footer>
  )
}

/* ========================================================= MOBILE CTA BAR */
function MobileBar() {
  // прячем панель на hero, показываем после прокрутки — чтобы первый экран дышал
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={`pad-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur transition-transform duration-300 ease-out md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'max(.5rem, env(safe-area-inset-bottom))' }}>
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <a href={CONTACTS.phoneHref} className="flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-bold text-brand-700">
          <span className="text-lg">📞</span> Позвонить
        </a>
        <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-bold text-brand-700">
          <TgIcon className="h-5 w-5" /> Telegram
        </a>
        <a href="#calc" className="flex items-center justify-center rounded-xl bg-brand-600 text-[13px] font-bold text-white">
          Рассчитать
        </a>
      </div>
    </div>
  )
}

/* ================================================================== APP == */
export default function App() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <main className="pb-16 md:pb-0">
        <Hero />
        <TrustStrip />
        <Calculator />
        <PriceHighlights />
        <Services />
        <WhyUs />
        <Process />
        <Reviews />
        <BrandsMarquee />
        <FaqSection />
        <Contacts />
      </main>
      <Footer />
      <MobileBar />
    </div>
  )
}
