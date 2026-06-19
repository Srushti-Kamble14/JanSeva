import { SUPPORTED_LANGUAGES } from "./translations";

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "student", label: "Student" },
  { id: "farmer", label: "Farmer" },
  { id: "women", label: "Women" },
  { id: "startup", label: "Startup" },
  { id: "healthcare", label: "Healthcare" },
  { id: "housing", label: "Housing" },
];

export const LANGUAGES = SUPPORTED_LANGUAGES.map((language) => ({
  ...language,
  flag: "🇮🇳",
}));
