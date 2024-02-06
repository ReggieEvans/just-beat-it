'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Game from '@components/Game';
import { FaPlus, FaSortAmountDownAlt } from 'react-icons/fa';
import Link from 'next/link';
import Spinner from '@components/Spinner';

const MyLibrary = () => {
  const { data: session } = useSession();

  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [library, setLibrary] = useState([]);
  const [completions, setCompletions] = useState(0);
  const [sourceOfTruth, setSourceOfTruth] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGames = async (text = '') => {
    setIsLoading(true);
    const response = await fetch(`/api/games/${session?.user.id}/all`);
    const data = await response.json();

    const comps = data.filter((x) => x._isCompleted).length;

    setCompletions(comps);
    setLibrary(data);
    setSourceOfTruth(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchGames();
    }
  }, [session]);

  const handleFilter = (type) => {
    setFilterType(type);
    if (type !== 'all') {
      const filtered = sourceOfTruth.filter((x) => x[type]);
      setLibrary(filtered);
    } else {
      setLibrary(sourceOfTruth);
    }
  };

  const handleSort = (type) => {
    let sorted,
      clone = [...library];
    if (type === 'alphabetical') {
      sorted = clone.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'rating') {
      sorted = clone.sort((a, b) => b.total_rating - a.total_rating);
    } else if (type === 'hours') {
      const withGamePlayHours = clone.filter((x) => x._gameplayHours);
      const withoutGamePlayHours = clone.filter((x) => !x._gameplayHours);
      const sortedWithHours = withGamePlayHours.sort(
        (a, b) => b._gameplayHours?.gameplayMain - a._gameplayHours?.gameplayMain
      );
      sorted = [...sortedWithHours, ...withoutGamePlayHours];
    } else if (type === 'release') {
      sorted = clone.sort((a, b) => b.first_release_date - a.first_release_date);
    } else {
      sorted = clone;
    }
    setToggleDropdown(false);
    setLibrary(sorted);
  };

  return (
    <section className="w-full">
      <div
        className={`bg-gradient-to-r from-slate-900 to-slate-900 py-3 px-4 rounded-md text-white flex justify-between items-end`}
      >
        <div className="text-3xl font-bold slate_gradient">
          {' '}
          {`${((completions / sourceOfTruth.length) * 100).toFixed(0)}%`} <span className="text-lg">COMPLETE</span>
        </div>
        <div className="text-xl font-bold slate_gradient">
          {completions} <span className="text-sm">OF </span>
          {sourceOfTruth.length}
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <h1 className="head_text text-left mb-2">
          <span className="slate_gradient">MY LIBRARY</span>
        </h1>
        <Link href="/add-games">
          <button
            type="button"
            className="bg-blue-600 h-[32px] mt-4 hover:brightness-110 px-2 py-1 rounded-full font-medium text-white"
          >
            <FaPlus />
          </button>
        </Link>
      </div>
      <div className="flex w-full text-xs items-start">
        <div className="flex flex-wrap items-center">
          <button
            type="button"
            className={`bg-gradient-to-r to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2 ${
              filterType === 'all' ? 'bg-blue-800' : 'from-blue-600'
            }`}
            onClick={() => handleFilter('all')}
          >
            ALL
          </button>
          <button
            type="button"
            className={`bg-gradient-to-r to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2 ${
              filterType === '_isInProgress' ? 'bg-blue-800' : 'from-blue-600'
            }`}
            onClick={() => handleFilter('_isInProgress')}
          >
            IN PROGRESS
          </button>
          <button
            type="button"
            className={`bg-gradient-to-r to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2 ${
              filterType === '_isCompleted' ? 'bg-blue-800' : 'from-blue-600'
            }`}
            onClick={() => handleFilter('_isCompleted')}
          >
            COMPLETED
          </button>
          <button
            type="button"
            className={`bg-gradient-to-r to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2 ${
              filterType === '_isQuit' ? 'bg-blue-800' : 'from-blue-600'
            }`}
            onClick={() => handleFilter('_isQuit')}
          >
            QUIT
          </button>
          <button
            type="button"
            className={`bg-gradient-to-r to-blue-600 hover:brightness-110 text-white px-2 py-1 rounded-full min-w-[75px] font-medium mr-4 mb-2 ${
              filterType === '_isPileOfShame' ? 'bg-blue-800' : 'from-blue-600'
            }`}
            onClick={() => handleFilter('_isPileOfShame')}
          >
            PILE OF SHAME
          </button>
        </div>
        <div className="relative ml-auto">
          <button
            type="button"
            className="bg-transparent hover:brightness-110 px-2 py-1 rounded-full font-medium text-slate-400 text-lg"
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            <FaSortAmountDownAlt />
          </button>
          {toggleDropdown && (
            <div className="dropdown z-50">
              <div className="flex justify-start w-full px-4 text-md"> Sort By:</div>
              <div className="dropdown_link flex items-center" onClick={() => handleSort('alphabetical')}>
                A-Z
              </div>
              <div className="dropdown_link flex items-center" onClick={() => handleSort('rating')}>
                Rating
              </div>
              <div className="dropdown_link flex items-center" onClick={() => handleSort('hours')}>
                Completion Hours
              </div>
              <div className="dropdown_link flex items-center" onClick={() => handleSort('release')}>
                Release Date
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap w-full justify-start py-8">
        {library.map((game, i) => (
          <Link href={`/my-library/${game._id}`} key={game._id}>
            <Game index={i} game={game} canSubmit={false} />
          </Link>
        ))}
      </div>

      {isLoading && <Spinner size={40} message={'Loading library'} />}
    </section>
  );
};

export default MyLibrary;
