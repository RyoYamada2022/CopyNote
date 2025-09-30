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

const ManPlayingGuitar: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#3c4043" />
        <rect x="20" y="58" width="24" height="6" fill="#202124" />
        {/* Man */}
        <path d="M28 58 v-12 h-4 v-4 h12 v4 h-4 v12 z" fill="#8ab4f8" /> {/* Legs */}
        <path d="M24 38 h16 v4 h-16 z" fill="#e8eaed" /> {/* Shirt */}
        <path d="M30 30 h4 v8 h-4 z" fill="#f8d7a8" /> {/* Neck */}
        <path d="M28 22 h8 v8 h-8 z" fill="#f8d7a8" /> {/* Head */}
        <path d="M28 24 h8 v2 h-8 z" fill="#5f6368" /> {/* Hair */}
        {/* Guitar */}
        <path d="M34 36 h12 v14 h-12 z" fill="#795548" />
        <path d="M36 38 h8 v10 h-8 z" fill="#5D4037" />
        <circle cx="40" cy="43" r="3" fill="#3c4043" />
        <path d="M38 36 v-10 h4 v10 z" fill="#795548" />
        <path d="M38 24 h4 v2 h-4 z" fill="#5D4037" />
        {/* Arm Strumming */}
        <g style={{ animation: 'slow-bob 2s ease-in-out infinite' }}>
            <path d="M28 38 h-10 v4 h10 z" fill="#e8eaed" />
            <path d="M18 40 h-2 v4 h2 z" fill="#f8d7a8" />
        </g>
    </PixelArtSVG>
);

const ManReadingNewspaper: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#f1f1f1" />
        <rect x="10" y="20" width="10" height="38" fill="#a1887f" />
        <rect x="44" y="20" width="10" height="38" fill="#a1887f" />
        {/* Man */}
        <path d="M28 58 v-10 h8 v10 z" fill="#5f6368" />
        <path d="M26 38 h12 v10 h-12 z" fill="#1a73e8" />
        <path d="M30 34 h4 v4 h-4 z" fill="#f8d7a8" />
        <g style={{ animation: 'head-nod 7s ease-in-out infinite' }}>
            <path d="M28 26 h8 v8 h-8 z" fill="#f8d7a8" /> {/* Head */}
            <path d="M28 28 h8 v2 h-8 z" fill="#202124" /> {/* Hair */}
        </g>
        {/* Newspaper */}
        <g style={{ animation: 'slow-bob 3s ease-in-out infinite' }}>
            <path d="M20 36 h24 v16 h-24 z" fill="#ffffff" />
            <path d="M22 38 h8 v2 h-8 z M22 42 h18 v2 h-18 z M22 46 h14 v2 h-14 z" fill="#dadce0" />
        </g>
    </PixelArtSVG>
);

const WomanCooking: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#e8f5e9" />
        <rect x="0" y="58" width="64" height="6" fill="#c8e6c9" />
        <rect x="10" y="40" width="44" height="18" fill="#a5d6a7" />
        <rect x="12" y="42" width="18" height="12" fill="#81c784" />
        <rect x="34" y="42" width="18" height="12" fill="#81c784" />
        {/* Woman */}
        <path d="M28 58 v-14 h8 v14 z" fill="#FFB6C1" />
        <path d="M26 36 h12 v8 h-12 z" fill="#FF69B4" />
        <path d="M30 32 h4 v4 h-4 z" fill="#ffccbc" />
        <path d="M28 24 h8 v8 h-8 z" fill="#ffccbc" />
        <path d="M28 26 h8 v2 h-8 z" fill="#8d6e63" />
        {/* Pot */}
        <path d="M40 34 h12 v6 h-12 z" fill="#bdbdbd" />
        <path d="M42 32 h8 v2 h-8 z" fill="#9e9e9e" />
        {/* Steam */}
        <rect x="44" y="24" width="1" height="4" fill="#e0e0e0" style={{ animation: 'slow-steam 3s ease-out infinite' }} />
        <rect x="47" y="22" width="1" height="5" fill="#e0e0e0" style={{ animation: 'slow-steam 3s ease-out infinite -1.5s' }} />
    </PixelArtSVG>
);

