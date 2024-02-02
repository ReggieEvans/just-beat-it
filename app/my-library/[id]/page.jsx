'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdGamepad } from 'react-icons/md';

const GameDetails = ({ params }) => {
  const { data: session } = useSession();

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setIsSubmitting] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const screenshot = game?.screenshots[0]?.url.replace('t_thumb', 't_screenshot_big');
  let cover = game?.cover?.url.replace('t_thumb', 't_cover_big');
  let companies = game?.involved_companies.map((c) => c.company.name);

  const fetchGame = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/games/${params.id}`);
    const data = await response.json();

    setGame(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGame();
  }, []);

  const handleStatus = async (status, gameId) => {
    const response = await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        userId: session?.user.id,
        status,
      }),
    });
    const data = await response.json();
    setToggleDropdown(false);
  };

  const handleAddHours = (id) => {
    console.log(id);
    setToggleDropdown(false);
  };

  return (
    <>
      {game && (
        <>
          <div className="relative w-full p-4">
            <div className="absolute top-0 left-0 w-full h-[250px] -z-10">
              <div style={{ background: `url(https:${screenshot}) center` }} className="w-full h-[250px] blur-sm"></div>
            </div>
            <div className="flex items-end h-[250px] justify-between">
              <div className="flex min-h-[250px] min-w-[175px] -mb-8 items-end">
                <Image className="rounded-md" src={`https:${cover}`} width={175} height={233} alt="Video game Cover" />
                <div className="hidden md:block mb-8 px-6">
                  <div className="text-3xl font-medium text-white ">{game.name}</div>
                  <div className="text-sm">{companies.join(', ')}</div>
                </div>
              </div>

              <div className="flex items-center justify-center text-3xl font-bold bg-white w-[50px] h-[50px] p-8 rounded-full text-green-600 border-[6px] border-green-600 -mb-4">
                {(game.total_rating / 10).toFixed(1)}
              </div>
            </div>
            <div className="flex justify-between items-center pt-8 md:hidden mt-2">
              <div>
                <div className="text-2xl font-bold uppercase text-white">{game.name}</div>
                <div className="text-sm">{companies.join(', ')}</div>
              </div>
              <div className="relative self-start mt-2">
                <button
                  type="button"
                  className="relative blue-600 px-2"
                  onClick={() => setToggleDropdown(!toggleDropdown)}
                >
                  <MdGamepad className="text-2xl text-blue-400" />
                </button>

                {toggleDropdown && (
                  <div className="dropdown">
                    <div className="dropdown_link" onClick={() => handleAddHours(game.id)}>
                      Add Hours
                    </div>
                    <div className="dropdown_link" onClick={() => handleStatus('_isInProgress', game.id)}>
                      {game._isInProgress ? 'Not Playing' : 'Play This Game Now!'}
                    </div>
                    <div className="dropdown_link" onClick={() => handleStatus('_isComplete', game.id)}>
                      {game._isCompleted ? 'Not Beaten' : 'I Beat It!'}
                    </div>
                    <div className="dropdown_link" onClick={() => handleStatus('_isQuit', game.id)}>
                      {game._isQuit ? 'UnQuit Game' : 'I Quit!'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex mt-8">
            <div className="min-w-[200px] pt-2 px-4 hidden md:block">
              <div
                className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleAddHours(game.id)}
              >
                Add Hours
              </div>
              <div
                className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleStatus('_isInProgress', game.id)}
              >
                {game._isInProgress ? 'Not Playing' : 'Play This Game Now!'}
              </div>
              <div
                className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleStatus('_isCompleted', game.id)}
              >
                {game._isCompleted ? 'Not Beaten' : 'I Beat It!'}
              </div>
              <div
                className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleStatus('_isQuit', game.id)}
              >
                {game._isQuit ? 'UnQuit Game' : 'I Quit!'}
              </div>
            </div>
            <div className="px-4">{game.summary}</div>
          </div>
          <div className="w-full py-8 px-4 md:hidden">
            <div
              className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer"
              onClick={() => handleAddHours(game.id)}
            >
              Add Hours
            </div>
            <div
              className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer"
              onClick={() => handleStatus('_isInProgress', game.id)}
            >
              {game._isInProgress ? 'Not Playing' : 'Play This Game Now!'}
            </div>
            <div
              className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer"
              onClick={() => handleStatus('_isCompleted', game.id)}
            >
              {game._isCompleted ? 'Not Beaten' : 'I Beat It!'}
            </div>
            <div
              className="w-full text-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer"
              onClick={() => handleStatus('_isQuit', game.id)}
            >
              {game._isQuit ? 'UnQuit Game' : 'I Quit!'}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GameDetails;
