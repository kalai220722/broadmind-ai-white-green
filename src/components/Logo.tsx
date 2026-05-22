"use client";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="brainLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="brainRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100" height="100" rx="20" fill="url(#bgGrad)" />

          <circle cx="50" cy="48" r="30" fill="none" stroke="#4338ca" strokeWidth="0.5" opacity="0.3" />
          <circle cx="50" cy="48" r="22" fill="none" stroke="#4338ca" strokeWidth="0.5" opacity="0.2" />

          {/* Left brain - cyan */}
          <g filter="url(#glow)">
            <path
              d="M50 32 C50 32, 42 30, 38 34 C34 38, 33 42, 34 46 C35 50, 33 54, 36 58 C39 62, 44 64, 50 64"
              fill="none" stroke="url(#brainLeft)" strokeWidth="2" strokeLinecap="round"
            />
            <circle cx="42" cy="36" r="1.5" fill="#22d3ee" />
            <circle cx="36" cy="42" r="1.5" fill="#22d3ee" />
            <circle cx="37" cy="50" r="1.5" fill="#22d3ee" />
            <circle cx="40" cy="58" r="1.5" fill="#22d3ee" />
            <line x1="42" y1="36" x2="38" y2="34" stroke="#22d3ee" strokeWidth="0.8" />
            <line x1="36" y1="42" x2="34" y2="46" stroke="#22d3ee" strokeWidth="0.8" />
            <line x1="37" y1="50" x2="36" y2="58" stroke="#22d3ee" strokeWidth="0.8" />
            <line x1="42" y1="36" x2="36" y2="42" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
            <line x1="36" y1="42" x2="37" y2="50" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
          </g>

          {/* Right brain - purple */}
          <g filter="url(#glow)">
            <path
              d="M50 32 C50 32, 58 30, 62 34 C66 38, 67 42, 66 46 C65 50, 67 54, 64 58 C61 62, 56 64, 50 64"
              fill="none" stroke="url(#brainRight)" strokeWidth="2" strokeLinecap="round"
            />
            <circle cx="58" cy="36" r="1.5" fill="#a78bfa" />
            <circle cx="64" cy="42" r="1.5" fill="#a78bfa" />
            <circle cx="63" cy="50" r="1.5" fill="#a78bfa" />
            <circle cx="60" cy="58" r="1.5" fill="#a78bfa" />
            <line x1="58" y1="36" x2="62" y2="34" stroke="#a78bfa" strokeWidth="0.8" />
            <line x1="64" y1="42" x2="66" y2="46" stroke="#a78bfa" strokeWidth="0.8" />
            <line x1="63" y1="50" x2="64" y2="58" stroke="#a78bfa" strokeWidth="0.8" />
            <line x1="58" y1="36" x2="64" y2="42" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" />
            <line x1="64" y1="42" x2="63" y2="50" stroke="#a78bfa" strokeWidth="0.5" opacity="0.5" />
          </g>

          {/* Center line */}
          <line x1="50" y1="32" x2="50" y2="64" stroke="#818cf8" strokeWidth="0.8" opacity="0.4" />

          {/* Science icons around the brain */}
          {/* Pi symbol - top left */}
          <text x="24" y="32" fill="#a5b4fc" fontSize="8" fontFamily="serif" fontWeight="bold" opacity="0.7">π</text>

          {/* Sigma - top right */}
          <text x="70" y="30" fill="#a5b4fc" fontSize="8" fontFamily="serif" fontWeight="bold" opacity="0.7">Σ</text>

          {/* DNA helix - right */}
          <g opacity="0.6" transform="translate(74, 52)">
            <path d="M0 0 Q3 3 0 6 Q-3 9 0 12" fill="none" stroke="#c4b5fd" strokeWidth="1" />
            <path d="M0 0 Q-3 3 0 6 Q3 9 0 12" fill="none" stroke="#67e8f9" strokeWidth="1" />
          </g>

          {/* Atom - bottom left */}
          <g opacity="0.6" transform="translate(22, 58)">
            <ellipse cx="4" cy="4" rx="5" ry="2" fill="none" stroke="#c4b5fd" strokeWidth="0.8" transform="rotate(-30 4 4)" />
            <ellipse cx="4" cy="4" rx="5" ry="2" fill="none" stroke="#c4b5fd" strokeWidth="0.8" transform="rotate(30 4 4)" />
            <circle cx="4" cy="4" r="1" fill="#a78bfa" />
          </g>

          {/* Flask - top right area */}
          <g opacity="0.6" transform="translate(72, 36)">
            <path d="M2 0 L2 4 L0 8 L6 8 L4 4 L4 0 Z" fill="none" stroke="#c4b5fd" strokeWidth="0.8" />
            <circle cx="3" cy="6" r="0.8" fill="#a78bfa" />
          </g>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            BroadMind
          </span>
          <span className="text-[10px] font-medium text-slate-400 tracking-[0.2em] uppercase -mt-1">
            AI Learning
          </span>
        </div>
      )}
    </div>
  );
}