const WomanIroning: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#e3f2fd" />
        <rect x="10" y="50" width="44" height="14" fill="#90caf9" />
        {/* Woman */}
        <path d="M20 50 v-12 h-4 v-4 h12 v4 h-4 v12 z" fill="#ffecb3" />
        <path d="M16 30 h12 v4 h-12 z" fill="#ffa726" />
        <path d="M20 26 h4 v4 h-4 z" fill="#ffcc80" />
        <path d="M18 18 h8 v8 h-8 z" fill="#ffcc80" />
        <path d="M18 20 h8 v2 h-8 z" fill="#795548" />
        {/* Iron */}
        <g style={{ animation: 'gentle-sway 4s ease-in-out infinite' }}>
            <path d="M34 44 h12 v6 h-12 z" fill="#eeeeee" />
            <path d="M34 42 h10 v2 h-10 z" fill="#f44336" />
        </g>
        {/* Steam */}
        <path d="M40 40 c 0 -2 1 -2 1 -3" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ animation: 'iron-steam 4s ease-out infinite' }} />
        <path d="M43 40 c 0 -2 1 -2 1 -3" fill="none" stroke="#e0e0e0" strokeWidth="1" style={{ animation: 'iron-steam 4s ease-out infinite -2.5s' }} />
    </PixelArtSVG>
);

const ManWatchingTV: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#37474f" />
        <rect x="10" y="58" width="44" height="6" fill="#263238" />
        {/* TV */}
        <path d="M12 20 h40 v24 h-40 z" fill="#000000" />
        <g style={{ animation: 'tv-flicker 1.5s ease-in-out infinite' }}>
            {/* Field */}
            <rect x="14" y="22" width="36" height="20" fill="#4caf50" />
            {/* Players */}
            <rect x="20" y="30" width="2" height="4" fill="#f44336" style={{ animation: 'soccer-player-1 8s linear infinite' }} />
            <rect x="25" y="25" width="2" height="4" fill="#f44336" style={{ animation: 'soccer-player-1 8s linear infinite -2s' }} />
            <rect x="40" y="32" width="2" height="4" fill="#2196f3" style={{ animation: 'soccer-player-2 8s linear infinite' }} />
            <rect x="35" y="26" width="2" height="4" fill="#2196f3" style={{ animation: 'soccer-player-2 8s linear infinite -3s' }} />
            {/* Ball */}
            <rect x="31" y="31" width="1" height="1" fill="#ffffff" style={{ animation: 'soccer-ball 4s linear infinite' }} />
        </g>
        <path d="M28 44 h8 v4 h-8 z" fill="#78909c" />
        {/* Man */}
        <path d="M48 58 v-8 h-10 v-4 h14 v12 z" fill="#424242" />
        <path d="M38 42 h14 v4 h-14 z" fill="#757575" />
        <path d="M42 34 h8 v8 h-8 z" fill="#c5a687" />
    </PixelArtSVG>
);

const ManOnStool: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#fbe9e7" />
        <rect x="0" y="58" width="64" height="6" fill="#ffccbc" />
        {/* Stool */}
        <path d="M38 48 h12 v4 h-12 z" fill="#a1887f" />
        <path d="M40 52 h2 v6 h-2 z M46 52 h2 v6 h-2 z" fill="#795548" />
        {/* Man */}
        <path d="M20 30 h8 v28 h-8 z" fill="#607d8b" /> {/* Body */}
        <path d="M22 22 h4 v8 h-4 z" fill="#ffcc80" /> {/* Neck */}
        <g style={{ animation: 'head-nod 6s ease-in-out infinite -1s' }}>
            <path d="M20 14 h8 v8 h-8 z" fill="#ffcc80" /> {/* Head */}
            <path d="M20 16 h8 v2 h-8 z" fill="#3e2723" /> {/* Hair */}
        </g>
        <g style={{ animation: 'gentle-sway 5s ease-in-out infinite' }}>
            <path d="M28 44 h8 v4 h-8 z" fill="#607d8b" /> {/* Leg */}
        </g>
    </PixelArtSVG>
);

