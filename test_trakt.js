const axios = require("axios");

const CLIENT_ID = "AQUI_EL_TEU_CLIENT_ID";

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

getWatchedMovies("sean");