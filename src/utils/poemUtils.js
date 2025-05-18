import { syllable } from 'syllable';

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const validatePoem = (style, poemText) => {
  const lines = poemText.trim().split("\n").filter(line => line.trim() !== "");

  switch (style) {
    case "Haiku": {
      if (lines.length !== 3) {
        return { valid: false, message: "A haiku should have exactly three lines." };
      }
      const syllableCounts = lines.map(line => syllable(line));
      if (syllableCounts[0] !== 5 || syllableCounts[1] !== 7 || syllableCounts[2] !== 5) {
        return { valid: false, message: "Haiku lines should have 5, 7, and 5 syllables respectively." };
      }
      return { valid: true, message: "This poem structure looks like a Haiku!" };
    }

    case "Sonnet": {
      if (lines.length !== 14) {
        return { valid: false, message: "A sonnet should have exactly 14 lines." };
      }
      // Add more sophisticated validation for iambic pentameter if desired
      return { valid: true, message: "This poem has the correct number of lines for a Sonnet." };
    }

    case "Limerick": {
      if (lines.length !== 5) {
        return { valid: false, message: "A limerick should have exactly 5 lines." };
      }
      // Add rhyme scheme validation if desired
      return { valid: true, message: "This poem has the correct number of lines for a Limerick." };
    }

    default:
      return { valid: true, message: `"${style}" has no strict rules, write freely!` };
  }
};

export const calculateDoomScale = (poem) => {
  if (!poem) return 0;

  const words = poem
    .toLowerCase()
    .split(/[^a-zA-Z']+/)
    .filter(Boolean);
  if (words.length === 0) return 0;

  const groups = {};
  for (const word of words) {
    const key = word.slice(-2);
    groups[key] = (groups[key] || 0) + 1;
  }

  let rhymingWords = 0;
  for (const count of Object.values(groups)) {
    if (count > 1) rhymingWords += count;
  }

  return Math.round((rhymingWords / words.length) * 100);
};

export const POEM_STYLES = [
  "Haiku",
  "Sonnet",
  "Limerick",
  "Free Verse",
  "Ode",
  "Villanelle",
  "Elegy",
  "Ballad",
  "Epigram",
  "Acrostic"
];

export const POEM_PROMPTS = [
  "Choose one of your five senses and write a poem that focuses on it.",
  "Write a poem inspired by a color.",
  "Write about something that happened to you this week.",
  "Write a poem inspired by your favorite song.",
  "Write about a lesson you recently learned.",
  "Write a poem about a significant person in your life.",
  "Write advice you would give to your younger self.",
  "Describe your experience of traveling somewhere.",
  "Recall a favorite holiday memory.",
  "Create a gallery of your heart in a poem.",
  "Describe a strange dream you've had.",
  "Write about a time your illusions were shattered.",
  "Write about a favorite childhood memory.",
  "Imagine yourself as a home under renovation.",
  "Write a haiku about nature.",
  "Observe another time period in a poem.",
  "Write from your pet's perspective.",
  "Imagine switching places with someone for a day.",
  "Write about body positivity.",
  "Freeze a special moment in time through poetry.",
  "Describe an inner dialogue during a run.",
  "Write about yourself as both hero and villain."
]; 