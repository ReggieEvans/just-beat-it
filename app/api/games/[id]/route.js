import { connectToDB } from '@utils/database';
import Game from '@models/game';

// @desc    Get User Game from Library
// @route   GET /api/games/:id
export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const game = await Game.findById({ _id: params.id });
    return new Response(JSON.stringify(game), { status: 200 });
  } catch {
    return new Response('Something went wrong. Failed to fetch library.', {
      status: 500,
    });
  }
};

// @desc    Update User Game
// @route   PATCH /api/games/:id
export const PATCH = async (request, { params }) => {
  const { userId, status } = await request.json();
  const gameId = params.id;

  try {
    await connectToDB();
    const game = await Game.findOne({ user: userId, _id: gameId });
    const currentStatus = game[status];

    const updatedGame = await Game.findByIdAndUpdate(game._id, {
      [status]: !currentStatus,
    });

    return new Response(JSON.stringify(updatedGame), { status: 200 });
  } catch {
    return new Response('Something went wrong. Failed to fetch library.', {
      status: 500,
    });
  }
};

// @desc    Delete User Game
// @route   DELETE /api/games/:id
export const DELETE = async (request, { params }) => {
  const gameId = params.id;

  try {
    await connectToDB();
    await Game.findByIdAndDelete(gameId);

    return new Response('Game deleted successfully!', { status: 200 });
  } catch {
    return new Response(
      'Something went wrong. Failed to delete from library.',
      {
        status: 500,
      }
    );
  }
};
