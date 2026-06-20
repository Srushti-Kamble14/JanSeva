import axios from "axios";

export const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }
    );

    console.log("Translated:", text, "=>", response.data.translatedText);

    return response.data.translatedText;
  } catch (error) {
    console.log("Translate Error:", error.response?.data || error.message);
    return text;
  }
};