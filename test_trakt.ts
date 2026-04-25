import axios, { AxiosError } from "axios";

const CLIENT_ID: string = "09416659f45334451c291b63fc404c05942b5bd23fbd277b1ca41bf196cc6263";

interface TraktMovieItem {
    rating: number;
    movie: {
        title: string;
        ids: {
            imdb: string;
        };
    };
}

interface TraktShowItem {
    rating: number;
    show: {
        title: string;
        ids: {
            imdb: string;
        };
    };
}


export async function getRatingMovies(
    username: string
): Promise<TraktMovieItem[]> {
    try {
        const res = await axios.get<TraktMovieItem[]>(
            `https://api.trakt.tv/users/${username}/ratings/movies`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": CLIENT_ID
                }
            }
        );

        return res.data.filter(item => item.rating >= 7);

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(error.response?.data || error.message);
        }
        return [];
    }
}


export async function getRatingShows(
    username: string
): Promise<TraktShowItem[]> {
    try {
        const res = await axios.get<TraktShowItem[]>(
            `https://api.trakt.tv/users/${username}/ratings/shows`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": CLIENT_ID
                }
            }
        );

        return res.data.filter(item => item.rating >= 7);

    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(error.response?.data || error.message);
        }
        return [];
    }
}