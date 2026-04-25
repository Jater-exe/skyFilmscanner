const axios = require("axios");

const SKYSCANNER_API_KEY = "LA_VOSTRA_SKYSCANNER_API_KEY";

export  async function getSkyscannerPlace(locationName) {
    try {
        const res = await axios.get(
            "https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights",
            {
                headers: {
                    "x-api-key": SKYSCANNER_API_KEY
                },
                params: {
                    query: locationName,
                    market: "ES",
                    locale: "en-GB"
                }
            }
        );

        const places = res.data.places || [];

        if (places.length === 0) return null;

        return places[0];

    } catch (error) {
        console.error("Error Skyscanner place:", locationName);
        console.error(error.response && error.response.data || error.message);
        return null;
    }
}
