// console.log("schemes controller loaded");
import axios from "axios";

export const getAllSchemes = async (req, res) => {
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
          size: 50,
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

    return res
      .status(200)
      .json({
        message: "Schemes data retrieved successfully",
        data: response.data,
      });
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

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