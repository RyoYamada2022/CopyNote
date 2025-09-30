import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { themes } from '../themes';
import type { Theme } from '../themes';

// --- Color Conversion Utilities ---
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => `0${Math.round(c).toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    s /= 100; v /= 100;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r=0, g=0, b=0;
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
};


interface PaletteSuggestion {
  title: string;
  colors: string[];
}
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

// Helper to generate professional, theme-aware color suggestions
const generateSuggestions = (hsv: {h: number, s: number, v: number}, theme?: Theme): PaletteSuggestion[] => {
    const { h, s, v } = hsv;
    const palettes: PaletteSuggestion[] = [];

    // Helper to convert HSV to hex string
    const hsvToHexString = (h: number, s: number, v: number): string => {
        const c = hsvToRgb(h, s, v);
        return rgbToHex(c.r, c.g, c.b);
    };

    // --- Palette 1: Monochromatic & Tonal ---
    // Provides harmonious variations of the current color by altering saturation and value.
    const tonalColors = [
        hsvToHexString(h, clamp(s, 10, 100), clamp(v + 15, 0, 100)), // Lighter
        hsvToHexString(h, clamp(s, 10, 100), clamp(v - 15, 0, 100)), // Darker
        hsvToHexString(h, clamp(s - 20, 10, 100), v), // Desaturated
        hsvToHexString(h, clamp(s, 10, 100), clamp(v + 30, 0, 100)), // Much Lighter
        hsvToHexString(h, clamp(s, 10, 100), clamp(v - 30, 0, 100)), // Much Darker
        hsvToHexString(h, clamp(s - 40, 10, 100), v), // More Desaturated
    ];
    palettes.push({ title: 'Tonos y Matices', colors: [...new Set(tonalColors)] });


    // --- Palette 2: Theme-Aligned Palette ---
    // Generates colors that blend well with the current UI theme.
    if (theme) {
        const themeColors: string[] = [];
        const baseColors = [
            theme.colors.accentColor,
            theme.colors.bgPrimary,
            theme.colors.textPrimary
        ];

        baseColors.forEach(hex => {
            const rgb = hexToRgb(hex);
            if (rgb) {
                const baseHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                // Add a slightly lighter and darker version of each theme color
                themeColors.push(hsvToHexString(baseHsv.h, baseHsv.s, clamp(baseHsv.v + 10, 5, 95)));
                themeColors.push(hsvToHexString(baseHsv.h, baseHsv.s, clamp(baseHsv.v - 10, 5, 95)));
            }
        });
        palettes.push({ title: 'Acorde al Tema', colors: [...new Set(themeColors)] });
    }
    
    // --- Palette 3: Soft Harmonies ---
    // Creates aesthetically pleasing combinations that are less contrasting than complementary colors.
    const softHarmonyColors = [
        // Analogous: Colors adjacent on the color wheel
        hsvToHexString((h + 25) % 360, s, v),
        hsvToHexString((h - 25 + 360) % 360, s, v),
        // Split-Complementary: Less intense than a direct complement
        hsvToHexString((h + 150) % 360, s, v),
        hsvToHexString((h + 210) % 360, s, v),
         // Triadic but with adjusted saturation/value for softness
        hsvToHexString((h + 120) % 360, clamp(s - 10, 20, 100), clamp(v - 10, 20, 100)),
        hsvToHexString((h + 240) % 360, clamp(s - 10, 20, 100), clamp(v - 10, 20, 100)),
    ];
    palettes.push({ title: 'Armonías Suaves', colors: [...new Set(softHarmonyColors)] });

    return palettes;
};


interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
  onClose: () => void;
  themeId: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose, themeId }) => {
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
  const [hex, setHex] = useState(color);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  
  const activeTheme = themes.find(t => t.id === themeId);
  const suggestions = useMemo(() => generateSuggestions(hsv, activeTheme), [hsv, activeTheme]);

  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedColors = localStorage.getItem('copyNoteSavedColors');
    if (storedColors) {
      setSavedColors(JSON.parse(storedColors));
    }
  }, []);

  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHsv(newHsv);
      setHex(color.toUpperCase());
    }
  }, [color]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHex = e.target.value.toUpperCase();
    if (!newHex.startsWith('#')) {
      newHex = `#${newHex}`;
    }
    setHex(newHex);
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      const rgb = hexToRgb(newHex);
      if (rgb) {
        const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setHsv(newHsv);
        onChange(newHex);
      }
    }
  };
  
  const updateColor = useCallback((newHsv: { h: number; s: number; v: number }) => {
    const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
    setHex(newHex);
    onChange(newHex);
  }, [onChange]);


  const handleSaturationMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!saturationRef.current) return;
    const rect = saturationRef.current.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
        let x = moveEvent.clientX - rect.left;
        let y = moveEvent.clientY - rect.top;
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));
        
        const s = (x / rect.width) * 100;
        const v = 100 - (y / rect.height) * 100;
        const newHsv = { ...hsv, s, v };
        setHsv(newHsv);
        updateColor(newHsv);
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    handleMouseMove(e.nativeEvent);
  };
  
  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
        let y = moveEvent.clientY - rect.top;
        y = Math.max(0, Math.min(y, rect.height));
        const h = (y / rect.height) * 360;
        const newHsv = { ...hsv, h };
        setHsv(newHsv);
        updateColor(newHsv);
    };
    
    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    handleMouseMove(e.nativeEvent);
  };

  const handleSaveColor = () => {
    if (!savedColors.includes(hex)) {
      const newSavedColors = [hex, ...savedColors].slice(0, 18); // Limit to 18 swatches
      setSavedColors(newSavedColors);
      localStorage.setItem('copyNoteSavedColors', JSON.stringify(newSavedColors));
    }
  };

  const handleSwatchClick = (selectedColor: string) => {
    onChange(selectedColor);
  };

  return (
    <div 
        className="bg-[#28292c] p-3 rounded-lg shadow-2xl border border-gray-600 w-64 text-gray-200 select-none"
        style={{ fontFamily: 'Roboto, sans-serif' }}
    >
        <div 
            ref={saturationRef}
            onMouseDown={handleSaturationMouseDown}
            className="w-full h-40 rounded-md cursor-crosshair relative"
            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
        >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, black, transparent)' }} />
            <div 
                className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ top: `${100 - hsv.v}%`, left: `${hsv.s}%`}} 
            />
        </div>

        <div className="flex items-center mt-3 gap-3">
            <div 
                ref={hueRef}
                onMouseDown={handleHueMouseDown}
                className="w-4 h-40 rounded-full cursor-pointer relative"
                style={{ background: 'linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'}}
            >
                <div 
                    className="absolute w-5 h-2 rounded-full bg-white/50 border border-white/80 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2"
                    style={{ top: `${(hsv.h / 360) * 100}%` }}
                />
            </div>
            <div className="flex-1 flex flex-col items-center justify-between h-40">
                <div className="w-full h-12 rounded-md" style={{ backgroundColor: hex }}></div>
                <div className="flex items-center bg-[#3c4043] rounded-md px-2 mt-2">
                    <span className="text-sm text-gray-400">#</span>
                    <input 
                        type="text"
                        value={hex.substring(1)}
                        onChange={handleHexChange}
                        className="w-full bg-transparent text-center text-sm p-1 focus:outline-none tracking-wider"
                    />
                </div>
                <div className="mt-auto w-full space-y-1.5">
                    <button 
                        onClick={handleSaveColor}
                        className="w-full px-4 py-2 text-sm font-medium text-yellow-400 rounded hover:bg-yellow-500/10"
                    >
                        Guardar color
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-300 rounded hover:bg-gray-700/50"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
          {suggestions.map(palette => (
            <div key={palette.title}>
                <p className="text-xs font-semibold text-gray-400 mb-2">{palette.title}</p>
                <div className="grid grid-cols-6 gap-2">
                    {palette.colors.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSwatchClick(suggestion)}
                            className="w-full h-8 rounded-full border border-white/20 transition-transform hover:scale-110"
                            style={{ backgroundColor: suggestion }}
                            aria-label={`Select color ${suggestion}`}
                        />
                    ))}
                </div>
            </div>
          ))}
        </div>

        {savedColors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
                 <p className="text-xs font-semibold text-gray-400 mb-2">Guardados</p>
                <div className="grid grid-cols-6 gap-2">
                    {savedColors.map((savedColor) => (
                        <button
                            key={savedColor}
                            onClick={() => handleSwatchClick(savedColor)}
                            className="w-full h-8 rounded-md border border-white/20 transition-transform hover:scale-110"
                            style={{ backgroundColor: savedColor }}
                            aria-label={`Select color ${savedColor}`}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default ColorPicker;