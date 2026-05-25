import React from 'react';

interface LogoSVGProps {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export default function LogoSVG({ width = '100%', height = 'auto', style }: LogoSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 210"
      fill="none"
      width={width}
      height={height}
      style={style}
      aria-label="PoPLedger logo"
      role="img"
    >
      <defs>
        <linearGradient id="plg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* ── BOOK STRUCTURE ── */}

      {/* Left page */}
      <path
        d="M14,46 L108,36 L108,168 L14,160 Z"
        fill="rgba(34,211,238,0.07)"
        stroke="url(#plg)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Right page */}
      <path
        d="M132,36 L226,46 L226,160 L132,168 Z"
        fill="rgba(34,211,238,0.07)"
        stroke="url(#plg)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Top spine */}
      <path d="M108,36 Q120,27 132,36" stroke="url(#plg)" strokeWidth="3.5" />

      {/* Bottom binding */}
      <path d="M108,168 Q120,181 132,168" stroke="url(#plg)" strokeWidth="3.5" />

      {/* Left binding tab */}
      <path
        d="M43,46 L43,34 L80,34 L80,46"
        stroke="url(#plg)"
        strokeWidth="3.5"
        fill="rgba(34,211,238,0.1)"
        strokeLinejoin="round"
      />

      {/* Right binding tab */}
      <path
        d="M160,46 L160,34 L197,34 L197,46"
        stroke="url(#plg)"
        strokeWidth="3.5"
        fill="rgba(34,211,238,0.1)"
        strokeLinejoin="round"
      />

      {/* ── LEFT PAGE CONTENT ── */}

      {/* Row 1: checkmark */}
      <path d="M23,62 L27,66 L36,55" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Row 1: text bar */}
      <line x1="41" y1="61" x2="99" y2="61" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      {/* Row 1: strikethrough */}
      <line x1="41" y1="61" x2="99" y2="61" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />

      {/* Row 2: checkmark */}
      <path d="M23,76 L27,80 L36,69" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Row 2: text bar */}
      <line x1="41" y1="75" x2="85" y2="75" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      {/* Row 2: strikethrough */}
      <line x1="41" y1="75" x2="85" y2="75" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />

      {/* Row 3: checkmark */}
      <path d="M23,90 L27,94 L36,83" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Row 3: text bar (no strikethrough — in progress) */}
      <line x1="41" y1="89" x2="78" y2="89" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.4" />

      {/* ── GAME CONTROLLER ── */}

      {/* Body silhouette */}
      <path
        d="M29,124 C27,114 33,105 47,105 L75,105 C89,105 95,114 93,124 L93,142 C93,150 87,155 79,155 L77,153 C73,160 68,162 61,162 C54,162 49,160 45,153 L43,155 C35,155 29,150 29,142 Z"
        fill="#22d3ee"
      />

      {/* D-pad horizontal */}
      <rect x="35" y="130" width="18" height="6" rx="2" fill="#020617" />
      {/* D-pad vertical */}
      <rect x="41" y="124" width="6" height="18" rx="2" fill="#020617" />

      {/* Action buttons (cross layout) */}
      <circle cx="77" cy="118" r="3.5" fill="#020617" />
      <circle cx="83" cy="124" r="3.5" fill="#020617" />
      <circle cx="77" cy="130" r="3.5" fill="#020617" />
      <circle cx="71" cy="124" r="3.5" fill="#020617" />

      {/* Center select bar */}
      <rect x="56" y="128" width="10" height="5" rx="2.5" fill="#020617" opacity="0.8" />

      {/* ── RIGHT PAGE CONTENT ── */}

      {/* Top checklist row */}
      <path d="M140,57 L144,61 L153,51" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="158" y1="56" x2="218" y2="56" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.55" />

      {/* ── FILM STRIP ── */}

      {/* Background */}
      <rect x="140" y="72" width="78" height="76" rx="3" fill="#22d3ee" />

      {/* Top perforations */}
      <rect x="143" y="74" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />
      <rect x="163" y="74" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />
      <rect x="183" y="74" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />
      <rect x="203" y="74" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />

      {/* Bottom perforations */}
      <rect x="143" y="136" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />
      <rect x="163" y="136" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />
      <rect x="183" y="136" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />
      <rect x="203" y="136" width="10" height="10" rx="2" fill="rgba(2,6,23,0.85)" />

      {/* Screen area */}
      <rect x="140" y="86" width="78" height="48" fill="rgba(2,6,23,0.78)" />

      {/* Play triangle */}
      <path d="M165,100 L165,122 L187,111 Z" fill="#22d3ee" />

      {/* Bottom checklist row */}
      <path d="M140,157 L144,161 L153,151" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="158" y1="156" x2="218" y2="156" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
