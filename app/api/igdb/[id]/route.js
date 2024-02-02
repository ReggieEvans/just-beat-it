import axios from 'axios';

// @desc    Get Game from IDGB
// @route   POST /api/igdb/:id
export const POST = async (request, { params }) => {
  let body = `fields id,name,cover.url,screenshots.url,status,summary,total_rating,total_rating_count, involved_companies.company.name; where id = ${params.id};`;

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

    const gameArr = igdbRes.data;

    return new Response(JSON.stringify({ game: gameArr[0] }), { status: 200 });
  } catch {
    return new Response('Failed to retrieve game from iGBD!', { status: 500 });
  }
};
