import { definePreset } from '@primeng/themes';
import Material from '@primeng/themes/material';

// Define a new Neutral Grey palette
const neutral = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
};

const ModernDarkContrastTheme = definePreset(Material, {
    primitive: {

        // --- Keeping original definitions ---
        borderRadius: {
            none: '0',
            xs: '2px',
            sm: '4px',
            md: '6px',
            lg: '10px',
            xl: '16px',
            xxl: '26px',
        },
        emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
        },
        violet: { /* ...violet colors... */ },
        amber: { /* ...amber colors... */ },
        slate: { /* ...slate colors... */ },
        blue: { /* ...blue colors... */ },
        // --- Add the neutral grey palette ---
        neutral: neutral,
    },
    font: {
        family: '"Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    },

    semantic: {
        // --- Keeping original semantic definitions ---
        transitionDuration: '0.15s', // Slightly faster transitions
        focusRing: {
            width: '2px',
            style: 'solid',
            color: '{primary.color}',
            offset: '2px',
            // Sharper focus shadow using primary color
            shadow: '0 0 0 3px color-mix(in srgb, {primary.color} 40%, transparent)',
        },
        iconSize: '1.25rem',
        primary: { // Still using emerald as primary
            50: '{emerald.50}', 100: '{emerald.100}', 200: '{emerald.200}',
            300: '{emerald.300}', 400: '{emerald.400}', 500: '{emerald.500}',
            600: '{emerald.600}', 700: '{emerald.700}', 800: '{emerald.800}',
            900: '{emerald.900}', 950: '{emerald.950}',
        },
        formField: {
            paddingX: '1rem', paddingY: '0.75rem',
            sm: { fontSize: '0.875rem', paddingX: '0.75rem', paddingY: '0.5rem' },
            lg: { fontSize: '1.125rem', paddingX: '1.25rem', paddingY: '0.875rem' },
            borderRadius: '{border.radius.sm}', // Slightly sharper radius for contrast feel
            focusRing: {
                width: '0', style: 'none', color: 'transparent', offset: '0',
                // Sharper form field focus shadow
                shadow: '0 0 0 3px color-mix(in srgb, {primary.color} 35%, transparent)',
            },
            transitionDuration: '{transition.duration}',
        },
        list: {
            padding: '0.5rem 0.5rem', gap: '2px', // Tighter list gap
            header: { padding: '0.75rem 1rem 0.5rem 1rem' },
            option: { padding: '0.75rem 1rem', borderRadius: '{border.radius.sm}' }, // Sharper radius
            optionGroup: { padding: '0.75rem 1rem', fontWeight: '600' },
        },
        overlay: {
            select: {
                borderRadius: '{border.radius.md}', // Slightly sharper overlay radius
                shadow: '0 8px 16px -4px rgba(0, 0, 0, 0.4), 0 6px 10px -6px rgba(0, 0, 0, 0.3)', // Darker shadow
            },
            popover: {
                borderRadius: '{border.radius.lg}',
                padding: '1rem',
                shadow: '0 15px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)', // Darker shadow
            },
            modal: {
                borderRadius: '{border.radius.xl}',
                padding: '1.75rem',
                shadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', // Darker shadow
            },
            navigation: {
                shadow: '0 8px 12px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)', // Darker shadow
            }
        },
        // --- Color Scheme Definition ---
        colorScheme: {
            // --- Light theme definition (unchanged) ---
            // --- Light theme definition (darker version) ---
            light: {
                surface: {
                    0: '#f8fafc',       // Slightly off-white background (was pure white)
                    50: '#f1f5f9',      // Light surface color (darker than before)
                    100: '#e2e8f0',     // Darker light background
                    200: '#cbd5e1',     // Darker borders and dividers
                    300: '#94a3b8',     // Darker medium-light borders
                    400: '#64748b',     // Darker medium-light text
                    500: '#475569',     // Darker medium text
                    600: '#334155',     // Darker medium-dark text
                    700: '#1e293b',     // Same dark text
                    800: '#0f172a',     // Same very dark text
                    900: '#020617',     // Same almost black text
                    950: '#000209'      // Deepest color, nearly black
                },
                primary: {
                    color: '{primary.600}',      // Main primary color (emerald 600) - unchanged
                    contrastColor: '#ffffff',    // White text on primary buttons - unchanged
                    hoverColor: '{primary.700}', // Darker on hover - unchanged
                    activeColor: '{primary.800}' // Darkest when active - unchanged
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.500} 18%, transparent)',  // Slightly stronger emerald highlight
                    focusBackground: 'color-mix(in srgb, {primary.500} 28%, transparent)', // Stronger emerald highlight
                    color: '{primary.700}',      // Dark emerald text in highlighted areas - unchanged
                    focusColor: '{primary.800}'  // Darker emerald text in focused areas - unchanged
                },
                mask: {
                    background: 'rgba(0,0,0,0.6)',  // Darker semi-transparent overlay
                    color: '{surface.50}'           // Lighter text on mask for better contrast
                },
                formField: {
                    background: '{surface.50}',       // Slightly darker background (was surface.0)
                    disabledBackground: '{surface.100}', // Light gray when disabled - unchanged
                    filledBackground: '{surface.100}',   // Darker filled state (was surface.50)
                    filledHoverBackground: 'color-mix(in srgb, {primary.500} 7%, {surface.100})', // Adjusted for darker base
                    filledFocusBackground: 'color-mix(in srgb, {primary.500} 12%, {surface.100})', // Adjusted for darker base
                    borderColor: '{surface.300}',        // Medium-light border - unchanged
                    hoverBorderColor: '{surface.400}',   // Darker border on hover - unchanged
                    focusBorderColor: '{primary.color}', // Primary color border on focus - unchanged
                    invalidBorderColor: '#dc2626',       // Red border for invalid - unchanged
                    color: '{surface.800}',              // Very dark text - unchanged
                    disabledColor: '{surface.500}',      // Medium gray text when disabled - unchanged
                    placeholderColor: '{surface.500}',   // Medium gray placeholder text - unchanged
                    invalidPlaceholderColor: '#f87171',  // Light red placeholder when invalid - unchanged
                    floatLabelColor: '{surface.500}',    // Medium gray label - unchanged
                    floatLabelFocusColor: '{primary.color}', // Primary color label on focus - unchanged
                    floatLabelActiveColor: '{surface.600}',  // Medium-dark label when active - unchanged
                    floatLabelInvalidColor: '#b91c1c',   // Dark red label when invalid - unchanged
                    iconColor: '{surface.500}',          // Medium gray icons - unchanged
                    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' // Slightly stronger shadow
                },
                text: {
                    color: '{surface.800}',          // Very dark text - unchanged
                    hoverColor: '{surface.900}',     // Almost black on hover - unchanged
                    mutedColor: '{surface.600}',     // Medium-dark for muted text - unchanged
                    hoverMutedColor: '{surface.700}' // Dark for muted text on hover - unchanged
                },
                content: {
                    background: '{surface.50}',      // Slightly darker background (was surface.0)
                    hoverBackground: '{surface.100}', // Light gray on hover - unchanged
                    borderColor: '{surface.200}',   // Light borders - unchanged
                    color: '{text.color}',          // Using text color - unchanged
                    hoverColor: '{text.hoverColor}' // Using hover text color - unchanged
                },
                overlay: {
                    select: {
                        background: '{surface.50}',    // Slightly darker (was surface.0)
                        borderColor: '{surface.200}',  // Unchanged
                        color: '{text.color}'          // Unchanged
                    },
                    popover: {
                        background: '{surface.50}',    // Slightly darker (was surface.0)
                        borderColor: '{surface.200}',  // Unchanged
                        color: '{text.color}'          // Unchanged
                    },
                    modal: {
                        background: '{surface.50}',    // Slightly darker (was surface.0)
                        borderColor: '{surface.200}',  // Unchanged
                        color: '{text.color}'          // Unchanged
                    }
                },
                list: {
                    option: {
                        focusBackground: '{highlight.focusBackground}',  // Unchanged
                        selectedBackground: '{highlight.background}',    // Unchanged
                        selectedFocusBackground: 'color-mix(in srgb, {primary.500} 32%, transparent)', // Slightly stronger
                        color: '{text.color}',          // Unchanged
                        focusColor: '{highlight.focusColor}',  // Unchanged
                        selectedColor: '{highlight.color}',    // Unchanged
                        selectedFocusColor: '{highlight.focusColor}',  // Unchanged
                        icon: {
                            color: '{surface.500}',      // Unchanged
                            focusColor: '{primary.color}'  // Unchanged
                        }
                    },
                    optionGroup: {
                        background: 'transparent',     // Unchanged
                        color: '{text.mutedColor}'     // Unchanged
                    }
                },
                navigation: {
                    item: {
                        focusBackground: '{highlight.focusBackground}',  // Unchanged
                        activeBackground: '{highlight.background}',      // Unchanged
                        color: '{text.mutedColor}',      // Unchanged
                        focusColor: '{primary.color}',   // Unchanged
                        activeColor: '{primary.color}',  // Unchanged
                        icon: {
                            color: '{text.mutedColor}',     // Unchanged
                            focusColor: '{primary.color}',  // Unchanged
                            activeColor: '{primary.color}'  // Unchanged
                        }
                    },
                    submenuLabel: {
                        background: 'transparent',      // Unchanged
                        color: '{text.mutedColor}'      // Unchanged
                    },
                    submenuIcon: {
                        color: '{text.mutedColor}',     // Unchanged
                        focusColor: '{primary.color}',  // Unchanged
                        activeColor: '{primary.color}'  // Unchanged
                    }
                }
            },
            // --- Dark theme definition (PROPERLY REVERSED) ---
            dark: {
                // PROPERLY REVERSED: Now surface-0 will be the darkest color
                surface: {
                    0: '{neutral.50}',    // Darkest (#0a0a0a)
                    50: '{neutral.50}',   // (#171717)
                    100: '{neutral.100}',  // (#262626)
                    200: '{neutral.200}',  // (#404040)
                    300: '{neutral.300}',  // (#525252)
                    400: '{neutral.400}',  // (#737373)
                    500: '{neutral.500}',  // (#a3a3a3)
                    600: '{neutral.600}',  // (#d4d4d4)
                    700: '{neutral.700}',  // (#e5e5e5)
                    800: '{neutral.800}',  // (#f5f5f5)
                    900: '{neutral.900}',   // Lightest (#fafafa)
                    950: '{neutral.950}'    // Lightest (#fafafa)
                },

                primary: {
                    color: '{primary.400}', // Bright emerald #34d399
                    contrastColor: '{neutral.950}', // Very dark text #0a0a0a
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },

                highlight: {
                    background: 'color-mix(in srgb, {primary.color} 50%, transparent)',
                    focusBackground: 'color-mix(in srgb, {primary.color} 35%, transparent)',
                    color: '{neutral.950}', // Dark text on highlight background
                    focusColor: '{neutral.950}' // Darker text on focused highlight
                },

                mask: {
                    background: 'rgba(0,0,0,0.8)',
                    color: '{surface.500}' // Text on mask (#a3a3a3)
                },

                formField: {
                    background: '{surface.900}', // Main component bg (#262626)
                    disabledBackground: '{surface.950}', // Darker disabled bg (#171717)
                    filledBackground: '{surface.950}', // Darker filled bg (#171717)
                    filledHoverBackground: 'color-mix(in srgb, {primary.color} 8%, {surface.950})',
                    filledFocusBackground: 'color-mix(in srgb, {primary.color} 12%, {surface.950})',
                    borderColor: '{surface.700}', // Border (#525252)
                    hoverBorderColor: '{surface.600}', // Hover border (#737373)
                    focusBorderColor: '{primary.color}',
                    invalidBorderColor: '#f87171',
                    color: '{surface.100}', // Main text (#f5f5f5)
                    disabledColor: '{surface.500}', // Muted disabled (#a3a3a3)
                    placeholderColor: '{surface.500}', // Muted placeholder (#a3a3a3)
                    invalidPlaceholderColor: '#fb923c',
                    floatLabelColor: '{surface.500}',
                    floatLabelFocusColor: '{primary.color}',
                    floatLabelActiveColor: '{surface.400}', // Brighter active label (#d4d4d4)
                    floatLabelInvalidColor: '#f87171',
                    iconColor: '{surface.500}', // Icon color (#a3a3a3)
                    shadow: 'none'
                },

                text: {
                    color: '{surface.100}', // Main text (#f5f5f5)
                    hoverColor: '{surface.900}', // Hover text (#fafafa)
                    mutedColor: '{surface.500}', // Muted text (#a3a3a3)
                    hoverMutedColor: '{surface.400}' // Brighter muted hover (#d4d4d4)
                },

                content: {
                    background: '{surface.900}', // Component bg (#262626)
                    hoverBackground: '{surface.800}', // Hover bg (#404040)
                    borderColor: '{surface.700}', // Border (#525252)
                    color: '{text.color}',
                    hoverColor: '{text.hoverColor}'
                },

                overlay: {
                    select: { background: '{surface.900}', borderColor: '{surface.700}', color: '{text.color}' },
                    popover: { background: '{surface.900}', borderColor: '{surface.700}', color: '{text.color}' },
                    modal: { background: '{surface.900}', borderColor: '{surface.700}', color: '{text.color}' }
                },

                list: {
                    option: {
                        focusBackground: '{highlight.focusBackground}',
                        selectedBackground: '{highlight.background}',
                        selectedFocusBackground: 'color-mix(in srgb, {primary.color} 40%, transparent)',
                        color: '{text.color}', // Using text.color (#f5f5f5)
                        focusColor: '{surface.100}', // Brightest grey for focused option text (#fafafa)
                        selectedColor: '{highlight.color}', // Dark text on selected item bg
                        selectedFocusColor: '{highlight.focusColor}', // Darker text on selected focus item bg
                        icon: { color: '{surface.500}', focusColor: '{primary.color}' }
                    },
                    optionGroup: { background: 'transparent', color: '{text.mutedColor}' } // (#a3a3a3)
                },

                navigation: {
                    item: {
                        focusBackground: '{highlight.focusBackground}',
                        activeBackground: '{highlight.background}',
                        color: '{text.mutedColor}', // (#a3a3a3)
                        focusColor: '{primary.color}',
                        activeColor: '{primary.color}',
                        icon: { color: '{text.mutedColor}', focusColor: '{primary.color}', activeColor: '{primary.color}' }
                    },
                    submenuLabel: { background: 'transparent', color: '{text.mutedColor}' },
                    submenuIcon: { color: '{text.mutedColor}', focusColor: '{primary.color}', activeColor: '{primary.color}' }
                }
            }
        }
    }
});

export default ModernDarkContrastTheme;