import React, { useState, useEffect, useMemo } from 'react';

interface AnimationProps {
  themeId: string;
}

const PixelArtSVG: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 64 64" 
        shapeRendering="crispEdges"
        className="w-32 h-32"
    >
        {children}
    </svg>
);

const TeaAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Table */}
        <rect x="0" y="60" width="64" height="4" fill="var(--bg-tertiary)" />
        <rect x="0" y="58" width="64" height="2" fill="var(--text-secondary)" opacity="0.2" />
        {/* Character */}
        <g style={{ animation: 'calm-breathe 8s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '28px 42px' }}>
            <rect x="16" y="40" width="24" height="18" fill="var(--text-primary)" />
            <rect x="16" y="38" width="24" height="2" fill="var(--text-primary)" opacity="0.5" /> {/* Shoulder shading */}
            <rect x="20" y="24" width="16" height="16" fill="var(--text-secondary)" />
            <rect x="23" y="30" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 7s infinite ease-in-out' }}/>
            <rect x="30" y="30" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 7s infinite ease-in-out -0.4s' }}/>
        </g>
        {/* Tea cup */}
        <g style={{ animation: 'tea-sip 9s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '42px 48px' }}>
            <rect x="40" y="46" width="12" height="10" fill="var(--bg-secondary)" />
            <rect x="52" y="48" width="3" height="6" fill="var(--bg-secondary)" />
            <rect x="41" y="46" width="10" height="2" fill="var(--bg-secondary)" opacity="0.4" /> {/* Tea surface */}
        </g>
        {/* Steam */}
        <rect x="44" y="38" width="2" height="2" fill="var(--border-color)" style={{ animation: 'steam-rise 5s linear infinite' }} />
        <rect x="47" y="40" width="2" height="2" fill="var(--border-color)" style={{ animation: 'steam-rise 5.5s linear infinite -2.5s' }} />
        <rect x="42" y="41" width="2" height="2" fill="var(--border-color)" style={{ animation: 'steam-rise 4.8s linear infinite -0.8s' }} />
    </PixelArtSVG>
);

const ReadingAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Lamp light cone */}
        <path d="M 0 64 L 32 0 L 64 64 Z" fill="var(--accent-color)" opacity="0.08" />
        <path d="M 8 64 L 32 10 L 56 64 Z" fill="var(--accent-color)" opacity="0.08" />
        {/* Dust motes */}
        <rect x="24" y="40" width="1" height="1" fill="var(--accent-color)" opacity="0.6" style={{ animation: 'dust-motes 15s linear infinite' }} />
        <rect x="38" y="45" width="2" height="2" fill="var(--accent-color)" opacity="0.6" style={{ animation: 'dust-motes 12s linear infinite -7s' }} />
        <rect x="30" y="28" width="1" height="1" fill="var(--accent-color)" opacity="0.6" style={{ animation: 'dust-motes 18s linear infinite -11s' }} />
        {/* Chair */}
        <rect x="8" y="48" width="8" height="16" fill="var(--text-secondary)" opacity="0.8" />
        <rect x="8" y="60" width="36" height="4" fill="var(--text-secondary)" opacity="0.8" />
        {/* Character */}
        <g style={{ animation: 'reading-head-nod 12s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '26px 38px' }}>
            <rect x="14" y="42" width="24" height="18" fill="var(--text-primary)" />
            <rect x="18" y="26" width="16" height="16" fill="var(--text-secondary)" />
            <rect x="21" y="32" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 8s infinite ease-in-out' }}/>
            <rect x="28" y="32" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 8s infinite ease-in-out -0.3s' }}/>
        </g>
        {/* Book */}
        <g transform="skewX(-10) translate(4, 6)">
            <rect x="38" y="46" width="18" height="15" fill="var(--bg-secondary)" />
            <rect x="54" y="46" width="2" height="15" fill="var(--border-color)" style={{ animation: 'reading-page-turn 10s cubic-bezier(0.45, 0, 0.55, 1) infinite' }}/>
            <rect x="40" y="49" width="12" height="1" fill="var(--text-secondary)" opacity="0.3" />
            <rect x="40" y="52" width="11" height="1" fill="var(--text-secondary)" opacity="0.3" />
        </g>
    </PixelArtSVG>
);

const MeditateAnimation: React.FC = () => (
    <PixelArtSVG>
        <g style={{ animation: 'meditate-float 10s cubic-bezier(0.45, 0, 0.55, 1) infinite' }}>
            {/* Aura */}
            <ellipse cx="32" cy="46" rx="26" ry="12" fill="var(--accent-color)" style={{ animation: 'meditate-aura-pulse 6s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: 'center' }} />
            <ellipse cx="32" cy="46" rx="20" ry="9" fill="var(--accent-color)" style={{ animation: 'meditate-aura-pulse 6s cubic-bezier(0.45, 0, 0.55, 1) infinite -1s', transformOrigin: 'center' }} opacity="0.5" />
            {/* Character */}
            <g style={{ animation: 'calm-breathe 8s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: 'center 48px' }}>
              <rect x="22" y="40" width="20" height="16" fill="var(--text-primary)" />
              <rect x="24" y="24" width="16" height="16" fill="var(--text-secondary)" />
            </g>
            {/* Eyes closed */}
            <rect x="27" y="31" width="4" height="2" fill="var(--bg-secondary)" />
            <rect x="34" y="31" width="4" height="2" fill="var(--bg-secondary)" />
        </g>
    </PixelArtSVG>
);

const SleepingCatAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Rug */}
        <rect x="4" y="60" width="56" height="4" rx="2" fill="var(--bg-tertiary)" />
        <rect x="4" y="58" width="56" height="2" fill="var(--text-secondary)" opacity="0.2"/>
        {/* Cat Body */}
        <g style={{ animation: 'calm-breathe 7s cubic-bezier(0.45, 0, 0.55, 1) infinite -1s', transformOrigin: '34px 50px' }}>
            <path d="M 16 60 Q 34 30 52 60 Z" fill="var(--text-secondary)" />
            <path d="M 16 60 Q 34 32 52 60 Z" fill="var(--text-primary)" opacity="0.3" />
        </g>
        {/* Cat Head */}
        <rect x="44" y="32" width="16" height="16" rx="4" fill="var(--text-secondary)" />
        <rect x="45" y="33" width="14" height="14" rx="3" fill="var(--text-primary)" opacity="0.3" />
        {/* Ears */}
        <path d="M 46 32 L 50 28 L 50 32 Z" fill="var(--text-primary)" opacity="0.6" />
        <path d="M 54 32 L 58 28 L 56 32 Z" fill="var(--text-primary)" opacity="0.6" />
        {/* Tail */}
        <g style={{ animation: 'cat-tail-sway 8s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '16px 48px' }}>
            <path d="M 16 48 C 6 52, 10 60, 10 60" fill="none" stroke="var(--text-secondary)" strokeWidth="5" />
        </g>
    </PixelArtSVG>
);

const TvAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* TV Flicker Light */}
        <rect x="0" y="0" width="64" height="64" fill="var(--accent-color)" style={{ animation: 'tv-flicker-light 5s linear infinite' }} />
        {/* Couch */}
        <rect x="8" y="58" width="48" height="6" fill="var(--text-secondary)" />
        <rect x="8" y="42" width="10" height="16" fill="var(--text-secondary)" />
        <rect x="10" y="42" width="6" height="16" fill="var(--text-primary)" opacity="0.2" />
        {/* Character */}
        <g style={{ animation: 'head-bob 9s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '32px 34px' }}>
            <rect x="22" y="42" width="20" height="16" fill="var(--text-primary)" />
            <rect x="24" y="26" width="16" height="16" fill="var(--text-secondary)" />
        </g>
        {/* TV screen reflection */}
        <rect x="28" y="30" width="8" height="5" style={{ animation: 'tv-screen-flicker 1.2s linear infinite' }} />
    </PixelArtSVG>
);

const WateringPlantAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Floor */}
        <rect x="0" y="62" width="64" height="2" fill="var(--bg-tertiary)" />
        {/* Character arm */}
        <rect x="38" y="46" width="14" height="4" fill="var(--text-primary)" />
        <rect x="38" y="44" width="14" height="2" fill="var(--text-primary)" opacity="0.5" />
        {/* Watering Can */}
        <rect x="22" y="46" width="16" height="12" fill="var(--link-color)" />
        <rect x="10" y="49" width="12" height="3" fill="var(--link-color)" />
        <rect x="23" y="46" width="14" height="2" fill="var(--link-color)" opacity="0.4" />
        {/* Water */}
        <g>
            <rect x="12" y="54" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'water-drip 1.8s linear infinite' }} />
            <rect x="12" y="54" width="2" height="2" fill="#fff" style={{ animation: 'sparkle 0.5s infinite' }} opacity="0.5" />
            <rect x="14" y="56" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'water-drip 1.8s linear infinite -0.25s' }} />
        </g>
        {/* Plant */}
        <rect x="8" y="58" width="18" height="6" fill="var(--text-secondary)" opacity="0.7" />
        <rect x="14" y="48" width="4" height="10" fill="var(--text-primary)" opacity="0.7" />
        <g style={{ animation: 'plant-sway 9s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '16px 48px' }}>
            <path d="M 10 48 Q 16 38, 22 48 Z" fill="var(--text-secondary)" />
            <path d="M  4 42 Q 10 34, 16 42 Z" fill="var(--text-secondary)" />
        </g>
    </PixelArtSVG>
);

const GuitarAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Stool */}
        <rect x="18" y="60" width="28" height="4" fill="var(--bg-tertiary)" />
        <rect x="18" y="58" width="28" height="2" fill="var(--text-secondary)" opacity="0.2" />
        {/* Character */}
        <g style={{ animation: 'reading-head-nod 8s cubic-bezier(0.45, 0, 0.55, 1) infinite -1s', transformOrigin: '32px 34px' }}>
            <rect x="18" y="42" width="28" height="18" fill="var(--text-primary)" />
            <rect x="24" y="26" width="16" height="16" fill="var(--text-secondary)" />
        </g>
        {/* Guitar */}
        <g style={{ animation: 'guitar-strum 2.5s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '40px 50px' }}>
            <rect x="36" y="48" width="16" height="10" fill="var(--text-secondary)" opacity="0.8" />
            <rect x="36" y="48" width="16" height="2" fill="var(--text-primary)" opacity="0.2" />
            <rect x="30" y="30" width="6" height="22" fill="var(--text-secondary)" opacity="0.8" />
            <rect x="32" y="30" width="2" height="22" fill="var(--text-primary)" opacity="0.2" />
        </g>
    </PixelArtSVG>
);

const TypingAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Desk */}
        <rect x="4" y="60" width="56" height="4" fill="var(--bg-tertiary)" />
        <rect x="4" y="58" width="56" height="2" fill="var(--text-secondary)" opacity="0.2" />
        {/* Computer */}
        <rect x="18" y="44" width="28" height="16" fill="var(--text-secondary)" />
        <rect x="12" y="40" width="40" height="4" fill="var(--text-secondary)" />
        <rect x="20" y="46" width="24" height="12" fill="var(--accent-color)" style={{ animation: 'screen-glow 8s ease-in-out infinite' }} />
        {/* Character */}
        <g>
            <rect x="38" y="48" width="18" height="12" fill="var(--text-primary)" />
            <rect x="40" y="32" width="16" height="16" fill="var(--text-secondary)" />
             <rect x="43" y="38" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 6.5s infinite ease-in-out -0.2s' }}/>
        </g>
        {/* Hands */}
        <g style={{ animation: 'typing-fingers 0.6s linear infinite' }}>
            <rect x="34" y="58" width="8" height="3" fill="var(--text-primary)" />
        </g>
    </PixelArtSVG>
);

const PaintingAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Easel */}
        <path d="M 16 62 L 30 24 L 44 62 Z" fill="var(--bg-tertiary)" opacity="0.8" />
        {/* Canvas */}
        <rect x="20" y="28" width="28" height="22" fill="var(--bg-secondary)" />
        <rect x="24" y="32" width="20" height="16" fill="var(--accent-color)" opacity="0.3" />
        <rect x="30" y="36" width="10" height="8" fill="var(--link-color)" opacity="0.2" style={{ animation: 'tv-flicker-light 10s ease-in-out infinite' }}/>
        {/* Character */}
        <rect x="42" y="38" width="16" height="24" fill="var(--text-primary)" />
        <rect x="42" y="22" width="16" height="16" fill="var(--text-secondary)" />
        {/* Arm and Brush */}
        <g style={{ animation: 'brush-stroke 4s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '42px 48px' }}>
            <rect x="32" y="46" width="12" height="4" fill="var(--text-primary)" />
            <rect x="29" y="46" width="3" height="2" fill="var(--link-color)" />
        </g>
    </PixelArtSVG>
);

const WaggingDogAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Floor */}
        <rect x="0" y="62" width="64" height="2" fill="var(--bg-tertiary)" />
        {/* Dog Body */}
        <g style={{ animation: 'calm-breathe 9s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: 'center' }}>
            <rect x="16" y="44" width="32" height="18" rx="4" fill="var(--text-secondary)" />
            <rect x="16" y="44" width="32" height="3" fill="var(--text-primary)" opacity="0.3" />
        </g>
        {/* Dog Head */}
        <rect x="40" y="34" width="18" height="18" rx="4" fill="var(--text-secondary)" />
        <rect x="41" y="35" width="16" height="16" rx="3" fill="var(--text-primary)" opacity="0.3" />
        {/* Ears */}
        <g style={{ animation: 'dog-ear-twitch-quick 6s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '42px 34px' }}>
            <path d="M 42 34 L 48 28 L 48 36 Z" fill="var(--text-primary)" opacity="0.6" />
        </g>
        {/* Tail */}
        <g style={{ animation: 'dog-tail-wag-lazy 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '16px 52px' }}>
            <path d="M 16 52 Q 4 48, 10 60" fill="none" stroke="var(--text-secondary)" strokeWidth="4" />
        </g>
    </PixelArtSVG>
);

const CandleAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Table */}
        <rect x="18" y="60" width="28" height="4" fill="var(--bg-tertiary)" />
        <rect x="18" y="58" width="28" height="2" fill="var(--text-secondary)" opacity="0.2" />
        {/* Candle */}
        <rect x="26" y="46" width="12" height="14" fill="var(--bg-secondary)" />
        <rect x="27" y="46" width="10" height="1" fill="var(--border-color)" />
        {/* Flame */}
        <g style={{ animation: 'candle-flicker 2s ease-in-out infinite', transformOrigin: '32px 42px' }}>
            <ellipse cx="32" cy="42" rx="3" ry="5" fill="var(--accent-color)" />
            <ellipse cx="32" cy="42" rx="1.5" ry="3" fill="#fff" />
        </g>
        {/* Glow */}
        <ellipse cx="32" cy="42" rx="12" ry="8" fill="var(--accent-color)" style={{ animation: 'candle-glow 2s ease-in-out infinite' }} />
    </PixelArtSVG>
);

const PottedPlantAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Saucer */}
        <rect x="20" y="60" width="24" height="4" fill="var(--bg-tertiary)" />
        {/* Pot */}
        <rect x="22" y="48" width="20" height="12" fill="var(--text-secondary)" />
        <rect x="22" y="48" width="20" height="2" fill="var(--text-primary)" opacity="0.3" />
        {/* Stem */}
        <rect x="30" y="30" width="4" height="18" fill="var(--text-primary)" opacity="0.7" />
        {/* Leaves */}
        <g style={{ animation: 'plant-sway 10s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '32px 48px' }}>
            <path d="M 30 38 Q 18 30, 30 22 Z" fill="var(--text-secondary)" />
            <path d="M 34 38 Q 46 30, 34 22 Z" fill="var(--text-secondary)" />
            <path d="M 30 46 Q 20 40, 30 34 Z" fill="var(--text-secondary)" />
            <path d="M 34 46 Q 44 40, 34 34 Z" fill="var(--text-secondary)" />
        </g>
        {/* Sparkle */}
        <rect x="24" y="28" width="2" height="2" fill="#fff" style={{ animation: 'sparkle 1.5s infinite -0.5s' }} />
    </PixelArtSVG>
);

const FireplaceAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Fireplace structure */}
        <rect x="8" y="24" width="48" height="40" fill="var(--text-secondary)" />
        <rect x="12" y="28" width="40" height="32" fill="var(--bg-primary)" />
        <rect x="4" y="60" width="56" height="4" fill="var(--bg-tertiary)" />
        {/* Logs */}
        <rect x="20" y="52" width="24" height="6" fill="var(--text-primary)" opacity="0.6" />
        <rect x="24" y="46" width="16" height="6" fill="var(--text-primary)" opacity="0.6" />
        {/* Flames */}
        <g style={{ animation: 'candle-flicker 1s ease-in-out infinite', transformOrigin: 'center 46px' }}>
            <path d="M 24 50 Q 32 32 40 50 Z" fill="var(--accent-color)" />
            <path d="M 28 50 Q 32 38 36 50 Z" fill="#FFD700" />
        </g>
        {/* Embers */}
        <rect x="26" y="54" width="3" height="3" fill="#FF4500" style={{ animation: 'ember-glow 1.5s ease-in-out infinite' }} />
        <rect x="35" y="53" width="3" height="3" fill="#FF4500" style={{ animation: 'ember-glow 1.5s ease-in-out infinite -0.5s' }} />
        {/* Smoke */}
        <rect x="31" y="32" width="2" height="2" fill="var(--border-color)" style={{ animation: 'smoke-rise 6s linear infinite' }} />
    </PixelArtSVG>
);

const CouchAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Couch */}
        <rect x="4" y="58" width="56" height="6" fill="var(--text-secondary)" />
        <rect x="4" y="44" width="56" height="14" fill="var(--text-secondary)" opacity="0.8" />
        <rect x="4" y="42" width="56" height="2" fill="var(--text-primary)" opacity="0.3" />
        {/* Character */}
        <g style={{ animation: 'calm-breathe 8s cubic-bezier(0.45, 0, 0.55, 1) infinite' }}>
            <rect x="14" y="46" width="20" height="12" fill="var(--text-primary)" />
            <rect x="30" y="34" width="16" height="16" fill="var(--text-secondary)" />
        </g>
        {/* Blanket */}
        <rect x="12" y="52" width="24" height="8" fill="var(--link-color)" />
        <rect x="12" y="52" width="24" height="2" fill="var(--link-color)" opacity="0.3" />
        {/* Eyes */}
        <rect x="33" y="40" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 8s infinite ease-in-out -1s' }}/>
        <rect x="39" y="40" width="4" height="2" fill="var(--bg-secondary)" style={{ animation: 'eye-blink 8s infinite ease-in-out -1.5s' }}/>
    </PixelArtSVG>
);

const KnittingAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Chair */}
        <rect x="8" y="48" width="8" height="16" fill="var(--text-secondary)" opacity="0.8" />
        <rect x="8" y="60" width="36" height="4" fill="var(--text-secondary)" opacity="0.8" />
        {/* Character */}
        <rect x="14" y="42" width="24" height="18" fill="var(--text-primary)" />
        <rect x="18" y="26" width="16" height="16" fill="var(--text-secondary)" />
        {/* Hands & Knitting */}
        <g style={{ animation: 'typing-fingers 1.5s ease-in-out infinite' }}>
            <rect x="36" y="48" width="8" height="4" fill="var(--text-secondary)" />
            <rect x="40" y="46" width="2" height="6" fill="var(--border-color)" />
            <rect x="38" y="44" width="2" height="6" fill="var(--border-color)" />
        </g>
        {/* Yarn Ball */}
        <rect x="46" y="56" width="8" height="8" rx="4" fill="var(--link-color)" />
    </PixelArtSVG>
);

const AquariumAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Tank */}
        <rect x="4" y="20" width="56" height="40" fill="var(--link-color)" opacity="0.2" />
        <rect x="4" y="18" width="56" height="2" fill="var(--border-color)" />
        <rect x="2" y="20" width="2" height="40" fill="var(--border-color)" />
        <rect x="60" y="20" width="2" height="40" fill="var(--border-color)" />
        {/* Fish */}
        <g style={{ animation: 'fish-swim 10s ease-in-out infinite' }}>
            <rect x="12" y="32" width="10" height="6" fill="var(--accent-color)" />
            <path d="M 22 35 L 26 32 L 26 38 Z" fill="var(--accent-color)" style={{ animation: 'fish-tail-sway 1s ease-in-out infinite', transformOrigin: '22px 35px' }}/>
        </g>
        <g style={{ animation: 'fish-swim 14s ease-in-out infinite -5s' }}>
            <rect x="18" y="48" width="8" height="4" fill="var(--text-secondary)" />
            <path d="M 26 50 L 29 48 L 29 52 Z" fill="var(--text-secondary)" style={{ animation: 'fish-tail-sway 1.2s ease-in-out infinite', transformOrigin: '26px 50px' }}/>
        </g>
        {/* Bubbles */}
        <rect x="48" y="52" width="2" height="2" rx="1" fill="#fff" opacity="0.5" style={{ animation: 'bubble-rise 5s linear infinite' }} />
        <rect x="50" y="56" width="3" height="3" rx="1.5" fill="#fff" opacity="0.5" style={{ animation: 'bubble-rise 6s linear infinite -2s' }} />
    </PixelArtSVG>
);

const WindowCurtainAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Window Frame */}
        <rect x="10" y="10" width="44" height="44" fill="var(--text-secondary)" />
        <rect x="12" y="12" width="40" height="40" fill="var(--bg-primary)" />
        {/* Night sky */}
        <rect x="12" y="12" width="40" height="40" fill="#0a192f" />
        <rect x="40" y="18" width="6" height="6" rx="3" fill="#f0e6f0" /> {/* Moon */}
        {/* Stars */}
        <rect x="20" y="22" width="2" height="2" fill="#fff" style={{ animation: 'star-twinkle 4s infinite' }} />
        <rect x="50" y="30" width="2" height="2" fill="#fff" style={{ animation: 'star-twinkle 3s infinite -1s' }} />
        <rect x="35" y="45" width="1" height="1" fill="#fff" style={{ animation: 'star-twinkle 5s infinite -2s' }} />
        {/* Curtains */}
        <g style={{ animation: 'curtain-sway 8s ease-in-out infinite', transformOrigin: '10px 10px' }}>
            <rect x="10" y="10" width="8" height="44" fill="var(--bg-tertiary)" />
            <rect x="16" y="10" width="2" height="44" fill="var(--border-color)" opacity="0.2" />
        </g>
        <g style={{ animation: 'curtain-sway 8s ease-in-out infinite -0.5s', transformOrigin: '54px 10px' }}>
            <rect x="46" y="10" width="8" height="44" fill="var(--bg-tertiary)" />
            <rect x="46" y="10" width="2" height="44" fill="var(--border-color)" opacity="0.2" />
        </g>
    </PixelArtSVG>
);

const StretchingCatAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Floor */}
        <rect x="0" y="60" width="64" height="4" fill="var(--bg-tertiary)" />
        {/* Cat */}
        <g style={{ animation: 'cat-stretch 10s ease-in-out infinite', transformOrigin: '32px 50px' }}>
            {/* Body */}
            <rect x="20" y="46" width="24" height="14" rx="4" fill="var(--text-secondary)" />
            {/* Head */}
            <rect x="40" y="34" width="14" height="14" rx="4" fill="var(--text-secondary)" />
            <rect x="41" y="35" width="12" height="12" rx="3" fill="var(--text-primary)" opacity="0.3" />
            {/* Paws */}
            <rect x="46" y="48" width="6" height="12" fill="var(--text-secondary)" />
            {/* Tail */}
            <path d="M 20 52 Q 10 50, 12 60" fill="none" stroke="var(--text-secondary)" strokeWidth="4" />
        </g>
    </PixelArtSVG>
);

const CoffeeMugAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Table */}
        <rect x="0" y="60" width="64" height="4" fill="var(--bg-tertiary)" />
        <rect x="0" y="58" width="64" height="2" fill="var(--text-secondary)" opacity="0.2" />
        {/* Character */}
        <g style={{ animation: 'reading-head-nod 10s cubic-bezier(0.45, 0, 0.55, 1) infinite', transformOrigin: '28px 42px' }}>
            <rect x="16" y="40" width="24" height="18" fill="var(--text-primary)" />
            <rect x="20" y="24" width="16" height="16" fill="var(--text-secondary)" />
        </g>
        {/* Mug */}
        <rect x="40" y="46" width="12" height="10" fill="var(--bg-secondary)" />
        <rect x="52" y="48" width="3" height="6" fill="var(--bg-secondary)" />
        <rect x="41" y="46" width="10" height="2" fill="#5D4037" /> {/* Coffee */}
        {/* Steam */}
        <rect x="44" y="38" width="2" height="2" fill="var(--border-color)" style={{ animation: 'steam-rise 5s linear infinite -1s' }} />
        <rect x="47" y="40" width="2" height="2" fill="var(--border-color)" style={{ animation: 'steam-rise 5.5s linear infinite -3s' }} />
    </PixelArtSVG>
);

