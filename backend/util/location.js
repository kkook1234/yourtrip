const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = process.env.GOOGLE_API_KEY;
require("dotenv").config();

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;

  if (!data || data.status == "ZERO_RESULTS") {
    //주소를 찾을 수 없을 때
    const error = new HttpError("해당 주소를 찾지 못했습니다.", 422);
    throw error;
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
