'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Game from '@components/Game';

const AddGames = () => {
  const { data: session } = useSession();

  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

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
      <h1 className="head_text text-left mb-2">
        <span className="slate_gradient">ADD GAMES</span>
      </h1>
      <div className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </div>

      <div className="flex flex-wrap justify-between py-8">
        {isLoading && <div>Loading...</div>}
        {games.map((game, i) => (
          <Game key={game.id} index={i} handleAddGame={handleAddGame} game={game} canAddToLibrary={true} />
        ))}
      </div>
    </section>
  );
};

export default AddGames;