const SmilingSnowman: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#e1f5fe" />
        <rect x="0" y="58" width="64" height="6" fill="#ffffff" />
        {/* Snowman */}
        <path d="M22 42 h20 v16 h-20 z M24 40 h16 v2 h-16 z" fill="#f5f5f5" />
        <path d="M26 28 h12 v12 h-12 z" fill="#f5f5f5" />
        <path d="M30 36 h4 v1 h-4 z" fill="#000" />
        <path d="M28 32 h2 v2 h-2 z M34 32 h2 v2 h-2 z" fill="#000" /> {/* Eyes */}
        <path d="M28.5 32.5 l 1 1 M29.5 32.5 l -1 1" stroke="#fff" strokeWidth="0.5" style={{ animation: 'eye-glint 5s ease-in-out infinite -1s' }} /> {/* Glint */}
        <path d="M30 24 h4 v4 h-4 z" fill="#000" />
        <path d="M28 22 h8 v2 h-8 z" fill="#000" />
        <path d="M30 20 h4 v2 h-4 z" fill="#ff5722" />
        {/* Snow */}
        <rect x="10" y="0" width="2" height="2" fill="#fff" style={{ animation: 'snow-fall 8s linear infinite' }} />
        <rect x="50" y="0" width="2" height="2" fill="#fff" style={{ animation: 'snow-fall 6s linear infinite -4s' }} />
        <rect x="30" y="0" width="2" height="2" fill="#fff" style={{ animation: 'snow-fall 7s linear infinite -2s' }} />
    </PixelArtSVG>
);

const WateringPlant: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#fffde7" />
        <rect x="10" y="50" width="16" height="14" fill="#8d6e63" />
        {/* Plant */}
        <path d="M16 40 h4 v10 h-4 z" fill="#558b2f" />
        <path d="M12 30 h12 v10 h-12 z" fill="#7cb342" />
        {/* Person */}
        <path d="M40 30 h10 v28 h-10 z" fill="#b3e5fc" />
        <path d="M42 22 h6 v8 h-6 z" fill="#ffe0b2" />
        {/* Watering Can */}
        <g style={{ animation: 'gentle-sway 3s ease-in-out infinite' }}>
            <path d="M30 38 h10 v8 h-10 z" fill="#9e9e9e" />
            <path d="M24 40 h6 v2 h-6 z" fill="#9e9e9e" />
        </g>
    </PixelArtSVG>
);

const KnittingRockingChair: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#f3e5f5" />
        <rect x="0" y="58" width="64" height="6" fill="#e1bee7" />
        {/* Rocker bottom */}
        <path d="M18 58 q 14 -10 28 0" stroke="#8e24aa" fill="none" strokeWidth="2" />
        {/* Rocking part */}
        <g style={{ animation: 'gentle-rock 4s ease-in-out infinite', transformOrigin: '32px 58px' }}>
            {/* Chair */}
            <path d="M20 28 h4 v30 h-4 z M36 28 h4 v30 h-4 z M20 28 h20 v4 h-20 z" fill="#ab47bc" />
            {/* Person */}
            <path d="M24 32 h12 v18 h-12 z" fill="#ce93d8" />
            <path d="M26 24 h8 v8 h-8 z" fill="#ffccbd" />
            {/* Knitting */}
            <g style={{ animation: 'slow-bob 2.5s ease-in-out infinite' }}>
                <path d="M28 40 h8 v4 h-8 z" fill="#f06292" />
            </g>
        </g>
    </PixelArtSVG>
);

