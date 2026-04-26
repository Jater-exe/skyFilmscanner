import axios, { AxiosError } from "axios";

import { getRatingMovies, getRatingShows } from "./test_trakt";
import { getSkyscannerPlace, getSkyscannerFlight, SkyscannerPlace } from "./test_skyloc";

// ── Tipos ────────────────────────────────────────────────────────────────────

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

interface ContentWithAirports {
    title: string;
    imdb_id: string;
    locationAirports: { location: string; airport: SkyscannerPlace }[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const LOCATION_BLACKLIST = [
    /studio/i,
    /screen gems/i,
    /sound stage/i,
    /backlot/i,
    /pinewood/i,
    /shepperton/i,
    /leavesden/i,
    /paramount/i,
    /universal/i,
    /warner bros/i,
    /disney/i,
    /EUE/i,
    /lot \d/i,
];

function extractSearchableLocation(rawLocation: string): string | null {
    if (LOCATION_BLACKLIST.some(pattern => pattern.test(rawLocation))) {
        return null;
    }
    const cleaned = rawLocation.split(",")[0].trim();
    if (cleaned.length < 3) return null;
    return cleaned;
}

function printResults(results: ContentWithAirports[]): void {
    for (const result of results) {
        if (result.locationAirports.length === 0) continue;

        console.log(`\n${result.title}:`);
        for (const { location, airport } of result.locationAirports) {
            console.log(`${location}:`);
            console.log(JSON.stringify({ entityId: airport.entityId, iataCode: airport.iataCode }, null, 2));
        }
    }
}

async function chunked<T, R>(
    items: T[],
    chunkSize: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(chunk.map(fn));
        results.push(...chunkResults);
    }
    return results;
}

// ── API calls ────────────────────────────────────────────────────────────────

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
                params: { query: sparql, format: "json" },
                headers: { "User-Agent": "skyFilmscanner/1.0" }
            }
        );
        return res.data.results.bindings.map(item => item.locationLabel.value);
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(error.response?.data || error.message);
        }
        return [];
    }
}

async function processItem(item: TopContentItem): Promise<ContentWithAirports> {
    const locations = await getWikidataLocations(item.imdb_id);

    const locationAirports = (
        await Promise.all(
            locations.map(async (loc) => {
                const searchable = extractSearchableLocation(loc);
                if (!searchable) return null;

                const airport = await getSkyscannerPlace(searchable);
                if (!airport) return null;

                return { location: searchable, airport };
            })
        )
    ).filter((x): x is { location: string; airport: SkyscannerPlace } => x !== null);

    return { ...item, locationAirports };
}

// ── Main ─────────────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
    const username = "jater06";

    const [rated_movies, rated_shows] = await Promise.all([
        getRatingMovies(username),
        getRatingShows(username)
    ]);

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

    const results = await chunked(topContent.filter(i => i.imdb_id), 5, processItem);
    const demo_source = await getSkyscannerPlace("Barcelona");

    printResults(results);

    if (demo_source) {
        console.log("\nBarcelona:");
        console.log(JSON.stringify({ entityId: demo_source.entityId, iataCode: demo_source.iataCode }, null, 2));
    }

    // Test flight search
    if (demo_source && results.length > 0 && results[0].locationAirports.length > 0) {
        const first = { location: "Barcelona", airport: demo_source };
        const second = results[0].locationAirports[0];
        console.log(`\nSearching flight from ${first.location} to ${second.location}`);
        const flightResult = await getSkyscannerFlight(first.airport.entityId, second.airport.entityId, "2026-05-01");
        if (flightResult) {
            console.log("Flight search status:", flightResult.status);
            console.log("Itineraries found:", flightResult.content?.results?.itineraries?.length || 0);
        } else {
            console.log("No flight result");
        }
    }
}

main();