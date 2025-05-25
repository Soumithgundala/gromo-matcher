import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebaseconfig";

const functions = getFunctions(app);
const recommend = httpsCallable(functions, "recommendProducts");

export const getAISuggestions = async (age, occupation) => {
  try {
    const result = await recommend({ age, occupation });
    return result.data.suggestions;
  } catch (err) {
    console.error("OpenAI error:", err);
    return "No suggestions available.";
  }
};