const PaintingOnEasel: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#fafafa" />
        {/* Easel */}
        <path d="M18 58 l 14 -40 l 14 40" stroke="#8d6e63" fill="none" strokeWidth="2" />
        <path d="M24 28 h20 v4 h-20 z" fill="#8d6e63" />
        {/* Canvas */}
        <rect x="18" y="22" width="28" height="20" fill="#fff" />
        <path d="M20 40 l 8 -10 l 6 6 l 10 -14" stroke="#4caf50" fill="none" strokeWidth="2" />
        {/* Artist */}
        <path d="M50 30 h8 v28 h-8 z" fill="#9fa8da" />
        <g style={{ animation: 'head-nod 8s ease-in-out infinite -3s' }}>
            <path d="M52 22 h4 v8 h-4 z" fill="#e1ad84" /> {/* Head */}
        </g>
        <g style={{ animation: 'slow-bob 4s ease-in-out infinite' }}>
             <path d="M44 36 h6 v4 h-6 z" fill="#9fa8da" />
        </g>
    </PixelArtSVG>
);

const CozyFireplace: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#3e2723" />
        <path d="M12 10 h40 v48 h-40 z" fill="#5d4037" />
        <path d="M16 14 h32 v40 h-32 z" fill="#1b1b1b" />
        {/* Fire */}
        <path d="M24 50 h16 v4 h-16 z" fill="#795548" />
        <g style={{ animation: 'fire-flicker 1s ease-in-out infinite' }}>
            <path d="M28 40 h8 v10 h-8 z" fill="#ff9800" />
            <path d="M30 36 h4 v10 h-4 z" fill="#fdd835" />
        </g>
    </PixelArtSVG>
);

const LavaLamp: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#1a001a" />
        {/* Lamp */}
        <path d="M26 56 h12 v4 h-12 z M24 6 h16 v4 h-16 z" fill="#3d003d" />
        <path d="M24 10 h16 v46 h-16 z" fill="#a040a0" opacity="0.4" />
        {/* Lava */}
        <circle cx="32" cy="50" r="6" fill="#d070d0" />
        <circle cx="32" cy="40" r="5" fill="#d070d0" style={{ animation: 'lava-bubble 5s ease-in-out infinite' }} />
        <circle cx="32" cy="45" r="4" fill="#d070d0" style={{ animation: 'lava-bubble 6s ease-in-out infinite -2s' }} />
    </PixelArtSVG>
);

const Fishbowl: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#e0f7fa" />
        <rect x="0" y="56" width="64" height="8" fill="#b2ebf2" />
        {/* Bowl */}
        <path d="M16 20 h32 v32 h-32 z" fill="#4dd0e1" opacity="0.3" />
        <rect x="20" y="50" width="24" height="2" fill="#80cbc4" />
        {/* Water */}
        <rect x="16" y="24" width="32" height="28" fill="#4dd0e1" opacity="0.5" />
        {/* Fish */}
        <g style={{ animation: 'fish-swim 8s linear infinite', transformOrigin: 'center' }}>
            <path d="M28 36 h6 v4 h-6 z" fill="#ff9800" />
            <path d="M34 37 h2 v2 h-2 z" fill="#ff9800" />
            <path d="M26 37 l 2 -1 v4 l -2 -1 z" fill="#ffb74d" />
        </g>
    </PixelArtSVG>
);

const FlickeringCandle: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#263238" />
        {/* Candle */}
        <rect x="28" y="30" width="8" height="28" fill="#fff59d" />
        <rect x="28" y="30" width="8" height="4" fill="#fbc02d" />
        {/* Flame */}
        <g style={{ transformOrigin: '50% 100%', animation: 'gentle-sway 3s ease-in-out infinite' }}>
            <path d="M30 22 h4 v8 h-4 z" fill="#f57c00" />
            <path d="M31 20 h2 v6 h-2 z" fill="#fff176" style={{ animation: 'candle-flicker-subtle 1s ease-in-out infinite' }} />
        </g>
    </PixelArtSVG>
);

