export interface GeoValidation {
  lat: number;
  lng: number;
  radius_m: number;
}

export interface AnswerValidation {
  type: 'number_exact' | 'text_exact_ci' | 'text_any_of' | 'text_any_of_multi' | 'text_min_len';
  value?: number | string;
  valuesCI?: string[];
  min?: number;
  minMatches?: number;
}

export interface Stop {
  id: string;
  order: number;
  title: string;
  prompt: string;
  requires: string[];
  validation: {
    geo: GeoValidation;
    answer: AnswerValidation;
  };
  hints: string[];
  memory?: string;
  nextOnPass: boolean;
}

export interface Hunt {
  name: string;
  totalTimeLimitMin: number;
  hintPenaltyMin: number;
  hintPenaltyScheduleMin: number[];
  maxHintsPerStop: number;
}

export const huntConfig: Hunt = {
  name: "Adventure Awaits",
  totalTimeLimitMin: 120,
  hintPenaltyMin: 2,
  hintPenaltyScheduleMin: [2, 3, 5],
  maxHintsPerStop: 3
};

export const stops: Stop[] = [
  {
    id: "canada-place-sails",
    order: 1,
    title: "Canada Place Sails",
    prompt: "Start strong: pick a silly team name and snap a selfie with the sails behind you. Answer this: How many white sail peaks do you see?",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2887, lng: -123.1139, radius_m: 180 },
      answer: { type: "number_exact", value: 5 }
    },
    hints: [
      "Look up and count the big white peaks.",
      "Stand back so all the peaks fit in frame; count left to right.",
      "There are five peaks."
    ],
    memory: "Team name you chose",
    nextOnPass: true
  },
  {
    id: "the-drop",
    order: 2,
    title: "The Drop (Blue Raindrop)",
    prompt: "Tell a two-photo story: 'oh no rain → solved'. Answer: What colour is the sculpture?",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2899, lng: -123.1181, radius_m: 120 },
      answer: { type: "text_any_of", valuesCI: ["blue", "bright blue", "azure"] }
    },
    hints: [
      "It matches clear-sky ocean vibes.",
      "Same colour as many umbrellas on a sunny emoji set.",
      "It's blue."
    ],
    nextOnPass: true
  },
  {
    id: "olympic-cauldron",
    order: 3,
    title: "Olympic Cauldron",
    prompt: "Pods & podiums! Share a tiny win each (this week). Photo with the crossed glass pylons. Answer: How many big glass pylons hold the cauldron?",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2896, lng: -123.1169, radius_m: 120 },
      answer: { type: "number_exact", value: 4 }
    },
    hints: [
      "Count the major glass arms that meet at the top.",
      "Think of a star with equal legs.",
      "There are four pylons."
    ],
    nextOnPass: true
  },
  {
    id: "digital-orca",
    order: 4,
    title: "Digital Orca",
    prompt: "Find two tiny patterns nearby (reflections, tiles) and capture them in your photo. Answer: What animal is the sculpture?",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2894, lng: -123.1179, radius_m: 100 },
      answer: { type: "text_any_of", valuesCI: ["orca", "whale", "killer whale"] }
    },
    hints: [
      "It's a marine mammal that leaps.",
      "Pixelated **killer** detail.",
      "An orca (killer whale)."
    ],
    nextOnPass: true
  },
  {
    id: "marine-building",
    order: 5,
    title: "Marine Building Doors",
    prompt: "Pick a door 'mascot' creature that fits your duo today and explain why (just to each other). Photo the door panel. Answer: name the creature.",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2878, lng: -123.1154, radius_m: 120 },
      answer: { type: "text_any_of", valuesCI: ["fish","seahorse","octopus","crab","starfish","seagull","dolphin","turtle"] }
    },
    hints: [
      "Scan the brass panels for sea life silhouettes.",
      "Common ocean icons count (fish, crab, etc.).",
      "Type any one: fish, seahorse, octopus, crab, starfish, seagull, dolphin, or turtle."
    ],
    nextOnPass: true
  },
  {
    id: "angel-of-victory",
    order: 6,
    title: "Waterfront Station — Angel of Victory",
    prompt: "30 seconds of quiet looking around. Photo of the statue base. Answer: What is lifting the soldier?",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2859, lng: -123.1118, radius_m: 140 },
      answer: { type: "text_any_of", valuesCI: ["angel","wings","an angel","winged figure"] }
    },
    hints: [
      "Look for feathers behind him.",
      "A winged figure is helping.",
      "An angel (wings) lifts the soldier."
    ],
    nextOnPass: true
  },
  {
    id: "steam-clock",
    order: 7,
    title: "Gastown Steam Clock",
    prompt: "Guess the time (nearest minute), then compare. Photo with the clock. Answer: The year cast on the plaque (four digits).",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2840, lng: -123.1086, radius_m: 120 },
      answer: { type: "number_exact", value: 1977 }
    },
    hints: [
      "Check the metal plaque near the base.",
      "It's late-1970s.",
      "The plaque literally says 1977."
    ],
    nextOnPass: true
  },
  {
    id: "millennium-gate",
    order: 8,
    title: "Chinatown Millennium Gate",
    prompt: "Take a photo together under the gate. Answer: name any TWO of the dominant colours you see (comma-separated).",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2809, lng: -123.1069, radius_m: 180 },
      answer: { type: "text_any_of_multi", valuesCI: ["red","gold","blue","green","white"], minMatches: 2 }
    },
    hints: [
      "Think bright traditional colours.",
      "Pick any two from the primary accents.",
      "Any two of: red, gold, blue, green, white."
    ],
    nextOnPass: true
  },
  {
    id: "sam-kee",
    order: 9,
    title: "Sam Kee Building",
    prompt: "Snap the ultra-slim facade. Answer: type the building's two-word name.",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2809, lng: -123.1062, radius_m: 120 },
      answer: { type: "text_exact_ci", value: "sam kee" }
    },
    hints: [
      "World-famous for being extremely narrow.",
      "Two words; first is a short name, second is a three-letter family name.",
      "Type: Sam Kee."
    ],
    nextOnPass: true
  },
  {
    id: "mello-finish",
    order: 10,
    title: "Finish at Mello",
    prompt: "End on a sweet note. Photo of one ring donut and one filled (or any two treats). Answer: your 6-word headline for today.",
    requires: ["photo", "answer"],
    validation: {
      geo: { lat: 49.2803, lng: -123.0999, radius_m: 220 },
      answer: { type: "text_min_len", min: 6 }
    },
    hints: [
      "Six words only—hyphenated counts as one.",
      "Think: vibe + place + moment.",
      "Make exactly six words (no more, no less)."
    ],
    nextOnPass: false
  }
];
