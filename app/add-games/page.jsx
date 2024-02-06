'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Game from '@components/Game';
import Spinner from '@components/Spinner';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const AddGames = () => {
  const { data: session } = useSession();

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [submitting, setIsSubmitting] = useState({
    isSubmitting: false,
    index: null,
  });

  const fetchGames = async (text = '') => {
    setIsLoading(true);
    const response = await fetch('/api/igdb', {
      method: 'POST',
      body: JSON.stringify({
        searchText: text,
      }),
    });
    const data = await response.json();

    setGames(data.games);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        fetchGames(e.target.value);
      }, 500)
    );
  };

  const handleAddGame = async (game, i) => {
    setIsSubmitting({
      ...submitting,
      isSubmitting: true,
      index: i,
    });

    try {
      const response = await fetch('/api/games/new', {
        method: 'POST',
        body: JSON.stringify({
          userId: session?.user.id,
          game,
        }),
      });
      const data = await response.json();
      toast.success(`${data.message} 👍`);
    } catch (error) {
      toast.error(`Something went wrong! 👎`);
    } finally {
      setIsSubmitting({
        ...submitting,
        isSubmitting: false,
        index: null,
      });
    }
  };

  return (
    <section className='w-full'>
      <Link href={'/my-library'} className='flex items-center text-sm'>
        <FaArrowLeft className='mr-2 ' /> Back to Library
      </Link>
      <h1 className='head_text text-left mb-2'>
        <span className='slate_gradient'>ADD GAMES</span>
      </h1>
      <div className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a video game'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </div>

      <div className='flex flex-wrap justify-between py-8'>
        {games.map((game, i) => (
          <Game
            key={game.id}
            index={i}
            handleAddGame={handleAddGame}
            game={game}
            submitting={submitting}
            canSubmit={true}
          />
        ))}
      </div>

      {isLoading && <Spinner size={40} message={'Loading Games'} />}
    </section>
  );
};

export default AddGames;
