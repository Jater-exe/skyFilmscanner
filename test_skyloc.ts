import axios, { AxiosError } from "axios";

const SKYSCANNER_API_KEY = "sh782613596881417389290430162312";

export interface SkyscannerPlace {
    entityId: string;
    iataCode?: string;
    parentId?: string;
    name: string;
    countryId?: string;
    countryName?: string;
    cityName?: string;
    location?: string;
    hierarchy?: string;
    type?: string;
    highlighting?: number[][];
}

export async function getSkyscannerPlace(locationName: string): Promise<SkyscannerPlace | null> {
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
                headers: { "x-api-key": SKYSCANNER_API_KEY },
            }
        );

        const places: SkyscannerPlace[] = res.data.places || [];
        return places.length === 0 ? null : places[0];

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(`Error Skyscanner place: "${locationName}"`);
            console.error(error.response?.data || error.message);
        }
        return null;
    }
}

export interface SkyscannerFlightResponse {
    sessionToken: string;
    status: string;
    action: string;
    content: any;
}

export async function getSkyscannerFlight(source: string, destination: string, date: string): Promise<SkyscannerFlightResponse | null> {
    try {
        const [year, month, day] = date.split('-').map(Number);
        const res = await axios.post(
            "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create",
            {
                query: {
                    market: "UK",
                    locale: "en-GB",
                    currency: "GBP",
                    queryLegs: [
                        {
                            originPlaceId: { entityId: source },
                            destinationPlaceId: { entityId: destination },
                            date: { year, month, day }
                        }
                    ],
                    adults: 1,
                    cabinClass: "CABIN_CLASS_ECONOMY"
                }
            },
            {
                headers: { "x-api-key": SKYSCANNER_API_KEY }
            }
        );

        return res.data;

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(`Error Skyscanner flight: "${source}" to "${destination}" on ${date}`);
            console.error(error.response?.data || error.message);
        }
        return null;
    }
}