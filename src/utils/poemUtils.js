import { syllable } from 'syllable';

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const validatePoem = (style, poemText) => {
  const lines = poemText.trim().split("\n").filter(line => line.trim() !== "");

  switch (style) {
    case "Haiku":
      if (lines.length !== 3) {
        return "A haiku should have exactly three lines.";
      }
      const syllableCounts = lines.map(line => syllable(line));
      if (syllableCounts[0] !== 5 || syllableCounts[1] !== 7 || syllableCounts[2] !== 5) {
        return "Haiku lines should have 5, 7, and 5 syllables respectively.";
      }
      return "This poem structure looks like a Haiku!";

    case "Sonnet":
      if (lines.length !== 14) {
        return "A sonnet should have exactly 14 lines.";
      }
      // Add more sophisticated validation for iambic pentameter if desired
      return "This poem has the correct number of lines for a Sonnet.";

    case "Limerick":
      if (lines.length !== 5) {
        return "A limerick should have exactly 5 lines.";
      }
      // Add rhyme scheme validation if desired
      return "This poem has the correct number of lines for a Limerick.";

    case "Ode":
      if (lines.length < 3) {
        return "An ode should have at least 3 lines.";
      }
      return "This poem has the correct structure for an Ode.";

    case "Villanelle":
      if (lines.length !== 19) {
        return "A villanelle should have exactly 19 lines.";
      }
      return "This poem has the correct structure for a Villanelle.";

    case "Elegy":
      if (lines.length < 3) {
        return "An elegy should have at least 3 lines.";
      }
      return "This poem has the correct structure for an Elegy.";

    case "Ballad":
      if (lines.length < 4) {
        return "A ballad should have at least 4 lines.";
      }
      return "This poem has the correct structure for a Ballad.";

    case "Epigram":
      if (lines.length !== 2 && lines.length !== 4) {
        return "An epigram should have either 2 or 4 lines.";
      }
      return "This poem has the correct structure for an Epigram.";

    case "Acrostic":
      if (lines.length < 1) {
        return "An acrostic should have at least 1 line.";
      }
      return "This poem has the correct structure for an Acrostic.";

    default:
      return `"${style}" has no strict rules, write freely!`;
  }
};

export const calculateDoomScale = (poem) => {
  if (!poem) return 0;
  
  const words = poem.toLowerCase().split(/\s+/).filter(word => word !== "");
  if (words.length === 0) return 0;

  // Calculate various factors that contribute to "doom"
  const darkWords = new Set(['dark', 'death', 'doom', 'gloom', 'night', 'shadow', 'black', 'abyss', 'void', 'lost']);
  const darkWordCount = words.filter(word => darkWords.has(word)).length;
  
  // Rhyme detection
  let rhymeScore = 0;
  const lastTwoLetters = words.map(word => word.slice(-2));
  for (let i = 0; i < lastTwoLetters.length; i++) {
    for (let j = i + 1; j < lastTwoLetters.length; j++) {
      if (lastTwoLetters[i] && lastTwoLetters[j] && lastTwoLetters[i] === lastTwoLetters[j]) {
        rhymeScore++;
      }
    }
  }

  // Word variety (repetition adds to doom)
  const wordVarietyScore = 1 - (new Set(words).size / words.length);
  
  // Punctuation analysis (more exclamation/question marks = more dramatic = more doom)
  const dramaticPunctuation = (poem.match(/[!?]/g) || []).length;
  
  // Calculate final doom score
  const darkWordFactor = (darkWordCount / words.length) * 40;
  const rhymeFactor = (rhymeScore / words.length) * 20;
  const varietyFactor = wordVarietyScore * 20;
  const punctuationFactor = Math.min(dramaticPunctuation * 5, 20);

  const doomScale = darkWordFactor + rhymeFactor + varietyFactor + punctuationFactor;
  
  return Math.min(100, Math.max(0, Math.round(doomScale)));
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