const StargazingAnimation: React.FC = () => (
    <PixelArtSVG>
        {/* Window Frame */}
        <rect x="0" y="0" width="64" height="64" fill="#0a192f" />
        <rect x="30" y="0" width="4" height="64" fill="var(--bg-tertiary)" opacity="0.5" />
        <rect x="0" y="30" width="64" height="4" fill="var(--bg-tertiary)" opacity="0.5" />
        {/* Stars */}
        <rect x="12" y="18" width="2" height="2" fill="#fff" style={{ animation: 'star-twinkle 3s infinite' }} />
        <rect x="48" y="42" width="2" height="2" fill="#fff" style={{ animation: 'star-twinkle 5s infinite -2s' }} />
        <rect x="55" y="10" width="3" height="3" fill="#fff" style={{ animation: 'star-twinkle 4s infinite -1s' }} />
        <rect x="20" y="50" width="1" height="1" fill="#fff" style={{ animation: 'star-twinkle 6s infinite -3s' }} />
        {/* Character */}
        <g style={{ animation: 'calm-breathe 9s ease-in-out infinite', transformOrigin: '48px 48px' }}>
            <rect x="38" y="46" width="20" height="18" fill="var(--text-primary)" />
            <rect x="40" y="30" width="16" height="16" fill="var(--text-secondary)" />
        </g>
    </PixelArtSVG>
);

