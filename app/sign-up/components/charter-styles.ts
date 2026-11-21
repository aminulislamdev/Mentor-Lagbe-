export const charterStyles = `
  .charter-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .charter-outline {
    -webkit-text-stroke: 1.5px #344C43;
    color: transparent;
  }
  .dark .charter-outline {
    -webkit-text-stroke: 1.5px #EFE7DC;
    color: transparent;
  }

  .charter-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes charter-rotate { to { transform: rotate(360deg); } }
  .charter-rotate { animation: charter-rotate 28s linear infinite; }

  @keyframes charter-stamp-pop {
    0%   { transform: rotate(-26deg) scale(1.7); }
    55%  { transform: rotate(-9deg)  scale(0.92); }
    100% { transform: rotate(-12deg) scale(1); }
  }
  .charter-stamp { animation: charter-stamp-pop 0.45s cubic-bezier(0.2, 1.4, 0.35, 1) both; }

  @keyframes charter-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .charter-rise { animation: charter-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes charter-seal-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(184, 121, 89, 0); }
    50%      { box-shadow: 0 0 44px 4px rgba(184, 121, 89, 0.35); }
  }
  .charter-seal-glow { animation: charter-seal-glow 4s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .charter-rotate, .charter-stamp, .charter-rise, .charter-seal-glow { animation: none !important; }
  }
`