'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Game from '@components/Game';
import { FaPlus, FaSortAmountDownAlt } from 'react-icons/fa';
import Link from 'next/link';
import Spinner from '@components/Spinner';

const MyLibrary = () => {
  const { data: session } = useSession();

  const [library, setLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setIsSubmitting] = useState(false);

  const fetchGames = async (text = '') => {
    setIsLoading(true);
    const response = await fetch(`/api/games/${session?.user.id}/all`);
    const data = await response.json();

    setLibrary(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchGames();
    }
  }, [session]);

  const handleAddGame = async (game) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/games/new', {
        method: 'POST',
        body: JSON.stringify({
          userId: session?.user.id,
          game,
        }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full">
      <div className="w-full flex justify-between items-center">
        <h1 className="head_text text-left mb-2">
          <span className="slate_gradient">MY LIBRARY</span>
        </h1>
        <Link href="/add-games">
          <button
            type="button"
            className="bg-blue-600 h-[35px] mt-4 hover:brightness-110 px-2 py-1 rounded-full font-medium text-white text-xl"
          >
            <FaPlus />
          </button>
        </Link>
      </div>
      <div className="flex w-full text-xs items-start">
        <div className="flex flex-wrap items-center">
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2"
          >
            ALL
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2"
          >
            IN PROGRESS
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2"
          >
            COMPLETED
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2"
          >
            QUIT
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2"
          >
            PILE OF SHAME
          </button>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            className="bg-transparent hover:brightness-110 px-2 py-1 rounded-full font-medium text-slate-400 text-lg"
          >
            <FaSortAmountDownAlt />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap w-full justify-start py-8">
        {library.map((game, i) => (
          <Link href={`/my-library/${game._id}`} key={game._id}>
            <Game index={i} handleAddGame={handleAddGame} game={game} canSubmit={false} />
          </Link>
        ))}
      </div>

      {isLoading && <Spinner size={40} message={'Loading library'} />}
    </section>
  );
};

export default MyLibrary;