const ALL_ANIMATIONS: React.FC[] = [
    ReadingAnimation,
    TeaAnimation,
    MeditateAnimation,
    TvAnimation,
    SleepingCatAnimation,
    WaggingDogAnimation,
    WateringPlantAnimation,
    GuitarAnimation,
    PaintingAnimation,
    TypingAnimation,
    CandleAnimation,
    PottedPlantAnimation,
    FireplaceAnimation,
    CouchAnimation,
    KnittingAnimation,
    AquariumAnimation,
    WindowCurtainAnimation,
    StretchingCatAnimation,
    CoffeeMugAnimation,
    StargazingAnimation,
];

const SituationalAnimation: React.FC<AnimationProps> = ({ themeId }) => {
    const [animationIndex, setAnimationIndex] = useState(0);

    useEffect(() => {
        const hoursSinceEpoch = Math.floor(new Date().getTime() / (1000 * 60 * 60));
        // Change animation every hour
        setAnimationIndex(hoursSinceEpoch % ALL_ANIMATIONS.length);
    }, []);
    
    const AnimationComponent = useMemo(() => ALL_ANIMATIONS[animationIndex], [animationIndex]);

    return (
        <div
            className="flex justify-end p-2 opacity-80 pointer-events-none"
            aria-hidden="true"
        >
            <AnimationComponent />
        </div>
    );
};

export default SituationalAnimation;