import axios from "axios";

export const searchSchemes = async (keyword, size = 5) => {
  const response = await axios.get(
    "https://api.myscheme.gov.in/search/v6/schemes",
    {
      params: {
        lang: "en",
        q: "[]",
        keyword,
        from: 0,
        size,
      },
      headers: {
        "x-api-key": process.env.MYSCHEME_API_KEY,
        origin: "https://www.myscheme.gov.in",
        referer: "https://www.myscheme.gov.in/",
        accept: "application/json, text/plain, */*",
        "user-agent": "Mozilla/5.0",
      },
    }
  );

  return response?.data?.data?.hits?.items || [];
};