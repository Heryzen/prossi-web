// Minimal monochrome social icons (currentColor) — used in Header top bar and Footer.
export function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.13v13.44c0 1.62-1.32 2.94-2.94 2.94a2.94 2.94 0 0 1 0-5.88c.28 0 .55.04.8.11V9.76a6.1 6.1 0 0 0-.8-.05A6.07 6.07 0 0 0 3.06 15.8a6.07 6.07 0 0 0 6.07 6.07c3.35 0 6.07-2.72 6.07-6.07V8.77a8.27 8.27 0 0 0 4.87 1.57V7.2a4.87 4.87 0 0 1-3.47-1.38Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9.5h2.5V6.2h-2.5c-2.3 0-4 1.7-4 4v2.1H8v3.3h2v6.4h3.3v-6.4h2.5l.5-3.3h-3V10.2c0-.5.3-.7.7-.7Z" />
    </svg>
  );
}

export function ThreadsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path d="M12 2.5c-4.5 0-7 2.7-7 6.9v5.2c0 4.2 2.5 6.9 7 6.9s7-2.7 7-6.9" strokeLinecap="round" />
      <path d="M9.5 12c0-1.8 1.2-2.9 3-2.9 2 0 3 1.2 3 3.3 0 2.6-1.8 4.1-4.3 4.1-2.2 0-3.6-1.2-3.6-2.9" strokeLinecap="round" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
    </svg>
  );
}
