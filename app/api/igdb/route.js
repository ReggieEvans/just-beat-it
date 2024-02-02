import { connectToDB } from '@utils/database';
import Game from '@models/game';
import IGDB from '@utils/igdb';
import axios from 'axios';

// @desc    Get Games from IDGB
// @route   POST /api/igdb
export const POST = async (request) => {
  const { searchText } = await request.json();

  let body;
  if (!searchText) {
    body = `fields name,total_rating,total_rating_count,cover.url,screenshots.url,total_rating,total_rating_count,first_release_date,involved_companies.company.name,summary; limit 100; where release_dates.date > 948805691;`;
  } else {
    body = `search "${searchText}"; fields name,total_rating,total_rating_count,cover.url,screenshots.url,total_rating,total_rating_count,first_release_date,involved_companies.company.name,summary; limit 100; where release_dates.date > 948805691;`;
  }

  try {
    const tokenRes = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`
    );

    const igdbRes = await axios.post('https://api.igdb.com/v4/games', body, {
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: 'Bearer ' + tokenRes.data.access_token,
      },
    });

    const rawGames = igdbRes.data;
    const gamesWithNoRating = rawGames.filter((g) => g.total_rating === undefined);
    const gamesWithRating = rawGames.filter((g) => g.total_rating !== undefined);
    const sortedGames = gamesWithRating.sort((a, b) => b.total_rating - a.total_rating);

    const games = [...sortedGames, ...gamesWithNoRating];

    return new Response(JSON.stringify({ games }), { status: 200 });
  } catch {
    return new Response('Failed to retrieve games from iGBD!', { status: 500 });
  }
};
