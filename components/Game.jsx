import Image from 'next/image';
import { FaCirclePlus } from 'react-icons/fa6';

const Game = ({ game, handleAddGame, index, canAddToLibrary }) => {
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
    <div className="flex flex-col mb-4 mx-4 w-[150px] text-sm ">
      <div>
        <Image
          src={cover ? `https:${cover}` : '/assets/images/cover-not-found.png'}
          width={150}
          height={200}
          alt="Video Game Cover"
          className="rounded-lg"
          priority={index < 11}
        />
      </div>
      <div className="py-1 flex justify-between items-start">
        <div className="flex flex-col">
          <p className="font-medium">{game.name}</p>
          <div className="flex grow items-center mt-1">
            <div className={`w-[10px] h-[10px] rounded-md mr-2 ${getRatingStyle(game.total_rating)}`}></div>{' '}
            <p>{(game.total_rating / 10).toFixed(1)}</p>
          </div>
        </div>
        {canAddToLibrary && (
          <button className="px-2 mt-1" onClick={() => handleAddGame(game)}>
            <FaCirclePlus className="text-xl text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
