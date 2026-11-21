export const studyStyles = `
  .study-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .study-outline {
    -webkit-text-stroke: 1.4px #EFE7DC;
    color: transparent;
  }

  .study-root ::selection { background: #C98B6D; color: #1A2823; }

  @keyframes study-lamp-breathe {
    0%, 100% { opacity: 0.55; }
    50%      { opacity: 0.9; }
  }
  .study-lamp { animation: study-lamp-breathe 6.5s ease-in-out infinite; }

  @keyframes study-mote-rise {
    0%   { opacity: 0; transform: translate3d(0, 0, 0); }
    15%  { opacity: 0.75; }
    70%  { opacity: 0.4; }
    100% { opacity: 0; transform: translate3d(1.5rem, -9rem, 0); }
  }
  .study-mote { animation: study-mote-rise linear infinite; }

  @keyframes study-bookmark-sway {
    from { transform: rotate(0.8deg); }
    to   { transform: rotate(-0.8deg); }
  }
  .study-bookmark {
    transform-origin: top center;
    animation: study-bookmark-sway 7s ease-in-out infinite alternate;
  }

  @keyframes study-glow-pulse {
    0%, 100% { box-shadow: 0 0 26px 2px rgba(184, 121, 89, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4); }
    50%      { box-shadow: 0 0 40px 6px rgba(184, 121, 89, 0.5), 0 6px 18px rgba(0, 0, 0, 0.4); }
  }
  .study-cta-glow { animation: study-glow-pulse 4.5s ease-in-out infinite; }

  @keyframes study-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .study-rise { animation: study-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @media (prefers-reduced-motion: reduce) {
    .study-lamp, .study-mote, .study-bookmark, .study-cta-glow, .study-rise { animation: none !important; }
  }
`

export const wellInput =
  "h-12 rounded-md border border-[#D9CBB5]/12 bg-[#1E2E29]/80 pl-11 pr-11 text-[15px] text-[#EFE7DC] placeholder:text-[#EFE7DC]/30 shadow-[inset_0_2px_7px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-[#D9CBB5]/20 focus:border-[#C98B6D]/60 focus:bg-[#22332C] focus:shadow-[inset_0_2px_7px_rgba(0,0,0,0.45),0_0_24px_rgba(184,121,89,0.16)] focus:ring-2 focus:ring-[#C98B6D]/15 dark:border-[#D9CBB5]/12 dark:bg-[#1E2E29]/80 dark:text-[#EFE7DC]"