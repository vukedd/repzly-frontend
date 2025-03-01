import { definePreset } from '@primeng/themes';
import Material from '@primeng/themes/material';

const CustomMaterialTheme = definePreset(Material, {
    primitive: {
        // Keep the border radius values but make them more consistent
        borderRadius: {
            none: "0",
            xs: "2px",
            sm: "4px",
            md: "8px",
            lg: "12px",
            xl: "16px"
        },
        // Define a signature color palette with vibrant indigo as primary
        indigo: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b"
        },
        // Add complementary purples for accents
        purple: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87",
            950: "#3b0764"
        },
        // Teal for secondary accents
        teal: {
            50: "#f0fdfa",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
            950: "#042f2e"
        }
    },
    semantic: {
        // Faster transitions for a more responsive feel
        transitionDuration: "0.15s",
        // More pronounced focus ring for accessibility
        focusRing: {
            width: "2px",
            style: "solid",
            color: "{primary.color}",
            offset: "2px",
            shadow: "0 0 0 4px rgba(99, 102, 241, 0.2)"
        },
        // Optimized icon size
        iconSize: "1.125rem",
        // Define primary color based on indigo
        primary: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b"
        },
        // Enhanced form fields with better spacing
        formField: {
            paddingX: "0.875rem",
            paddingY: "0.625rem",
            sm: {
                fontSize: "0.875rem",
                paddingX: "0.75rem",
                paddingY: "0.5rem"
            },
            lg: {
                fontSize: "1.125rem",
                paddingX: "1rem",
                paddingY: "0.75rem"
            },
            borderRadius: "{border.radius.md}",
            focusRing: {
                width: "0",
                style: "none",
                color: "transparent",
                offset: "0",
                shadow: "0 0 0 3px rgba(99, 102, 241, 0.25)"
            },
            transitionDuration: "{transition.duration}"
        },
        // Refined list styling
        list: {
            padding: "0.375rem 0.375rem",
            gap: "3px",
            header: {
                padding: "0.625rem 1rem 0.375rem 1rem"
            },
            option: {
                padding: "0.625rem 0.875rem",
                borderRadius: "{border.radius.md}"
            },
            optionGroup: {
                padding: "0.625rem 0.875rem",
                fontWeight: "600"
            }
        },
        // Better modal styles with more generous spacing
        overlay: {
            select: {
                borderRadius: "{border.radius.md}",
                shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
            },
            popover: {
                borderRadius: "{border.radius.lg}",
                padding: "0.875rem",
                shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
            },
            modal: {
                borderRadius: "{border.radius.xl}",
                padding: "1.5rem",
                shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            },
            navigation: {
                shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
            }
        },
        // Color schemes for light and dark modes
        colorScheme: {
            light: {
                surface: {
                    0: "#ffffff",
                    50: "#f9fafc",
                    100: "#f0f2f5",
                    200: "#e2e6eb",
                    300: "#d0d6de",
                    400: "#b0b9c6",
                    500: "#909cad",
                    600: "#707f94",
                    700: "#566275",
                    800: "#3c4553",
                    900: "#252a34",
                    950: "#12141a"
                },
                primary: {
                    color: "{primary.600}",
                    contrastColor: "#ffffff",
                    hoverColor: "{primary.700}",
                    activeColor: "{primary.800}"
                },
                highlight: {
                    background: "rgba(99, 102, 241, 0.1)",
                    focusBackground: "rgba(99, 102, 241, 0.15)",
                    color: "{primary.700}",
                    focusColor: "{primary.800}"
                },
                mask: {
                    background: "rgba(0,0,0,0.45)",
                    color: "{surface.200}"
                },
                formField: {
                    background: "{surface.0}",
                    disabledBackground: "{surface.100}",
                    filledBackground: "{surface.50}",
                    filledHoverBackground: "rgba(99, 102, 241, 0.04)",
                    filledFocusBackground: "rgba(99, 102, 241, 0.06)",
                    borderColor: "{surface.300}",
                    hoverBorderColor: "{surface.400}",
                    focusBorderColor: "{primary.color}",
                    invalidBorderColor: "#f87171",
                    color: "{surface.900}",
                    disabledColor: "{surface.500}",
                    placeholderColor: "{surface.500}",
                    invalidPlaceholderColor: "#ef4444",
                    floatLabelColor: "{surface.500}",
                    floatLabelFocusColor: "{primary.600}",
                    floatLabelActiveColor: "{surface.600}",
                    floatLabelInvalidColor: "#ef4444",
                    iconColor: "{surface.500}",
                    shadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                },
                text: {
                    color: "{surface.900}",
                    hoverColor: "{surface.950}",
                    mutedColor: "{surface.600}",
                    hoverMutedColor: "{surface.700}"
                },
                content: {
                    background: "{surface.0}",
                    hoverBackground: "{surface.50}",
                    borderColor: "{surface.200}",
                    color: "{text.color}",
                    hoverColor: "{text.hover.color}"
                },
                overlay: {
                    select: {
                        background: "{surface.0}",
                        borderColor: "{surface.200}",
                        color: "{text.color}"
                    },
                    popover: {
                        background: "{surface.0}",
                        borderColor: "{surface.200}",
                        color: "{text.color}"
                    },
                    modal: {
                        background: "{surface.0}",
                        borderColor: "{surface.200}",
                        color: "{text.color}"
                    }
                },
                list: {
                    option: {
                        focusBackground: "rgba(99, 102, 241, 0.06)",
                        selectedBackground: "rgba(99, 102, 241, 0.1)",
                        selectedFocusBackground: "rgba(99, 102, 241, 0.15)",
                        color: "{text.color}",
                        focusColor: "{primary.700}",
                        selectedColor: "{primary.700}",
                        selectedFocusColor: "{primary.800}",
                        icon: {
                            color: "{surface.500}",
                            focusColor: "{primary.600}"
                        }
                    },
                    optionGroup: {
                        background: "transparent",
                        color: "{text.muted.color}"
                    }
                },
                navigation: {
                    item: {
                        focusBackground: "rgba(99, 102, 241, 0.06)",
                        activeBackground: "rgba(99, 102, 241, 0.1)",
                        color: "{text.color}",
                        focusColor: "{primary.700}",
                        activeColor: "{primary.700}",
                        icon: {
                            color: "{surface.500}",
                            focusColor: "{primary.600}",
                            activeColor: "{primary.600}"
                        }
                    },
                    submenuLabel: {
                        background: "transparent",
                        color: "{text.muted.color}"
                    },
                    submenuIcon: {
                        color: "{surface.500}",
                        focusColor: "{primary.600}",
                        activeColor: "{primary.600}"
                    }
                }
            },
            dark: {
                surface: {
                    0: "#ffffff",
                    50: "#f3f4f6",
                    100: "#e5e7eb",
                    200: "#d1d5db",
                    300: "#9ca3af",
                    400: "#6b7280",
                    500: "#4b5563",
                    600: "#374151",
                    700: "#1f2937",
                    800: "#111827",
                    900: "#030712",
                    950: "#0d0d0d"
                },
                primary: {
                    color: "{primary.400}",
                    contrastColor: "#111827",
                    hoverColor: "{primary.300}",
                    activeColor: "{primary.200}"
                },
                highlight: {
                    background: "rgba(129, 140, 248, 0.16)",
                    focusBackground: "rgba(129, 140, 248, 0.24)",
                    color: "{primary.200}",
                    focusColor: "{primary.100}"
                },
                mask: {
                    background: "rgba(0,0,0,0.7)",
                    color: "{surface.200}"
                },
                formField: {
                    background: "{surface.800}",
                    disabledBackground: "{surface.700}",
                    filledBackground: "{surface.700}",
                    filledHoverBackground: "rgba(129, 140, 248, 0.06)",
                    filledFocusBackground: "rgba(129, 140, 248, 0.08)",
                    borderColor: "{surface.600}",
                    hoverBorderColor: "{surface.500}",
                    focusBorderColor: "{primary.color}",
                    invalidBorderColor: "#f87171",
                    color: "{surface.50}",
                    disabledColor: "{surface.400}",
                    placeholderColor: "{surface.400}",
                    invalidPlaceholderColor: "#fca5a5",
                    floatLabelColor: "{surface.400}",
                    floatLabelFocusColor: "{primary.color}",
                    floatLabelActiveColor: "{surface.300}",
                    floatLabelInvalidColor: "#fca5a5",
                    iconColor: "{surface.400}",
                    shadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
                },
                text: {
                    color: "{surface.50}",
                    hoverColor: "{surface.0}",
                    mutedColor: "{surface.300}",
                    hoverMutedColor: "{surface.200}"
                },
                content: {
                    background: "{surface.800}",
                    hoverBackground: "{surface.700}",
                    borderColor: "{surface.600}",
                    color: "{text.color}",
                    hoverColor: "{text.hover.color}"
                },
                overlay: {
                    select: {
                        background: "{surface.800}",
                        borderColor: "{surface.600}",
                        color: "{text.color}"
                    },
                    popover: {
                        background: "{surface.800}",
                        borderColor: "{surface.600}",
                        color: "{text.color}"
                    },
                    modal: {
                        background: "{surface.800}",
                        borderColor: "{surface.600}",
                        color: "{text.color}"
                    }
                },
                list: {
                    option: {
                        focusBackground: "rgba(129, 140, 248, 0.08)",
                        selectedBackground: "rgba(129, 140, 248, 0.16)",
                        selectedFocusBackground: "rgba(129, 140, 248, 0.24)",
                        color: "{text.color}",
                        focusColor: "{primary.300}",
                        selectedColor: "{primary.300}",
                        selectedFocusColor: "{primary.200}",
                        icon: {
                            color: "{surface.400}",
                            focusColor: "{primary.400}"
                        }
                    },
                    optionGroup: {
                        background: "transparent",
                        color: "{text.muted.color}"
                    }
                },
                navigation: {
                    item: {
                        focusBackground: "rgba(129, 140, 248, 0.08)",
                        activeBackground: "rgba(129, 140, 248, 0.16)",
                        color: "{text.color}",
                        focusColor: "{primary.300}",
                        activeColor: "{primary.300}",
                        icon: {
                            color: "{surface.400}",
                            focusColor: "{primary.400}",
                            activeColor: "{primary.400}"
                        }
                    },
                    submenuLabel: {
                        background: "transparent",
                        color: "{text.muted.color}"
                    },
                    submenuIcon: {
                        color: "{surface.400}",
                        focusColor: "{primary.400}",
                        activeColor: "{primary.400}"
                    }
                }
            }
        }
    }
});

export default CustomMaterialTheme;