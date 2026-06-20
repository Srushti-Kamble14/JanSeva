// console.log("schemes controller loaded");
import axios from "axios";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
export const getAllSchemes = async (req, res) => {
 
  const languageMap = {
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
  const { language = "en" } = req.query;
  
  console.log("Language received:", language);

  try {
    const response = await axios.get(
      "https://api.myscheme.gov.in/search/v6/schemes",
      {
        params: {
          lang: "en",
          q: "[]",
          keyword: "",
          sort: "",
          from: 0,
          size: 10,
        },
        headers: {
          "x-api-key": process.env.MYSCHEME_API_KEY,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0.0.0 Safari/537.36",
          Origin: "https://www.myscheme.gov.in",
          Referer: "https://www.myscheme.gov.in/",
          Accept: "application/json, text/plain, */*",
        },
      }
    );
    const schemes = response.data.data.hits.items;
    console.log("Before:", schemes[0]?.fields?.schemeName);
    if (language !== "en") {
  const schemeData = schemes.map((scheme) => ({
    id: scheme.id,
    name: scheme.fields.schemeName,
    description: scheme.fields.briefDescription,
    level: scheme.fields.level,
      category: scheme.fields.schemeCategory,
  }));

 const translatedSchemes = [];
for (let i = 0; i < schemeData.length; i += 5) {
  console.log(`Processing chunk ${i / 5 + 1}`);

  const chunk = schemeData.slice(i, i + 5);

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
Translate all values in this JSON to ${languageMap[language]}.

Rules:
- Keep JSON structure unchanged
- Do not translate id
- Translate only name, description and level
- Return valid JSON only
- No markdown
- No explanations
`,
        },
        {
          role: "user",
          content: JSON.stringify(chunk),
        },
      ],
    });

    console.log(`Got response for chunk ${i / 5 + 1}`);

    const cleaned = response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    translatedSchemes.push(...parsed);

    console.log(`Chunk ${i / 5 + 1} translated`);
  } catch (err) {
    console.log(
      `Chunk ${i / 5 + 1} Error:`,
      err.message
    );
  }
}
  try {
    console.log(
  "Total translated schemes:",
  translatedSchemes.length
);
 translatedSchemes.forEach((translated, index) => {
  schemes[index].fields.schemeName =
    translated.name || schemes[index].fields.schemeName;

  schemes[index].fields.briefDescription =
    translated.description || schemes[index].fields.briefDescription;

  schemes[index].fields.level =
    translated.level || schemes[index].fields.level;

    schemes[index].fields.schemeCategory =
  translated.category ||
  schemes[index].fields.schemeCategory;
});

  console.log(
    "Translated:",
    schemes[0]?.fields?.schemeName
  );
} catch (err) {
  console.log("Translation Parse Error:", err.message);
}
}
console.log(
  "After:",
  schemes[0]?.fields?.schemeName
);
    return res
      .status(200)
      .json({
        message: "Schemes data retrieved successfully",
        data: response.data,
      });
  } catch (error) {
    // console.log("STATUS:", error.response?.status);
    // console.log("DATA:", error.response?.data);

    return res
      .status(500)
      .json({
        message: "Something went wrong while fetching scheme",
        error: error.message,
      });
  }
};


export const getSchemeById = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.myscheme.gov.in/search/v6/schemes",
      {
        params: {
          lang: "en",
          q: "[]",
          from: 0,
          size: 100
        },
        headers: {
          "x-api-key": process.env.MYSCHEME_API_KEY,
        },
      }
    );

    const scheme = response.data.data.hits.items.find(
      item => item.id === req.params.id
    );

    if (!scheme) {
      return res.status(404).json({
        message: "Scheme not found",
      });
    }

    res.json(scheme);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};