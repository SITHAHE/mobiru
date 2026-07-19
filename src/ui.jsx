import { motion } from 'framer-motion'

// ------------------------------------------------------------------ Логотип
// Двухцветный векторный знак (синий пузырь + белый телефон) — читается
// и на светлом, и на тёмном фоне. Текст подстраивается через textClass.
export function Logo({ className = '', showText = true, textClass = 'text-ink', size = 38 }) {
  return (
    <a href="#top" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="MOBi.ru — на главную">
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0 drop-shadow-sm" role="img" aria-hidden="true">
        <path
          d="M22 7 h48 a22 22 0 0 1 22 22 v26 a22 22 0 0 1 -22 22 h-6 l3 15 -19 -15 h-26 a22 22 0 0 1 -22 -22 v-26 a22 22 0 0 1 22 -22 z"
          fill="#0a5fd4"
        />
        <g transform="rotate(-16 50 45)">
          <rect x="35" y="19" width="30" height="52" rx="7.5" fill="#fff" />
          <rect x="40" y="25" width="20" height="25" rx="3.5" fill="#0a5fd4" />
          <circle cx="44" cy="60" r="2" fill="#0a5fd4" />
          <circle cx="50" cy="60" r="2" fill="#0a5fd4" />
          <circle cx="56" cy="60" r="2" fill="#0a5fd4" />
          <rect x="62" y="12" width="4" height="12" rx="2" transform="rotate(20 64 18)" fill="#fff" />
        </g>
      </svg>
      {showText && (
        <span className={`text-[1.35rem] font-extrabold tracking-tight leading-none ${textClass}`}>
          MOBi<span className="text-brand-500">.ru</span>
        </span>
      )}
    </a>
  )
}

// ------------------------------------------------------------------ Звёзды
export function Stars({ n = 5, className = '' }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={`${n} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < n ? '#ffb020' : '#d7dee9'}>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01z" />
        </svg>
      ))}
    </span>
  )
}

// ---------------------------------------------------- Появление при скролле
export function Reveal({ children, delay = 0, y = 22, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ------------------------------------------------------------------ Иконки-мессенджеры
export function TgIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.94 4.6l-3.3 15.56c-.25 1.1-.9 1.37-1.83.85l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.14L17.4 6.6c.4-.36-.09-.56-.63-.2l-11.6 7.3-5-1.56C-.5 11.9-.5 11.06 1.5 10.3L19.83 3.2c.9-.33 1.7.2 1.4 1.4z" />
    </svg>
  )
}
export function WaIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.33 4.95L2 22l5.3-1.38a9.86 9.86 0 004.73 1.2c5.46 0 9.9-4.43 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.06 8.06 0 012.37 5.72c0 4.46-3.63 8.09-8.1 8.09-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.02 8.02 0 01-1.24-4.28c.01-4.46 3.64-8.09 8.1-8.09zm4.68 11.42c-.26-.13-1.5-.74-1.73-.83-.23-.08-.4-.13-.56.13-.17.26-.65.82-.8 1-.14.16-.29.18-.55.06-.26-.13-1.08-.4-2.05-1.27-.76-.68-1.27-1.51-1.42-1.77-.15-.26-.02-.4.11-.53.12-.12.26-.29.39-.44.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.56-1.36-.77-1.86-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.32-.22.26-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.49-.3z" />
    </svg>
  )
}

// ---------------------------------------------------------- helpers
export const ease = [0.22, 1, 0.36, 1]
