/**
 * Radix Theme Configuration
 * Configure your app's visual theme using Radix UI Themes
 */

export const themeConfig = {
    // Accent color for primary actions and highlights
    // Options: tomato, red, ruby, crimson, pink, plum, purple, violet, iris, 
    //          indigo, blue, cyan, teal, jade, green, grass, brown, orange, 
    //          amber, yellow, lime, mint, sky
    accentColor: 'blue' as const,

    // Gray scale for text, borders, and backgrounds
    // Options: auto, gray, mauve, slate, sage, olive, sand, gold, bronze
    grayColor: 'slate' as const,

    // Border radius for rounded components
    // Options: none, small, medium, large, full
    radius: 'medium' as const,

    // Overall component scaling
    // Options: 90%, 95%, 100%, 105%, 110%
    scaling: '100%' as const,

    // Visual appearance mode
    // Options: inherit, light, dark
    appearance: 'inherit' as const,

    // Panel background style
    // Options: solid, transparent
    panelBackground: 'solid' as const,
} as const;

