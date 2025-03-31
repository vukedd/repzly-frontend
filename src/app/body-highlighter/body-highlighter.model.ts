// src/app/body-highlighter/body-highlighter.model.ts

// Existing interface for highlighting data
export interface BodyPartHighlight {
    slug: string;
    intensity: number;
  }
  
  // --- NEW: Interface for the SVG path definitions ---
  export interface BodyPartDefinition {
    slug: BodyPartSlug; // Must match slugs used in BodyPartHighlight and SVG element IDs/data-slugs
    // color?: string; // We'll likely ignore this and use our component's color logic
    pathArray: string[]; // Array of SVG 'd' attribute strings
  }
  // --- End NEW ---
  
  // You might still want an enum or const array for known slugs if helpful
  export const BodyPartSlugs = [
    // Add all slugs from your definition data here...
    'chest-right', 'chest-left', 'obliques-left', 'obliques-right', 'abs-upper',
    'abs-lower', 'biceps-left', 'biceps-right', 'triceps-right-front', 'triceps-left-front',
    'neck-right-front', 'neck-left-front', 'trapezius-left-front', 'trapezius-right-front',
    'deltoids-left-front', 'deltoids-right-front', 'adductors-left-front', 'adductors-right-front',
    'quadriceps-left', 'quadriceps-right', 'knees-left', 'knees-right', 'tibialis-left',
    'tibialis-right', 'calves-left-front', 'calves-right-front', 'forearm-left-front',
    'forearm-right-front', 'hands-left-front', 'hands-right-front', 'ankles-left-front',
    'ankles-right-front', 'feet-left-front', 'feet-right-front', 'head-front',
    // ... potentially add back view slugs later
    'head-back', 'neck-left-back', 'neck-right-back', 'trapezius-left-back',
  'trapezius-right-back', 'deltoids-left-back', 'deltoids-right-back',
  'upper-back-left', 'upper-back-right', 'triceps-left-back', 'triceps-right-back',
  'lower-back-left', 'lower-back-right', 'forearm-left-back', 'forearm-right-back',
  'hip-left', 'hip-right', 'gluteal-left', 'gluteal-right',
  'hamstring-left', 'hamstring-right', 'adductors-left-back', 'adductors-right-back',
  'calves-left-back', 'calves-right-back', 'ankles-left-back', 'ankles-right-back',
  'feet-left-back', 'feet-right-back', 'hands-left-back', 'hands-right-back','lats','upper-back','deltoids-back','triceps-back','lower-back','forearm-back','glutes','hamstrings',
  'adductors-back','calves-back'

  ] as const;
  
  export type BodyPartSlug = typeof BodyPartSlugs[number];