const SwayingCurtains: React.FC = () => (
    <PixelArtSVG>
        <rect x="12" y="8" width="40" height="48" fill="#81d4fa" /> {/* Sky */}
        <rect x="12" y="40" width="40" height="16" fill="#2e7d32" /> {/* Grass */}
        <rect x="8" y="4" width="48" height="56" fill="none" stroke="#a1887f" strokeWidth="4" />
        {/* Curtains */}
        <g style={{ animation: 'gentle-sway 4s ease-in-out infinite' }}>
            <path d="M8 4 h12 v56 h-12 z" fill="#fff" opacity="0.9" />
        </g>
        <g style={{ animation: 'gentle-sway 4s ease-in-out infinite -2s' }}>
             <path d="M44 4 h12 v56 h-12 z" fill="#fff" opacity="0.9" />
        </g>
    </PixelArtSVG>
);

const PendulumClock: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#5d4037" />
        <rect x="18" y="8" width="28" height="50" fill="#a1887f" />
        <rect x="20" y="10" width="24" height="46" fill="#f5f5f5" />
        {/* Clock Face */}
        <circle cx="32" cy="22" r="8" fill="#fffde7" />
        <path d="M32 22 v-6 M32 22 h5" stroke="#3e2723" strokeWidth="1" />
        {/* Pendulum */}
        <g style={{ animation: 'pendulum-swing 2.5s ease-in-out infinite', transformOrigin: '32px 30px' }}>
            <rect x="31" y="30" width="2" height="18" fill="#fbc02d" />
            <circle cx="32" cy="48" r="4" fill="#fbc02d" />
        </g>
    </PixelArtSVG>
);

const SteamingTeacup: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#f1f8e9" />
        <rect x="0" y="56" width="64" height="8" fill="#dcedc8" />
        {/* Saucer */}
        <rect x="14" y="50" width="36" height="4" fill="#fff" />
        {/* Cup */}
        <path d="M20 36 h24 v14 h-24 z" fill="#fff" />
        <path d="M44 40 h4 v6 h-4 z" fill="#fff" />
        <rect x="22" y="38" width="20" height="4" fill="#8d6e63" /> {/* Tea */}
        <ellipse cx="32" cy="39" rx="9" ry="1.5" fill="#a1887f" style={{ animation: 'tea-ripple 5s ease-in-out infinite', transformOrigin: 'center' }} />
        {/* Steam */}
        <rect x="28" y="28" width="1" height="5" fill="#a1887f" style={{ animation: 'slow-steam 3.5s ease-out infinite' }} />
        <rect x="34" y="26" width="1" height="6" fill="#a1887f" style={{ animation: 'slow-steam 3.5s ease-out infinite -1.7s' }} />
    </PixelArtSVG>
);

const TypingOnLaptop: React.FC = () => (
    <PixelArtSVG>
        <rect x="0" y="0" width="64" height="64" fill="#455a64" />
        <rect x="0" y="56" width="64" height="8" fill="#37474f" />
        {/* Person */}
        <path d="M40 56 v-16 h-8 v-8 h12 v24 z" fill="#7e57c2" />
        <path d="M32 30 h8 v2 h-8 z" fill="#d1c4e9" />
        <path d="M30 22 h8 v8 h-8 z" fill="#f3e5f5" />
        {/* Laptop */}
        <path d="M10 52 h24 v4 h-24 z" fill="#b0bec5" />
        <path d="M12 30 h20 v22 h-20 z" fill="#b0bec5" />
        <rect x="14" y="32" width="16" height="14" fill="#263238" />
        {/* Hands */}
        <g style={{ animation: 'typing-keys 2s steps(2, end) infinite' }}>
            <rect x="20" y="48" width="4" height="2" fill="#f3e5f5" />
            <rect x="26" y="48" width="4" height="2" fill="#f3e5f5" />
        </g>
    </PixelArtSVG>
);


const ALL_ANIMATIONS: React.FC[] = [
    ManPlayingGuitar,
    ManReadingNewspaper,
    WomanCooking,
    WomanIroning,
    ManWatchingTV,
    ManOnStool,
    SmilingSnowman,
    WateringPlant,
    KnittingRockingChair,
    PaintingOnEasel,
    CozyFireplace,
    LavaLamp,
    Fishbowl,
    FlickeringCandle,
    SwayingCurtains,
    PendulumClock,
    SteamingTeacup,
    TypingOnLaptop
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