import React, { useState, useEffect, useMemo } from 'react';

interface AnimationProps {
  themeId: string;
}

const PixelArtSVG: React.FC<{ viewBox: string, children: React.ReactNode, className?: string }> = ({ viewBox, children, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={viewBox} 
        shapeRendering="crispEdges"
        className={className}
    >
        {children}
    </svg>
);

const CampfireAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="13" y="34" width="14" height="2" fill="var(--text-secondary)" />
        <rect x="15" y="32" width="10" height="2" fill="var(--text-secondary)" transform="rotate(-15 15 32)" opacity="0.8"/>
        <rect x="18" y="30" width="4" height="2" fill="var(--accent-color)" opacity="0.5" style={{ animation: 'pixel-ember-glow 2s ease-in-out infinite' }}/>
        <rect x="18" y="22" width="4" height="2" fill="var(--text-primary)" opacity="0.2" style={{ animation: 'pixel-smoke-rise 4s linear infinite', animationDelay: '-1s' }} />
        <g style={{ transformOrigin: '20px 32px', animation: 'pixel-flame-flicker-1 1.5s ease-in-out infinite' }}>
            <rect x="18" y="29" width="4" height="3" fill="var(--accent-color)" style={{ animation: 'pixel-flame-flicker-2 0.8s ease-in-out infinite reverse' }} />
            <rect x="17" y="26" width="6" height="3" fill="var(--accent-color)" style={{ animation: 'pixel-flame-flicker-2 1s ease-in-out infinite .2s', opacity: 0.8 }} />
            <rect x="19" y="23" width="2" height="3" fill="var(--accent-color)" style={{ animation: 'pixel-flame-flicker-1 0.6s ease-in-out infinite .4s reverse', opacity: 0.6 }} />
        </g>
        <rect x="22" y="29" width="1" height="1" fill="var(--accent-color)" style={{ animation: 'pixel-spark-rise 3s linear infinite' }} />
        <rect x="17" y="28" width="1" height="1" fill="var(--accent-color)" style={{ animation: 'pixel-spark-rise 4s linear infinite -1.5s' }} />
    </PixelArtSVG>
);

const ReadingAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 50 50" className="w-36 h-36">
        <rect x="10" y="45" width="30" height="2" fill="var(--border-color)" />
        <rect x="35" y="35" width="5" height="10" fill="var(--text-secondary)" />
        <rect x="34" y="25" width="7" height="10" fill="var(--accent-color)" style={{ opacity: 0.8, animation: 'pixel-lamp-flicker 8s ease-in-out infinite' }}/>
        <g style={{ animation: 'pixel-head-nod 8s ease-in-out infinite', transformOrigin: '14px 35px' }}>
            <rect x="12" y="35" width="4" height="10" fill="var(--text-secondary)" />
            <rect x="10" y="20" width="8" height="15" fill="var(--text-primary)" />
            <rect x="10" y="15" width="8" height="5" fill="var(--text-secondary)" />
        </g>
        <rect x="25" y="30" width="15" height="15" fill="var(--text-secondary)" />
        <rect x="20" y="28" width="5" height="5" fill="var(--bg-secondary)" />
        <rect x="21" y="29" width="3" height="3" fill="var(--bg-tertiary)" style={{ animation: 'pixel-page-turn 5s ease-in-out infinite' }}/>
    </PixelArtSVG>
);

const SnowmanAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36 overflow-visible">
        <rect x="0" y="38" width="40" height="2" fill="var(--bg-secondary)" />
        <rect x="12" y="28" width="16" height="10" fill="var(--text-primary)" />
        <rect x="15" y="18" width="10" height="10" fill="var(--text-primary)" />
        <rect x="17" y="11" width="6" height="7" fill="var(--text-primary)" />
        <rect x="14" y="8" width="12" height="3" fill="var(--text-secondary)" />
        <rect x="16" y="5" width="8" height="3" fill="var(--text-secondary)" />
        <rect x="18" y="13" width="1" height="1" fill="var(--text-secondary)" style={{ animation: 'pixel-eye-blink 5s infinite', transformOrigin: 'center' }} />
        <rect x="21" y="13" width="1" height="1" fill="var(--text-secondary)" />
        <rect x="24" y="18" width="5" height="2" fill="var(--link-color)" style={{ animation: 'pixel-scarf-flap 2s ease-in-out infinite', transformOrigin: 'left center' }}/>
        <rect x="5" y="0" width="1" height="1" fill="var(--accent-color)" style={{ animation: 'pixel-snowfall 10s linear infinite', animationDelay: '0s' }} />
        <rect x="15" y="0" width="1" height="1" fill="var(--accent-color)" style={{ animation: 'pixel-snowfall 8s linear infinite', animationDelay: '-4s' }} />
        <rect x="25" y="0" width="1" height="1" fill="var(--accent-color)" style={{ animation: 'pixel-snowfall 12s linear infinite', animationDelay: '-7s' }} />
        <rect x="35" y="0" width="1" height="1" fill="var(--accent-color)" style={{ animation: 'pixel-snowfall 9s linear infinite', animationDelay: '-2s' }} />
    </PixelArtSVG>
);

const SailingAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 60 40" className="w-48 h-36">
        <rect x="0" y="0" width="60" height="40" fill="var(--bg-primary)" />
        <rect x="5" y="5" width="10" height="10" fill="var(--accent-color)" style={{ animation: 'pixel-sun-pulse 5s ease-in-out infinite' }} transform-origin="10px 10px"/>
        <rect x="-10" y="8" width="15" height="5" fill="var(--bg-secondary)" style={{ animation: 'pixel-cloud-drift 20s linear infinite', opacity: 0.8 }} />
        <rect x="-15" y="15" width="20" height="6" fill="var(--bg-secondary)" style={{ animation: 'pixel-cloud-drift 30s linear infinite -10s' }} />
        <rect x="0" y="32" width="60" height="8" fill="var(--link-color)" />
        <rect x="0" y="30" width="60" height="4" fill="var(--link-color)" style={{ animation: 'pixel-wave 4s ease-in-out infinite', animationDelay: '-1s', opacity: 0.8 }} />
        <rect x="0" y="31" width="60" height="4" fill="var(--link-color)" style={{ animation: 'pixel-wave 4s ease-in-out infinite reverse', opacity: 0.6 }} />
        <g style={{ animation: 'pixel-boat-rock 4s ease-in-out infinite' }} transform-origin="30px 30px">
            <rect x="20" y="28" width="20" height="4" fill="var(--text-secondary)" />
            <rect x="29" y="15" width="2" height="13" fill="var(--border-color)" />
            <polygon points="31,16 41,21 31,26" fill="var(--text-primary)" />
        </g>
    </PixelArtSVG>
);

const SleepingCatAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="5" y="35" width="30" height="3" fill="var(--bg-tertiary)" />
        <g style={{ transformOrigin: 'center bottom', animation: 'cat-breathe 3s ease-in-out infinite' }}>
            <rect x="10" y="20" width="20" height="15" fill="var(--text-secondary)" />
        </g>
        <rect x="12" y="17" width="4" height="3" fill="var(--text-secondary)" style={{ animation: 'pixel-ear-twitch 6s ease-in-out infinite', transformOrigin: 'bottom right' }} />
        <rect x="24" y="17" width="4" height="3" fill="var(--text-secondary)" />
        <rect x="5" y="25" width="5" height="2" fill="var(--text-secondary)" style={{ animation: 'pixel-tail-twitch 4s ease-in-out infinite', transformOrigin: 'right center' }} />
    </PixelArtSVG>
);

const BonsaiAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="10" y="35" width="20" height="3" fill="var(--text-secondary)" />
        <rect x="12" y="32" width="16" height="3" fill="var(--border-color)" />
        <g style={{ transformOrigin: 'bottom center', animation: 'pixel-tree-sway 10s ease-in-out infinite' }}>
            <rect x="19" y="22" width="2" height="10" fill="var(--text-secondary)" />
            <rect x="15" y="12" width="10" height="10" fill="var(--accent-color)" style={{ opacity: 0.8 }}/>
            <rect x="12" y="15" width="16" height="6" fill="var(--accent-color)" />
        </g>
        <rect x="10" y="14" width="2" height="1" fill="var(--link-color)" style={{ animation: 'pixel-leaf-flutter 8s linear infinite' }} />
    </PixelArtSVG>
);

const UfoAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <g style={{ animation: 'pixel-ufo-hover 3s ease-in-out infinite' }}>
            <rect x="10" y="15" width="20" height="4" fill="var(--border-color)" />
            <rect x="14" y="12" width="12" height="3" fill="var(--text-primary)" />
            <rect x="16" y="16" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-light-flicker 2s steps(1, end) infinite', animationDelay: '0s' }} />
            <rect x="22" y="16" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-light-flicker 2s steps(1, end) infinite', animationDelay: '-0.5s' }} />
        </g>
        <polygon points="18,19 22,19 25,34 15,34" fill="var(--accent-color)" style={{ animation: 'pixel-beam-pulse 8s steps(1, end) infinite', transformOrigin: 'top center' }} />
        <rect x="19" y="30" width="1" height="1" fill="var(--bg-tertiary)" style={{ animation: 'pixel-particle-rise 2s linear infinite .2s' }} />
        <rect x="20" y="25" width="1" height="1" fill="var(--bg-tertiary)" style={{ animation: 'pixel-particle-rise 1.5s linear infinite .5s' }} />
    </PixelArtSVG>
);

const RainyWindowAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36 overflow-visible">
        <rect x="0" y="0" width="40" height="40" fill="var(--bg-primary)" style={{ animation: 'pixel-lightning-flash 10s steps(1, end) infinite' }}/>
        <rect x="5" y="5" width="30" height="30" fill="var(--bg-tertiary)" />
        <rect x="19" y="5" width="2" height="30" fill="var(--border-color)" />
        <rect x="5" y="19" width="30" height="2" fill="var(--border-color)" />
        <rect x="8" y="0" width="1" height="2" fill="var(--link-color)" style={{ animation: 'pixel-rain 2s linear infinite', animationDelay: '0s' }} />
        <rect x="16" y="0" width="1" height="2" fill="var(--link-color)" style={{ animation: 'pixel-rain 1.5s linear infinite', animationDelay: '-1s' }} />
        <rect x="32" y="0" width="1" height="2" fill="var(--link-color)" style={{ animation: 'pixel-rain 1.8s linear infinite', animationDelay: '-1.5s' }} />
        <rect x="21" y="5" width="1" height="3" fill="var(--link-color)" opacity="0.6" style={{ animation: 'pixel-drip 3s linear infinite', animationDelay: '-0.5s' }}/>
    </PixelArtSVG>
);

const CoffeeAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="10" y="20" width="20" height="15" fill="var(--bg-secondary)" />
        <rect x="30" y="22" width="3" height="8" fill="var(--bg-secondary)" />
        <rect x="12" y="18" width="16" height="5" fill="var(--text-secondary)" />
        <rect x="15" y="15" width="1" height="2" fill="var(--border-color)" style={{ animation: 'pixel-steam-rise 4s linear infinite, pixel-steam-sway 3s ease-in-out infinite', animationDelay: '0s' }} />
        <rect x="20" y="15" width="1" height="2" fill="var(--border-color)" style={{ animation: 'pixel-steam-rise 4s linear infinite, pixel-steam-sway 3s ease-in-out infinite reverse', animationDelay: '-2s' }} />
        <rect x="25" y="15" width="1" height="2" fill="var(--border-color)" style={{ animation: 'pixel-steam-rise 4s linear infinite, pixel-steam-sway 3.5s ease-in-out infinite', animationDelay: '-1s' }} />
    </PixelArtSVG>
);

const FirefliesAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="0" y="0" width="40" height="40" fill="var(--bg-primary)" />
        <rect x="10" y="15" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-firefly 3s steps(1, end) infinite, pixel-firefly-move 10s ease-in-out infinite', animationDelay: '0s' }} />
        <rect x="25" y="25" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-firefly 3s steps(1, end) infinite, pixel-firefly-move 12s ease-in-out infinite reverse', animationDelay: '-1s' }} />
        <rect x="15" y="30" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-firefly 3s steps(1, end) infinite, pixel-firefly-move 9s ease-in-out infinite', animationDelay: '-2s' }} />
        <rect x="30" y="10" width="2" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-firefly 4s steps(1, end) infinite, pixel-firefly-move 15s ease-in-out infinite reverse', animationDelay: '-1.5s' }} />
    </PixelArtSVG>
);

const PaperPlaneAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36 overflow-visible">
        <g style={{ animation: 'pixel-plane 15s linear infinite' }}>
            <polygon points="0,0 10,2 0,4" fill="var(--text-primary)" />
        </g>
    </PixelArtSVG>
);

const MagicPortalAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="10" y="10" width="20" height="20" fill="var(--link-color)" />
        <g style={{ animation: 'pixel-portal-swirl 5s linear infinite', transformOrigin: 'center' }}>
            <rect x="12" y="12" width="16" height="16" fill="var(--accent-color)" style={{ opacity: 0.8 }} />
            <rect x="14" y="14" width="12" height="12" fill="var(--link-color)" />
            <rect x="16" y="16" width="8" height="8" fill="var(--accent-color)" style={{ animation: 'pixel-portal-swirl 2s linear infinite reverse' }} />
        </g>
        <rect x="20" y="20" width="1" height="1" fill="var(--bg-tertiary)" style={{ animation: 'pixel-particle-emit 2s linear infinite' }} />
    </PixelArtSVG>
);

const PottedPlantAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="12" y="32" width="16" height="6" fill="var(--text-secondary)" />
        <rect x="10" y="29" width="20" height="3" fill="var(--border-color)" />
        <rect x="19" y="19" width="2" height="10" fill="var(--text-secondary)" />
        <rect x="15" y="15" width="10" height="4" fill="var(--accent-color)" />
        <rect x="12" y="10" width="4" height="5" fill="var(--accent-color)" style={{ opacity: 0.8 }}/>
        <rect x="24" y="10" width="4" height="5" fill="var(--accent-color)" style={{ opacity: 0.8, animation: 'pixel-leaf-droop 5s ease-in-out infinite', transformOrigin: 'bottom left' }}/>
    </PixelArtSVG>
);

const AquariumAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="5" y="10" width="30" height="25" fill="var(--bg-tertiary)" />
        <rect x="5" y="35" width="30" height="3" fill="var(--border-color)" />
        <rect x="10" y="25" width="2" height="10" fill="var(--accent-color)" opacity="0.5" style={{ animation: 'pixel-seaweed-sway 4s ease-in-out infinite', transformOrigin: 'bottom' }}/>
        <g style={{ animation: 'pixel-fish-swim 10s linear infinite' }}>
            <rect x="10" y="20" width="5" height="3" fill="var(--accent-color)" />
        </g>
        <g style={{ animation: 'pixel-fish-swim 12s linear infinite -5s reverse' }}>
            <rect x="12" y="15" width="4" height="2" fill="var(--link-color)" />
        </g>
        <rect x="25" y="30" width="1" height="1" fill="var(--text-primary)" style={{ animation: 'pixel-bubble-rise 5s linear infinite', animationDelay: '0s' }} />
        <rect x="27" y="30" width="1" height="1" fill="var(--text-primary)" style={{ animation: 'pixel-bubble-rise 5s linear infinite', animationDelay: '-2s' }} />
    </PixelArtSVG>
);

const RocketAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <g style={{ animation: 'pixel-rocket-shake 0.2s steps(2, end) infinite' }}>
            <rect x="18" y="10" width="4" height="20" fill="var(--text-primary)" />
            <rect x="16" y="15" width="8" height="2" fill="var(--text-primary)" />
            <rect x="18" y="5" width="4" height="5" fill="var(--link-color)" />
        </g>
        <g>
            <rect x="17" y="30" width="6" height="5" fill="var(--accent-color)" style={{ animation: 'pixel-flame-flicker-1 0.5s ease-in-out infinite' }}/>
            <rect x="18" y="35" width="4" height="3" fill="var(--accent-color)" style={{ opacity: 0.8, animation: 'pixel-flame-flicker-2 0.5s ease-in-out infinite reverse' }}/>
        </g>
    </PixelArtSVG>
);

const WindChimesAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="10" y="5" width="20" height="2" fill="var(--text-secondary)" />
        <g style={{ animation: 'pixel-chime-swing 3s ease-in-out infinite alternate', transformOrigin: 'top center', animationDelay: '0s' }}><rect x="12" y="7" width="3" height="15" fill="var(--accent-color)" /></g>
        <g style={{ animation: 'pixel-chime-swing 3s ease-in-out infinite alternate', transformOrigin: 'top center', animationDelay: '-1s' }}><rect x="18" y="7" width="3" height="20" fill="var(--accent-color)" style={{ opacity: 0.8 }}/></g>
        <g style={{ animation: 'pixel-chime-swing 3s ease-in-out infinite alternate', transformOrigin: 'top center', animationDelay: '-0.5s' }}><rect x="24" y="7" width="3" height="12" fill="var(--accent-color)" style={{ opacity: 0.6 }}/></g>
    </PixelArtSVG>
);

const CuckooClockAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="10" y="10" width="20" height="20" fill="var(--text-secondary)" />
        <rect x="5" y="8" width="30" height="2" fill="var(--border-color)" />
        <rect x="15" y="5" width="10" height="5" fill="var(--border-color)" />
        <rect x="16" y="18" width="8" height="8" fill="var(--bg-secondary)" />
        <rect x="18" y="16" width="4" height="2" fill="var(--bg-primary)" />
        <g style={{ animation: 'pixel-cuckoo 5s steps(1, end) infinite' }}><rect x="18" y="14" width="4" height="2" fill="var(--accent-color)" /></g>
        <rect x="19" y="30" width="2" height="8" fill="var(--border-color)" style={{ animation: 'pixel-pendulum-swing 2s ease-in-out infinite alternate', transformOrigin: 'top center' }}/>
    </PixelArtSVG>
);

const VinylPlayerAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="5" y="30" width="30" height="5" fill="var(--border-color)" />
        <g style={{ animation: 'pixel-record-spin 4s linear infinite', transformOrigin: '20px 20px' }} >
            <rect x="10" y="10" width="20" height="20" fill="var(--text-secondary)" />
            <rect x="16" y="16" width="8" height="8" fill="var(--accent-color)" />
        </g>
        <rect x="30" y="8" width="2" height="10" fill="var(--text-secondary)" style={{ animation: 'pixel-tonearm-bob 1.5s ease-in-out infinite' }}/>
    </PixelArtSVG>
);

const SwingingBulbAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <g style={{ animation: 'pixel-bulb-swing 4s ease-in-out infinite alternate', transformOrigin: 'top center' }}>
            <rect x="19" y="5" width="2" height="15" fill="var(--border-color)" />
            <rect x="15" y="20" width="10" height="4" fill="var(--text-secondary)" />
            <rect x="12" y="24" width="16" height="8" fill="var(--accent-color)" style={{ animation: 'pixel-bulb-flicker 1.5s steps(1, end) infinite' }}/>
        </g>
    </PixelArtSVG>
);

const TerrariumAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="5" y="35" width="30" height="3" fill="var(--text-secondary)" />
        <rect x="8" y="10" width="24" height="25" fill="var(--link-color)" opacity="0.2" />
        <rect x="10" y="30" width="20" height="5" fill="var(--border-color)" />
        <rect x="15" y="12" width="1" height="2" fill="var(--link-color)" opacity="0.5" style={{ animation: 'pixel-drip 5s linear infinite -2s' }} />
        <g style={{ animation: 'pixel-butterfly-move 8s ease-in-out infinite' }}>
            <rect x="17" y="15" width="2" height="4" fill="var(--accent-color)" style={{ animation: 'pixel-wing-flap 0.5s ease-in-out infinite', transformOrigin: 'right' }}/>
            <rect x="19" y="15" width="2" height="4" fill="var(--accent-color)" style={{ animation: 'pixel-wing-flap 0.5s ease-in-out infinite reverse', transformOrigin: 'left' }}/>
        </g>
    </PixelArtSVG>
);

const GardenerAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="25" y="30" width="8" height="6" fill="var(--text-secondary)" />
        <g style={{ animation: 'pixel-plant-perk 4s ease-in-out infinite' }}>
            <rect x="28" y="25" width="2" height="5" fill="var(--accent-color)" />
            <rect x="26" y="22" width="6" height="3" fill="var(--accent-color)" style={{ opacity: 0.8 }}/>
        </g>
        <rect x="10" y="24" width="6" height="12" fill="var(--text-primary)" />
        <rect x="9" y="18" width="8" height="6" fill="var(--border-color)" />
        <g style={{ animation: 'pixel-water-pour 4s ease-in-out infinite' }}>
          <rect x="15" y="26" width="8" height="5" fill="var(--border-color)" />
          <rect x="22" y="27" width="3" height="1" fill="var(--border-color)" />
        </g>
        <rect x="24" y="28" width="1" height="1" fill="var(--link-color)" style={{ animation: 'pixel-water-drop 2s linear infinite', animationDelay: '0s' }} />
        <rect x="25" y="28" width="1" height="1" fill="var(--link-color)" style={{ animation: 'pixel-water-drop 2s linear infinite', animationDelay: '-1s' }} />
    </PixelArtSVG>
);

const DogPlayingAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 50 40" className="w-40 h-36">
        <rect x="0" y="35" width="50" height="5" fill="var(--border-color)" />
        <g style={{ animation: 'pixel-dog-run 1s steps(4, end) infinite' }}>
            <rect x="10" y="25" width="12" height="10" fill="var(--text-secondary)" />
            <rect x="22" y="28" width="5" height="4" fill="var(--text-secondary)" />
            <rect x="11" y="32" width="3" height="3" fill="var(--text-secondary)" style={{ opacity: 0.8 }}/>
            <rect x="17" y="32" width="3" height="3" fill="var(--text-secondary)" style={{ opacity: 0.8 }}/>
            <rect x="5" y="26" width="5" height="2" fill="var(--text-secondary)" style={{ animation: 'pixel-tail-wag 0.5s ease-in-out infinite', transformOrigin: 'right' }}/>
        </g>
        <rect x="40" y="32" width="4" height="4" fill="var(--accent-color)" style={{ animation: 'pixel-ball-bounce 1s ease-in-out infinite' }}/>
    </PixelArtSVG>
);

const BirdOnBranchAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <rect x="0" y="25" width="40" height="4" fill="var(--text-secondary)" style={{ animation: 'pixel-branch-sway 5s ease-in-out infinite', transformOrigin: 'center' }} />
        <g transform="translate(15 15)">
            <rect x="0" y="0" width="8" height="10" fill="var(--link-color)" />
            <rect x="8" y="2" width="4" height="4" fill="var(--link-color)" style={{ opacity: 0.8 }}/>
            <rect x="1" y="10" width="2" height="2" fill="var(--accent-color)" />
            <rect x="5" y="10" width="2" height="2" fill="var(--accent-color)" />
            <rect x="12" y="3" width="3" height="2" fill="var(--accent-color)" style={{ animation: 'pixel-bird-chirp 2s steps(2, end) infinite' }}/>
        </g>
        <rect x="30" y="20" width="8" height="5" fill="var(--border-color)" />
    </PixelArtSVG>
);

const GuitarPlayerAnimation: React.FC<AnimationProps> = () => (
    <PixelArtSVG viewBox="0 0 40 40" className="w-36 h-36">
        <g>
          <rect x="20" y="25" width="10" height="12" fill="var(--text-secondary)" />
          <rect x="21" y="37" width="3" height="2" fill="var(--text-primary)" style={{ animation: 'pixel-foot-tap 1s steps(2, end) infinite' }}/>
        </g>
        <rect x="18" y="15" width="8" height="12" fill="var(--text-primary)" />
        <rect x="17" y="9" width="10" height="6" fill="var(--border-color)" />
        <rect x="10" y="20" width="10" height="12" fill="var(--accent-color)" />
        <rect x="14" y="12" width="2" height="8" fill="var(--text-secondary)" />
        <rect x="16" y="24" width="4" height="3" fill="var(--border-color)" style={{ animation: 'pixel-guitar-strum 0.5s ease-in-out infinite' }}/>
        <g style={{ animation: 'pixel-music-note-rise 3s linear infinite' }}>
          <rect x="5" y="15" width="2" height="2" fill="var(--text-primary)" />
          <rect x="7" y="13" width="2" height="4" fill="var(--text-primary)" />
        </g>
    </PixelArtSVG>
);


// --- Main Component ---

const ALL_ANIMATIONS: React.FC<AnimationProps>[] = [
    CampfireAnimation, ReadingAnimation, SnowmanAnimation, SailingAnimation,
    SleepingCatAnimation, BonsaiAnimation, UfoAnimation, RainyWindowAnimation,
    CoffeeAnimation, FirefliesAnimation, PaperPlaneAnimation, MagicPortalAnimation,
    PottedPlantAnimation, AquariumAnimation, RocketAnimation, WindChimesAnimation,
    CuckooClockAnimation, VinylPlayerAnimation, SwingingBulbAnimation, TerrariumAnimation,
    GardenerAnimation, DogPlayingAnimation, BirdOnBranchAnimation, GuitarPlayerAnimation
];

const SituationalAnimation: React.FC<AnimationProps> = ({ themeId }) => {
    const [animationIndex, setAnimationIndex] = useState(0);

    useEffect(() => {
        const hoursSinceEpoch = Math.floor(new Date().getTime() / (1000 * 60 * 60));
        const twoHourBlockIndex = Math.floor(hoursSinceEpoch / 2);
        setAnimationIndex(twoHourBlockIndex % ALL_ANIMATIONS.length);
    }, []);
    
    const AnimationComponent = useMemo(() => ALL_ANIMATIONS[animationIndex], [animationIndex]);

    return (
        <div
            className="relative mt-8 flex justify-end opacity-70 pointer-events-none"
            aria-hidden="true"
        >
            <AnimationComponent themeId={themeId} />
        </div>
    );
};

export default SituationalAnimation;