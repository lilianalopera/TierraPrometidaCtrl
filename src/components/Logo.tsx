import React, { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tp_custom_logo_data');
    if (saved) {
      setCustomLogoUrl(saved);
    }
  }, []);

  const sizeClasses = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32',
    hero: 'h-36 sm:h-48 md:h-56',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt="Tierra Prometida Logo"
          className={`${sizeClasses[size]} w-auto object-contain drop-shadow-md`}
        />
      ) : (
        /* EXACT High-Fidelity Vector Recreation of logo TP.jpeg */
        <div className={`relative ${sizeClasses[size]} flex items-center`}>
          <svg
            viewBox="0 0 760 420"
            className="h-full w-auto max-w-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer White Contour Glow / Border */}
            <path
              d="M 170 80 
                 C 200 45, 270 50, 310 85 
                 C 340 50, 420 50, 460 85 
                 C 485 50, 560 40, 595 75 
                 C 630 110, 615 170, 625 210 
                 C 670 215, 730 240, 720 310 
                 C 710 380, 620 395, 540 375 
                 C 490 410, 390 405, 340 365 
                 C 270 385, 170 370, 140 330 
                 C 110 375, 50 375, 40 310 
                 C 30 250, 65 210, 75 160 
                 C 85 110, 130 90, 170 80 Z"
              fill="#ffffff"
            />

            {/* Main Deep Vibrant Purple Background Silhouette */}
            <path
              d="M 175 88 
                 C 205 55, 265 60, 305 92 
                 C 335 60, 415 60, 452 92 
                 C 478 60, 550 50, 582 82 
                 C 615 115, 602 170, 612 212 
                 C 655 218, 708 242, 698 305 
                 C 688 368, 608 382, 532 365 
                 C 482 398, 392 392, 345 355 
                 C 278 372, 182 360, 152 322 
                 C 122 362, 68 362, 58 305 
                 C 48 248, 80 212, 88 165 
                 C 98 118, 138 98, 175 88 Z"
              fill="#521d8b"
              stroke="#3c106b"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* ==================== LEAF TOP-RIGHT (Over 'a') ==================== */}
            <g transform="translate(500, 40)">
              {/* Leaf body */}
              <path
                d="M 15 55 C -5 20, 45 -5, 82 12 C 92 45, 55 75, 15 55 Z"
                fill="#65c728"
                stroke="#33780a"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Leaf inner vein */}
              <path
                d="M 18 52 Q 45 30 75 18"
                stroke="#33780a"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 40 36 Q 48 26 55 28"
                stroke="#33780a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 52 28 Q 60 18 68 20"
                stroke="#33780a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* ==================== LEAF BOTTOM-LEFT (Under Sword) ==================== */}
            <g transform="translate(68, 305)">
              <path
                d="M 15 45 C -5 18, 40 -5, 78 10 C 88 40, 52 68, 15 45 Z"
                fill="#65c728"
                stroke="#33780a"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M 18 42 Q 42 24 72 15"
                stroke="#33780a"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            {/* ==================== SWORD ON LEFT (Part of 'P') ==================== */}
            <g transform="translate(62, 108)">
              {/* Curved scimitar back blade (White) */}
              <path
                d="M 45 155 L 45 35 C 45 8, 95 8, 115 35 C 92 48, 70 88, 70 155 Z"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="7"
                strokeLinejoin="round"
              />

              {/* Main Golden Sword Blade */}
              <path
                d="M 32 155 L 32 20 C 36 10, 48 10, 52 20 L 52 155 Z"
                fill="#fec800"
                stroke="#c98a00"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Center blade highlight */}
              <line
                x1="42"
                y1="22"
                x2="42"
                y2="155"
                stroke="#ffffff"
                strokeWidth="3"
                opacity="0.8"
              />

              {/* Crossguard */}
              <path
                d="M 18 155 C 18 150, 66 150, 66 155 L 66 172 C 66 176, 18 176, 18 172 Z"
                fill="#e5a100"
                stroke="#a66e00"
                strokeWidth="4"
              />
              {/* Handle */}
              <rect
                x="34"
                y="172"
                width="16"
                height="34"
                rx="3"
                fill="#fec800"
                stroke="#a66e00"
                strokeWidth="4"
              />
              {/* Pommel (bottom circle) */}
              <circle
                cx="42"
                cy="214"
                r="11"
                fill="#e5a100"
                stroke="#a66e00"
                strokeWidth="4"
              />
            </g>

            {/* ==================== WORD: TIERRA (Yellow 3D) ==================== */}
            {/* Letter 'T' */}
            <g transform="translate(145, 55)">
              {/* T Background Shadow */}
              <path
                d="M 0 32 L 88 32 L 88 64 L 62 64 L 62 165 L 26 165 L 26 64 L 0 64 Z"
                fill="#2e0854"
                transform="translate(5, 6)"
              />
              {/* T Main Body */}
              <path
                d="M 0 32 L 88 32 L 88 64 L 62 64 L 62 165 L 26 165 L 26 64 L 0 64 Z"
                fill="#fec800"
                stroke="#521d8b"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              {/* Top Bar T highlight */}
              <path
                d="M 6 40 L 82 40 L 82 48 L 6 48 Z"
                fill="#fff385"
              />
            </g>

            {/* Letter 'i' with Boy Face */}
            <g transform="translate(242, 60)">
              {/* Stem of 'i' */}
              <rect
                x="14"
                y="74"
                width="34"
                height="86"
                rx="6"
                fill="#2e0854"
                transform="translate(4, 5)"
              />
              <rect
                x="14"
                y="74"
                width="34"
                height="86"
                rx="6"
                fill="#fec800"
                stroke="#521d8b"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              <rect x="18" y="80" width="8" height="74" rx="2" fill="#fff385" />

              {/* Dot of 'i' = Cute Cartoon Boy with Cap */}
              <g transform="translate(5, 5)">
                {/* Cap Visor (Black) pointing left */}
                <ellipse cx="14" cy="28" rx="14" ry="7" fill="#18181b" transform="rotate(-15 14 28)" />
                {/* Cap dome */}
                <path
                  d="M 12 30 C 12 12, 44 12, 48 30 Z"
                  fill="#18181b"
                  stroke="#09090b"
                  strokeWidth="2.5"
                />
                {/* Boy round face */}
                <circle
                  cx="31"
                  cy="32"
                  r="21"
                  fill="#ffffff"
                  stroke="#18181b"
                  strokeWidth="3.5"
                />
                {/* Hair line */}
                <path d="M 18 24 Q 28 26 38 21" stroke="#18181b" strokeWidth="3" fill="none" />
                {/* Smiling Eyes */}
                <ellipse cx="25" cy="30" rx="3" ry="4" fill="#18181b" />
                <ellipse cx="37" cy="30" rx="3" ry="4" fill="#18181b" />
                {/* Eye reflections */}
                <circle cx="26" cy="29" r="1.2" fill="#ffffff" />
                <circle cx="38" cy="29" r="1.2" fill="#ffffff" />
                {/* Wide happy smile with tongue */}
                <path
                  d="M 22 36 Q 31 46 40 36 Z"
                  fill="#18181b"
                  stroke="#18181b"
                  strokeWidth="1.5"
                />
                <path
                  d="M 26 40 Q 31 45 36 40 Z"
                  fill="#ef4444"
                />
              </g>
            </g>

            {/* Letter 'e' */}
            <g transform="translate(305, 115)">
              <text
                x="0"
                y="95"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="115"
                fontWeight="900"
                fill="#fec800"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                e
              </text>
            </g>

            {/* Letter 'r' */}
            <g transform="translate(382, 115)">
              <text
                x="0"
                y="95"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="115"
                fontWeight="900"
                fill="#fec800"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                r
              </text>
            </g>

            {/* Letter 'r' (second) */}
            <g transform="translate(444, 115)">
              <text
                x="0"
                y="95"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="115"
                fontWeight="900"
                fill="#fec800"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                r
              </text>
            </g>

            {/* Letter 'a' */}
            <g transform="translate(506, 115)">
              <text
                x="0"
                y="95"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="115"
                fontWeight="900"
                fill="#fec800"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                a
              </text>
            </g>

            {/* ==================== WORD: PROMETIDA (White & Azure) ==================== */}
            {/* 'P' Loop (attached to the Sword) */}
            <path
              d="M 98 220 C 135 220, 160 235, 160 268 C 160 300, 135 315, 98 315 Z"
              fill="#ffffff"
              stroke="#521d8b"
              strokeWidth="12"
              strokeLinejoin="round"
            />
            <path
              d="M 104 242 C 122 242, 136 250, 136 268 C 136 285, 122 292, 104 292 Z"
              fill="#521d8b"
            />

            {/* 'r' of Prometida */}
            <g transform="translate(155, 205)">
              <text
                x="0"
                y="100"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="118"
                fontWeight="900"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                r
              </text>
            </g>

            {/* 'o' of Prometida = MAGNIFYING GLASS */}
            <g transform="translate(210, 205)">
              {/* Outer Blue Frame */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="#ffffff"
                stroke="#00a8e8"
                strokeWidth="14"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#521d8b"
                strokeWidth="5"
                fill="none"
              />
              {/* Cyan reflection arc inside lens */}
              <path
                d="M 26 38 C 30 24, 52 20, 68 26"
                stroke="#00e5ff"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* Blue Handle pointing diagonally down-left */}
              <line
                x1="22"
                y1="78"
                x2="-6"
                y2="116"
                stroke="#00a8e8"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <line
                x1="22"
                y1="78"
                x2="-6"
                y2="116"
                stroke="#521d8b"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* 'm' */}
            <g transform="translate(305, 205)">
              <text
                x="0"
                y="100"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="118"
                fontWeight="900"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                m
              </text>
            </g>

            {/* 'e' */}
            <g transform="translate(400, 205)">
              <text
                x="0"
                y="100"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="118"
                fontWeight="900"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                e
              </text>
            </g>

            {/* 't' */}
            <g transform="translate(470, 205)">
              <text
                x="0"
                y="100"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="118"
                fontWeight="900"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                t
              </text>
            </g>

            {/* 'i' with Cute Girl Face with Pigtails */}
            <g transform="translate(515, 205)">
              {/* Stem of 'i' */}
              <rect
                x="14"
                y="28"
                width="30"
                height="74"
                rx="6"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="12"
                strokeLinejoin="round"
              />
              <rect
                x="14"
                y="28"
                width="30"
                height="74"
                rx="6"
                fill="#ffffff"
              />

              {/* Girl Face (Dot of 'i') */}
              <g transform="translate(-2, -32)">
                {/* Pigtail on right side with pink bow */}
                <path
                  d="M 40 26 C 55 12, 64 24, 60 42 C 54 48, 48 38, 40 32 Z"
                  fill="#18181b"
                />
                {/* Pink bow */}
                <ellipse cx="44" cy="27" rx="5" ry="3.5" fill="#ec4899" transform="rotate(-20 44 27)" />

                {/* Girl round head */}
                <circle
                  cx="30"
                  cy="32"
                  r="21"
                  fill="#ffffff"
                  stroke="#18181b"
                  strokeWidth="3.5"
                />

                {/* Black hair with fringe bangs */}
                <path
                  d="M 12 28 C 14 16, 44 14, 48 26 C 42 22, 38 24, 30 20 C 24 24, 18 23, 12 28 Z"
                  fill="#18181b"
                />

                {/* Eyes */}
                <ellipse cx="24" cy="32" rx="2.8" ry="3.8" fill="#18181b" />
                <ellipse cx="36" cy="32" rx="2.8" ry="3.8" fill="#18181b" />
                <circle cx="25" cy="31" r="1.1" fill="#ffffff" />
                <circle cx="37" cy="31" r="1.1" fill="#ffffff" />

                {/* Smile */}
                <path
                  d="M 24 38 Q 30 46 36 38"
                  stroke="#18181b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </g>

            {/* 'd' */}
            <g transform="translate(565, 205)">
              <text
                x="0"
                y="100"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="118"
                fontWeight="900"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                d
              </text>
            </g>

            {/* 'a' */}
            <g transform="translate(632, 205)">
              <text
                x="0"
                y="100"
                fontFamily="Impact, Arial Black, sans-serif"
                fontSize="118"
                fontWeight="900"
                fill="#ffffff"
                stroke="#521d8b"
                strokeWidth="14"
                paintOrder="stroke fill"
              >
                a
              </text>
            </g>

            {/* ==================== OPEN CYAN BIBLE (Under 'metida') ==================== */}
            <g transform="translate(380, 280)">
              {/* Outer Blue Cover Shadow */}
              <path
                d="M 15 50 Q 80 18 140 40 L 140 55 Q 80 34 15 65 Z"
                fill="#0284c7"
              />
              <path
                d="M 140 40 Q 200 18 265 50 L 265 65 Q 200 34 140 55 Z"
                fill="#0284c7"
              />

              {/* Main Cyan Book Pages */}
              <path
                d="M 18 46 Q 80 14 138 38 L 138 50 Q 80 26 18 58 Z"
                fill="#00b4d8"
                stroke="#521d8b"
                strokeWidth="3.5"
              />
              <path
                d="M 142 38 Q 200 14 262 46 L 262 58 Q 200 26 142 50 Z"
                fill="#00b4d8"
                stroke="#521d8b"
                strokeWidth="3.5"
              />

              {/* Top White Book Pages (Open Spread) */}
              <path
                d="M 22 42 Q 80 12 138 34 L 138 42 Q 80 20 22 50 Z"
                fill="#ffffff"
                stroke="#00a8e8"
                strokeWidth="2"
              />
              <path
                d="M 142 34 Q 200 12 258 42 L 258 50 Q 200 20 142 42 Z"
                fill="#ffffff"
                stroke="#00a8e8"
                strokeWidth="2"
              />

              {/* Page lines */}
              <line x1="40" y1="36" x2="120" y2="30" stroke="#00b4d8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="40" y1="42" x2="115" y2="36" stroke="#00b4d8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="160" y1="30" x2="240" y2="36" stroke="#00b4d8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="165" y1="36" x2="240" y2="42" stroke="#00b4d8" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      )}

      {showSubtitle && (
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-800 leading-tight">
            Comunidad Cristiana de Fe y Fuego
          </span>
          <span className="text-[9px] text-slate-500 font-medium">
            Barranquilla · Ministerio Infantil
          </span>
        </div>
      )}
    </div>
  );
};
