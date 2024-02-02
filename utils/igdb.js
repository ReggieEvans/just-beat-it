import axios from 'axios';

class IGDB {
  _apiBase = 'https://api.igdb.com/v4';

  getToken = async () => {
    const res = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
      null
    );
    return res.data;
  };

  getGames = async (token, data) => {
    const res = await axios.post('https://api.igdb.com/v4/games', data, {
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: 'Bearer ' + token,
      },
    });
    return res.data;
  };
}

export default IGDB;
