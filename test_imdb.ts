import axios, { AxiosError } from "axios";

import { getRatingMovies, getRatingShows } from "./test_trakt";
import { getSkyscannerPlace } from "./test_skyloc";

interface WikidataBinding {
    locationLabel: {
        value: string;
    };
}

interface WikidataResponse {
    results: {
        bindings: WikidataBinding[];
    };
}

interface TopContentItem {
    title: string;
    imdb_id: string;
}

export async function getWikidataLocations(imdbId: string): Promise<string[]> {
    try {
        const sparql = `
            SELECT ?locationLabel WHERE {
              ?film wdt:P345 "${imdbId}".
              ?film wdt:P915 ?location.
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en".
              }
            }
        `;

        const res = await axios.get<WikidataResponse>(
            "https://query.wikidata.org/sparql",
            {
                params: {
                    query: sparql,
                    format: "json"
                },
                headers: {
                    "User-Agent": "skyFilmscanner/1.0"
                }
            }
        );

        return res.data.results.bindings.map(
            item => item.locationLabel.value
        );

    } catch (error) {
        console.error("Error Wikidata:", imdbId);

        if (error instanceof AxiosError) {
            console.error(error.response?.data || error.message);
        }

        return [];
    }
}

export async function main(): Promise<void> {
    const username = "sean";

    const rated_movies = await getRatingMovies(username);
    const rated_shows = await getRatingShows(username);

    const topContent: TopContentItem[] = [
        ...rated_movies.map(item => ({
            title: item.movie.title,
            imdb_id: item.movie.ids.imdb
        })),
        ...rated_shows.map(item => ({
            title: item.show.title,
            imdb_id: item.show.ids.imdb
        }))
    ];


    var res = [];
    for (const item of topContent) {
        if (!item.imdb_id) continue;

        const locations = await getWikidataLocations(item.imdb_id);


        if (locations.length === 0) {
            //console.log("No locations found");
        } else {
            for (const loc of locations) {
                const loc_airport = await getSkyscannerPlace(loc);
                
            }
            //console.log(locations.slice(0, 5));
        }
    }
}

main();