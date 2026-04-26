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
                    locale: "es-ES",
                    currency: "EUR",
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

export async function getSkyscannerFlight(source: string, destination: string, date?: string): Promise<SkyscannerFlightResponse | null> {
    try {
        const queryLeg: any = {
            originPlace: {
                queryPlace: {
                    entityId: source
                }
            },
            destinationPlace: {
                queryPlace: {
                    entityId: destination
                }
            }
        };

        if (date) {
            const [year, month, day] = date.split("-").map(Number);
            queryLeg.fixedDate = { year, month, day };
        } else {
            queryLeg.anytime = true;
        }

        const res = await axios.post(
            "https://partners.api.skyscanner.net/apiservices/v3/flights/indicative/search",
            {
                query: {
                    market: "ES",
                    locale: "es-ES",
                    currency: "EUR",
                    queryLegs: [queryLeg],
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
            console.error(`Error Skyscanner flight: "${source}" to "${destination}" on date ${date}`);
            console.error(error.response?.data || error.message);
        }
        return null;
    }
}