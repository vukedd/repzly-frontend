import { definePreset } from '@primeng/themes';
import Material from '@primeng/themes/material';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';



const CustomMaterialTheme = definePreset(Nora, {
    // primitive: {

    //     // --- Keeping original definitions ---
    //     borderRadius: {
    //         none: '0',
    //         xs: '2px',
    //         sm: '4px',
    //         md: '6px',
    //         lg: '10px',
    //         xl: '16px',
    //         xxl: '26px',
    //     },
    //     emerald: {
    //         50: '#ecfdf5',
    //         100: '#d1fae5',
    //         200: '#a7f3d0',
    //         300: '#6ee7b7',
    //         400: '#34d399',
    //         500: '#10b981',
    //         600: '#059669',
    //         700: '#047857',
    //         800: '#065f46',
    //         900: '#064e3b',
    //         950: '#022c22',
    //     }
    // },
    // font: {
    //     family: '"Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    // },

    // semantic: {
    //     // --- Keeping original semantic definitions ---
    //     transitionDuration: '0.15s', // Slightly faster transitions
    //     focusRing: {
    //         width: '2px',
    //         style: 'solid',
    //         color: '{primary.color}',
    //         offset: '2px',
    //         // Sharper focus shadow using primary color
    //         shadow: '0 0 0 3px color-mix(in srgb, {primary.color} 40%, transparent)',
    //     },
    //     iconSize: '1.25rem',
    //     primary: { // Still using emerald as primary
    //         50: '{emerald.50}', 100: '{emerald.100}', 200: '{emerald.200}',
    //         300: '{emerald.300}', 400: '{emerald.400}', 500: '{emerald.500}',
    //         600: '{emerald.600}', 700: '{emerald.700}', 800: '{emerald.800}',
    //         900: '{emerald.900}', 950: '{emerald.950}',
    //     },
    //     formField: {
    //         paddingX: '1rem', paddingY: '0.75rem',
    //         sm: { fontSize: '0.875rem', paddingX: '0.75rem', paddingY: '0.5rem' },
    //         lg: { fontSize: '1.125rem', paddingX: '1.25rem', paddingY: '0.875rem' },
    //         borderRadius: '{border.radius.sm}', // Slightly sharper radius for contrast feel
    //         focusRing: {
    //             width: '0', style: 'none', color: 'transparent', offset: '0',
    //             // Sharper form field focus shadow
    //             shadow: '0 0 0 3px color-mix(in srgb, {primary.color} 35%, transparent)',
    //         },
    //         transitionDuration: '{transition.duration}',
    //     },
    //     list: {
    //         padding: '0.5rem 0.5rem', gap: '2px', // Tighter list gap
    //         header: { padding: '0.75rem 1rem 0.5rem 1rem' },
    //         option: { padding: '0.75rem 1rem', borderRadius: '{border.radius.sm}' }, // Sharper radius
    //         optionGroup: { padding: '0.75rem 1rem', fontWeight: '600' },
    //     },
    //     overlay: {
    //         select: {
    //             borderRadius: '{border.radius.md}', // Slightly sharper overlay radius
    //             shadow: '0 8px 16px -4px rgba(0, 0, 0, 0.4), 0 6px 10px -6px rgba(0, 0, 0, 0.3)', // Darker shadow
    //         },
    //         popover: {
    //             borderRadius: '{border.radius.lg}',
    //             padding: '1rem',
    //             shadow: '0 15px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)', // Darker shadow
    //         },
    //         modal: {
    //             borderRadius: '{border.radius.xl}',
    //             padding: '1.75rem',
    //             shadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', // Darker shadow
    //         },
    //         navigation: {
    //             shadow: '0 8px 12px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)', // Darker shadow
    //         }
    //     },
    //     // --- Color Scheme Definition ---
    //     colorScheme: {
    //         // --- Light theme definition (unchanged) ---
    //         // --- Light theme definition (darker version) ---
    //     }
    // }

    semantic: {
        font: {
            family: '"Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
        iconSize: '1.2rem',
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
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        },
        colorScheme: {
            
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            }
        }
    }
});

export default CustomMaterialTheme;