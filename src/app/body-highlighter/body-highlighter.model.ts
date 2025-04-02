// src/app/body-highlighter/body-highlighter.model.ts

// Existing interface for highlighting data
export interface BodyPartHighlight {
    slug: string;
    intensity: number;
  }
  
  // --- NEW: Interface for the SVG path definitions ---
  export interface BodyPartDefinition {
name: any;
    slug: BodyPartSlug; // Must match slugs used in BodyPartHighlight and SVG element IDs/data-slugs
    // color?: string; // We'll likely ignore this and use our component's color logic
    pathArray: string[]; // Array of SVG 'd' attribute strings
  }
  // --- End NEW ---
  
  // You might still want an enum or const array for known slugs if helpful
  export const BodyPartSlugs = [
    // Add all slugs from your definition data here...
    'neck-front','front-deltoid','side-deltoid','triceps-front','tibialis','calves-front','chest','biceps','trapezius-front','forearms-front','abs','quads','adductors-front','abductors-front',
    'knees','obliques',
    // ... potentially add back view slugs later
    'lats','upper-back','deltoids-back','triceps-back','lower-back','forearm-back','glutes','hamstrings',
  'adductors-back','calves-back'

  ] as const;
  
  export type BodyPartSlug = typeof BodyPartSlugs[number];