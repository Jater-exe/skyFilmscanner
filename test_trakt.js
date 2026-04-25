const axios = require("axios");

const CLIENT_ID = "09416659f45334451c291b63fc404c05942b5bd23fbd277b1ca41bf196cc6263";

async function getWatchedMovies(username) {
    try {
        const res = await axios.get(
            `https://api.trakt.tv/users/${username}/watched/movies`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": CLIENT_ID
                }
            }
        );

        console.log(res.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}

async function getWatchedShows(username) {
    try {
        const res = await axios.get(
            `https://api.trakt.tv/users/${username}/watched/shows`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": CLIENT_ID
                }
            }
        );

        console.log(res.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}


async function getRatingMovies(username) {
    try {
        const res = await axios.get(
            `https://api.trakt.tv/users/${username}/ratings/movies`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": CLIENT_ID
                }
            }
        );

        console.log(res.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}

async function getRatingShows(username) {
    try {
        const res = await axios.get(
            `https://api.trakt.tv/users/${username}/ratings/shows`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": CLIENT_ID
                }
            }
        );

        console.log(res.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}



var rated_movies = getRatingMovies("sean");
var rated_shows = getRatingShows("sean");
rated_movies.