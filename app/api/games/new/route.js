import Game from '@models/game';
import { connectToDB } from '@utils/database';

// @desc    Add Games to Library
// @route   POST /api/games/new
export const POST = async (request) => {
  const { userId, game } = await request.json();
  const posDate = 1641016800; // 1/1/2022

  try {
    await connectToDB();

    const gameAlreadyInLibrary = await Game.findOne({ id: game.id, _userId: userId });
    if (gameAlreadyInLibrary) {
      return new Response(`Game ${game.id} already in your library!`, { status: 500 });
    }

    const newGame = new Game({
      user: userId,
      _userId: userId,
      ...game,
      _isPileOfShame: game.first_release_date < posDate,
    });

    await newGame.save();
    return new Response(JSON.stringify({ game: newGame }), { status: 200 });
  } catch {
    return new Response('Something went wrong. Failed to add game to library.', { status: 500 });
  }
};
