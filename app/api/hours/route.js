import { connectToDB } from '@utils/database';
import Game from '@models/game';
let hltb = require('howlongtobeat');

// @desc    Get Completion Hours from HowLongToBeat
// @route   POST /api/hours
export const POST = async (request) => {
  const { searchText } = await request.json();

  try {
    const title = searchText;
    let hltbService = new hltb.HowLongToBeatService();
    const results = await hltbService.search(title);
    return new Response(JSON.stringify({ games: results }), { status: 200 });
  } catch {
    return new Response('Failed to retrieve response from HowLongToBeat!', {
      status: 500,
    });
  }
};

// @desc    Update Game with Completion Hours
// @route   PATCH /api/hours
export const PATCH = async (request) => {
  const { gameId, hoursObj } = await request.json();

  try {
    await connectToDB();

    const completionHours = {
      gameplayMain: hoursObj.gameplayMain,
      gameplayMainExtra: hoursObj.gameplayMainExtra,
      gameplayCompletionist: hoursObj.gameplayCompletionist,
    };

    await Game.findByIdAndUpdate(gameId, {
      _gameplayHours: completionHours,
    });

    const updatedGame = await Game.find({ _id: gameId });

    return new Response(JSON.stringify(updatedGame), { status: 200 });
  } catch {
    return new Response('Something went wrong. Failed to add completion hours.', {
      status: 500,
    });
  }
};
