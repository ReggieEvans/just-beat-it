import { connectToDB } from '@utils/database';
import Game from '@models/game';

// @desc    Get User Games from Library
// @route   GET /api/games/:id/all
export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const games = await Game.find({ user: params.id });
    return new Response(JSON.stringify(games), { status: 200 });
  } catch {
    return new Response('Something went wrong. Failed to fetch library.', { status: 500 });
  }
};
