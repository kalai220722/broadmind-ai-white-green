"use client";

import { motion } from "framer-motion";

interface AnimatedRobotProps {
  size?: number;
  state?: "idle" | "talking" | "listening" | "thinking";
}

/**
 * Pure-SVG, framer-motion-driven AI mascot for BroadMind.
 * No external dependencies — renders crisp at any DPR and ships
 * with zero bundle bloat.
 *
 * States:
 *  - idle:      gentle bobbing, slow blink
 *  - talking:   mouth opens/closes, antenna pulses faster
 *  - listening: ear "rings" expand, mouth steady
 *  - thinking:  ellipsis above head
 */
export default function AnimatedRobot({ size = 200, state = "idle" }: AnimatedRobotProps) {
  const isTalking = state === "talking";
  const isListening = state === "listening";
  const isThinking = state === "thinking";

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* Glow halo */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30 blur-3xl"
        animate={{
          scale: isTalking ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isTalking ? [0.7, 1, 0.7] : [0.5, 0.7, 0.5],
        }}
        transition={{ duration: isTalking ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Listening rings */}
      {isListening && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
            />
          ))}
        </>
      )}

      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative z-10"
        animate={{
          y: isTalking ? [0, -2, 0] : [0, -6, 0],
        }}
        transition={{
          duration: isTalking ? 0.6 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Antenna */}
        <g>
          <line x1="100" y1="42" x2="100" y2="22" stroke="url(#bodyGrad)" strokeWidth="3" strokeLinecap="round" />
          <motion.circle
            cx="100"
            cy="18"
            r="5"
            fill="#f0abfc"
            animate={{
              r: isTalking ? [5, 7, 5] : [5, 6, 5],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: isTalking ? 0.6 : 1.5, repeat: Infinity }}
          />
          <motion.circle
            cx="100"
            cy="18"
            r="10"
            fill="#f0abfc"
            opacity="0.3"
            animate={{ r: [10, 14, 10], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </g>

        {/* Head (rounded square) */}
        <rect x="50" y="42" width="100" height="92" rx="22" ry="22" fill="url(#bodyGrad)" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />

        {/* Face plate */}
        <rect x="60" y="56" width="80" height="60" rx="14" ry="14" fill="url(#faceGrad)" />

        {/* Eyes */}
        {!isThinking ? (
          <g>
            <motion.circle
              cx="80"
              cy="85"
              r="6"
              fill="url(#eyeGlow)"
              animate={{
                scaleY: state === "idle" ? [1, 0.1, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "80px 85px" }}
            />
            <motion.circle
              cx="120"
              cy="85"
              r="6"
              fill="url(#eyeGlow)"
              animate={{
                scaleY: state === "idle" ? [1, 0.1, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "120px 85px" }}
            />
            {/* Eye sparkles */}
            <circle cx="82" cy="83" r="1.5" fill="#fff" />
            <circle cx="122" cy="83" r="1.5" fill="#fff" />
          </g>
        ) : (
          <g>
            <line x1="74" y1="85" x2="86" y2="85" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
            <line x1="114" y1="85" x2="126" y2="85" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Mouth */}
        <motion.rect
          x={isTalking ? 86 : 88}
          y={isTalking ? 100 : 104}
          width={isTalking ? 28 : 24}
          height={isTalking ? 8 : 3}
          rx={isTalking ? 4 : 1.5}
          fill="#67e8f9"
          animate={{
            scaleY: isTalking ? [0.5, 1.5, 0.7, 1.3, 0.8] : 1,
            scaleX: isTalking ? [0.9, 1, 0.95, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.4,
            repeat: isTalking ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "100px 105px" }}
        />

        {/* Cheek glow when talking */}
        {isTalking && (
          <>
            <motion.circle cx="68" cy="100" r="4" fill="#f0abfc" opacity="0.5" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.circle cx="132" cy="100" r="4" fill="#f0abfc" opacity="0.5" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
          </>
        )}

        {/* Body */}
        <rect x="60" y="140" width="80" height="40" rx="16" ry="16" fill="url(#bodyGrad)" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />

        {/* Chest "core" */}
        <motion.circle
          cx="100"
          cy="158"
          r="9"
          fill="url(#eyeGlow)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <circle cx="100" cy="158" r="4" fill="#fff" opacity="0.6" />

        {/* Arms */}
        <motion.rect
          x="42"
          y="148"
          width="14"
          height="24"
          rx="7"
          fill="url(#bodyGrad)"
          animate={{
            rotate: isTalking ? [-5, 5, -5] : 0,
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ transformOrigin: "49px 152px" }}
        />
        <motion.rect
          x="144"
          y="148"
          width="14"
          height="24"
          rx="7"
          fill="url(#bodyGrad)"
          animate={{
            rotate: isTalking ? [5, -5, 5] : 0,
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ transformOrigin: "151px 152px" }}
        />

        {/* Thinking dots */}
        {isThinking && (
          <g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={88 + i * 12}
                cy={32}
                r={3}
                fill="#f0abfc"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </g>
        )}
      </motion.svg>
    </div>
  );
}
