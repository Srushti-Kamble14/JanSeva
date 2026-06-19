console.log("CHAT API HIT");
import Groq from "groq-sdk";
import { searchSchemes } from "../services/schemes.services.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatWithAi = async (req, res) => {
  try {
    const { message,language } = req.body;
//     console.log("BODY:", req.body);
// console.log("Language:", language);
    
    const languageMap = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
  ur: "Urdu",
};
// console.log(process.env.MYSCHEME_API_KEY);
    const schemes = await searchSchemes(message, 5);

    const schemeData = schemes.map((scheme) => ({
      id: scheme.id,
      name: scheme.fields.schemeName,
      description: scheme.fields.briefDescription,
      slug: scheme.fields.slug,
      level: scheme.fields.level,
    }));

    if (!schemeData.length) {
      return res.json({
        success: true,
        reply: "No matching schemes found.",
        schemes: [],
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
         `
         You are JanSeva AI.

Use only the provided schemes.

Reply ONLY in ${languageMap[language] || "English"}.



Do not use markdown.
Do not use **, *, #, bullet markdown, or code blocks.
Return plain text only.

Keep answers simple and easy to understand for Indian citizens.
         `

            
        },
        {
          role: "user",
          content: `
Question:
${message}

Schemes:
${JSON.stringify(schemeData, null, 2)}
`,
        },
      ],
    });

    const reply =
  completion.choices[0].message.content
    .replace(/\*\*/g, "")
    .replace(/#/g, "");

    // console.log("AI Reply:", reply);

    return res.json({
      success: true,
      reply,
      schemes: schemeData,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};