import Image from 'next/image';
import { FaAward, FaCirclePlus } from 'react-icons/fa6';
import BtnSpinner from './BtnSpinner';

const Game = ({ game, handleAddGame, index, submitting, canSubmit }) => {
  let cover = game.cover?.url.replace('t_thumb', 't_cover_big');

  const getRatingStyle = (rating) => {
    switch (true) {
      case rating >= 95:
        return 'bg-purple-600';
        break;
      case rating >= 80:
        return 'bg-green-600';
        break;
      case rating >= 70:
        return 'bg-yellow-600';
        break;
      default:
        return 'bg-red-600';
        break;
    }
  };

  return (
    <div className="flex flex-col mb-4 mx-4 w-[150px] text-sm">
      <div className="relative">
        <Image
          src={cover ? `https:${cover}` : '/assets/images/cover-not-found.png'}
          width={150}
          height={200}
          alt="Video Game Cover"
          className="  rounded-lg"
          priority={index < 11}
        />
        <div className="absolute top-0 right-0 -mr-4 flex flex-col items-center">
          <div
            className={`flex justify-center items-center h-[28px] w-[28px] rounded-full mb-2 text-slate-100 font-bold text-md ${getRatingStyle(
              game.total_rating
            )}`}
          >
            {(game.total_rating / 10).toFixed(1)}
          </div>
          {game._isCompleted && (
            <div className="mb-4 text-4xl text-amber-400">
              <FaAward />
            </div>
          )}
          {game._isInProgress && <div className="h-[12px] w-[12px] bg-sky-400 rounded-full mb-2"></div>}

          {game._isPileOfShame && <div className="h-[12px] w-[12px] bg-orange-600 rounded-full mb-2"></div>}

          {game._isQuit && <div className="h-[12px] w-[12px] bg-rose-600 rounded-full mb-2"></div>}
        </div>

        <div className="absolute bottom-0 right-0 flex flex-col items-center">
          {game._gameplayHours?.gameplayMain && (
            <div className="bg-blue-700 text-slate-200 font-medium rounded-tl-md rounded-br-md p-1">
              {game._gameplayHours.gameplayMain}h
            </div>
          )}
        </div>
      </div>
      <div className="py-1 flex justify-between items-start">
        <div className="flex flex-col">
          <p className="font-medium">{game.name}</p>
        </div>
        {canSubmit && (
          <div>
            {submitting?.isSubmitting && submitting?.index === index ? (
              <BtnSpinner size={16} />
            ) : (
              <button className="px-2 mt-1" onClick={() => handleAddGame(game, index)}>
                <FaCirclePlus className="text-xl text-blue-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
