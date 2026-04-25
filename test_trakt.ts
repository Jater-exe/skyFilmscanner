const axios = require("axios");

const CLIENT_ID = "09416659f45334451c291b63fc404c05942b5bd23fbd277b1ca41bf196cc6263";

// Pel·lícules amb rating >= 7
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

        return res.data.filter(item => item.rating >= 7);

    } catch (error) {
        console.error(
            (error.response && error.response.data) || error.message
        );
        return [];
    }
}

// Sèries amb rating >= 7
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

        return res.data.filter(item => item.rating >= 7);

    } catch (error) {
        console.error(
            (error.response && error.response.data) || error.message
        );
        return [];
    }
}

module.exports = {
    getRatingMovies,
    getRatingShows
};