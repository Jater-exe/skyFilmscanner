import axios, { AxiosError } from "axios";

const SKYSCANNER_API_KEY = "sh782613596881417389290430162312";

export  async function getSkyscannerPlace(locationName:string) {
    try {
        const res = await axios.post(
            "https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights",
            {
                query: {
                    market: "ES",
                    locale: "en-GB",
                    searchTerm: locationName,
                },
            },
            {
                headers: {
                    "x-api-key": SKYSCANNER_API_KEY,
                },
            },
        );

        const places = res.data.places || [];

        if (places.length === 0) return null;

        return places[0];

    } catch (error) {
        if (error instanceof AxiosError){
            console.error("Error Skyscanner place:", locationName);
            console.error(error.response && error.response.data || error.message);
        }
        return null
    }
}
