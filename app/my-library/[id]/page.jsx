'use client';

import AddHours from '@app/add-hours/page';
import BtnSpinner from '@components/BtnSpinner';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheckSquare, FaClock, FaPlay, FaPlayCircle, FaTrashAlt } from 'react-icons/fa';
import { FaArrowLeft, FaHandMiddleFinger, FaSkull } from 'react-icons/fa6';
import { MdGamepad } from 'react-icons/md';

const GameDetails = ({ params }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [hourOptions, setHourOptions] = useState([]);
  const [showAddHours, setShowAddHours] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHourOptions, setIsLoadingHourOptions] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [submittingState, setIsSubmittingState] = useState({
    _isInProgress: false,
    _isCompleted: false,
    _isQuit: false,
    _hours: false,
    _delete: false,
  });

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
    setIsSubmittingState({
      ...submittingState,
      [status]: true,
    });
    const response = await fetch(`/api/games/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        userId: session?.user.id,
        status,
      }),
    });
    const data = await response.json();
    setGame(data);
    setToggleDropdown(false);
    setIsSubmittingState({
      ...submittingState,
      [status]: false,
    });
  };

  const handleAddHours = async (name) => {
    setToggleDropdown(false);
    setIsLoadingHourOptions(true);
    setShowAddHours(!showAddHours);
    const response = await fetch(`/api/hours`, {
      method: 'POST',
      body: JSON.stringify({
        searchText: name,
      }),
    });
    const data = await response.json();
    setHourOptions(data.games);
    setIsLoadingHourOptions(false);
  };

  const handleAddCompletionHours = async (gameId, hoursObj) => {
    setIsSubmittingState({
      ...submittingState,
      _hours: true,
    });

    const response = await fetch(`/api/hours`, {
      method: 'PATCH',
      body: JSON.stringify({
        gameId,
        hoursObj,
      }),
    });
    const data = await response.json();
    setGame(data[0]);

    setIsSubmittingState({
      ...submittingState,
      _hours: false,
    });

    setShowAddHours(false);
  };

  const handleDelete = async (gameId) => {
    setIsSubmittingState({
      ...submittingState,
      _delete: true,
    });

    await fetch(`/api/games/${gameId}`, {
      method: 'DELETE',
    });
    router.push('/my-library');

    setIsSubmittingState({
      ...submittingState,
      _delete: false,
    });
  };

  return (
    <>
      {game && (
        <>
          <Link href={'/my-library'} className="flex items-center pb-3 text-sm">
            <FaArrowLeft className="mr-2 " /> Back to Library
          </Link>
          <div className="relative w-full p-4">
            <div className="absolute top-0 left-0 w-full h-[250px] -z-10">
              <div style={{ background: `url(https:${screenshot}) center` }} className="w-full h-[250px] blur-sm"></div>
            </div>
            <div className="flex items-end h-[250px] justify-between">
              <div className="flex min-h-[250px] min-w-[175px] -mb-8 items-end">
                <Image className="rounded-md" src={`https:${cover}`} width={175} height={233} alt="Video game Cover" />
                <div className="hidden md:block mb-8 px-6">
                  <div className="text-3xl font-medium text-white ">{game.name}</div>
                  <div className="text-sm text-slate-300 text_shadow">{companies.join(', ')}</div>
                  <div className="text-sm text-slate-300 text_shadow">
                    Completion Hours: {game._gameplayHours?.gameplayMain ? game._gameplayHours?.gameplayMain : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center text-3xl font-bold bg-white w-[50px] h-[50px] p-8 rounded-full text-green-600 border-[6px] border-green-600 -mb-4">
                {(game.total_rating / 10).toFixed(1)}
              </div>
            </div>
            <div className="flex justify-between items-center pt-8 md:hidden mt-2">
              <div>
                <div className="text-2xl font-bold uppercase text-white">{game.name}</div>
                <div className="text-sm text-slate-300 text_shadow">{companies.join(', ')}</div>
                <div className="text-sm text-slate-300 text_shadow">
                  Completion Hours: {game._gameplayHours?.gameplayMain ? game._gameplayHours?.gameplayMain : 'N/A'}
                </div>
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
                  <div className="dropdown z-50">
                    <div className="dropdown_link flex items-center" onClick={() => handleAddHours(game.name)}>
                      {submittingState._hours ? (
                        <BtnSpinner size={16} />
                      ) : (
                        <div className="flex items-center">
                          <FaClock className="mr-2" /> Add Hours
                        </div>
                      )}
                    </div>
                    <div
                      className="dropdown_link flex items-center"
                      onClick={() => handleStatus('_isInProgress', game._id)}
                    >
                      {submittingState._isInProgress ? (
                        <BtnSpinner size={16} />
                      ) : (
                        <div className="flex items-center">
                          <FaPlayCircle className="mr-2" /> {game._isInProgress ? 'Stop Playing' : 'Start Playing!'}
                        </div>
                      )}
                    </div>
                    <div
                      className="dropdown_link flex items-center"
                      onClick={() => handleStatus('_isCompleted', game._id)}
                    >
                      {submittingState._isCompleted ? (
                        <BtnSpinner size={16} />
                      ) : (
                        <div className="flex items-center">
                          <FaCheckSquare className="mr-2" /> {game._isCompleted ? 'Not Beaten' : 'I Beat It!'}
                        </div>
                      )}
                    </div>
                    <div className="dropdown_link flex items-center" onClick={() => handleStatus('_isQuit', game._id)}>
                      {submittingState._isQuit ? (
                        <BtnSpinner size={16} />
                      ) : (
                        <div className="flex items-center">
                          <FaSkull className="mr-2 text-sm" /> {game._isQuit ? 'UnQuit Game' : 'I Quit!'}
                        </div>
                      )}
                    </div>
                    <div className="dropdown_link flex items-center" onClick={() => handleDelete(game._id)}>
                      {submittingState._delete ? (
                        <BtnSpinner size={20} />
                      ) : (
                        <div className="flex items-center">
                          <FaTrashAlt className="mr-2" /> Delete Game
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative flex mt-8">
            <div className="min-w-[200px] pt-2 px-4 hidden md:block">
              <div
                className="flex w-full items-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleAddHours(game.name)}
              >
                {submittingState._hours ? (
                  <BtnSpinner size={20} />
                ) : (
                  <div className="flex items-center">
                    <FaClock className="mr-2" /> Add Hours
                  </div>
                )}
              </div>
              <div
                className="flex w-full items-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleStatus('_isInProgress', game._id)}
              >
                {submittingState._isInProgress ? (
                  <BtnSpinner size={20} />
                ) : (
                  <div className="flex items-center">
                    <FaPlayCircle className="mr-2" /> {game._isInProgress ? 'Stop Playing' : 'Start Playing!'}
                  </div>
                )}
              </div>
              <div
                className="flex w-full items-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleStatus('_isCompleted', game._id)}
              >
                {submittingState._isCompleted ? (
                  <BtnSpinner size={20} />
                ) : (
                  <div className="flex items-center">
                    <FaCheckSquare className="mr-2" /> {game._isCompleted ? 'Not Beaten' : 'I Beat It!'}
                  </div>
                )}
              </div>
              <div
                className="flex w-full items-center p-2 bg-blue-600 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleStatus('_isQuit', game._id)}
              >
                {submittingState._isQuit ? (
                  <BtnSpinner size={20} />
                ) : (
                  <div className="flex items-center">
                    <FaSkull className="mr-4 text-sm" /> {game._isQuit ? 'UnQuit Game' : 'I Quit!'}
                  </div>
                )}
              </div>
              <div
                className="flex w-full items-center p-2 bg-red-700 text-white mb-4 rounded-sm cursor-pointer"
                onClick={() => handleDelete(game._id)}
              >
                {submittingState._delete ? (
                  <BtnSpinner size={20} />
                ) : (
                  <div className="flex items-center">
                    <FaTrashAlt className="mr-2" /> Delete Game
                  </div>
                )}
              </div>
            </div>
            <div className="px-4">{game.summary}</div>

            {showAddHours && (
              <>
                <AddHours
                  setShowAddHours={setShowAddHours}
                  isLoadingHourOptions={isLoadingHourOptions}
                  hourOptions={hourOptions}
                  handleAddCompletionHours={handleAddCompletionHours}
                  gameId={game._id}
                  submittingHours={submittingState._hours}
                />
              </>
            )}
          </div>
          <div className="w-full py-8 px-4 md:hidden">
            <div
              className="flex w-full justify-center items-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer hover:brightness-110"
              onClick={() => handleAddHours(game.name)}
            >
              {submittingState._hours ? (
                <BtnSpinner size={20} />
              ) : (
                <div className="flex items-center py-1">
                  <FaClock className="mr-2" /> Add Hours
                </div>
              )}
            </div>
            <div
              className="flex w-full justify-center items-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer hover:brightness-110"
              onClick={() => handleStatus('_isInProgress', game._id)}
            >
              {submittingState._isInProgress ? (
                <BtnSpinner size={20} />
              ) : (
                <div className="flex items-center py-1">
                  <FaPlayCircle className="mr-2" /> {game._isInProgress ? 'Stop Playing' : 'Start Playing!'}
                </div>
              )}
            </div>
            <div
              className="flex w-full justify-center items-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer hover:brightness-110"
              onClick={() => handleStatus('_isCompleted', game._id)}
            >
              {submittingState._isCompleted ? (
                <BtnSpinner size={20} />
              ) : (
                <div className="flex items-center py-1">
                  <FaCheckSquare className="mr-2" /> {game._isCompleted ? 'Not Beaten' : 'I Beat It!'}
                </div>
              )}
            </div>
            <div
              className="flex w-full justify-center items-center p-2 bg-blue-600 text-white mb-4 rounded-md cursor-pointer hover:brightness-110"
              onClick={() => handleStatus('_isQuit', game._id)}
            >
              {submittingState._isQuit ? (
                <BtnSpinner size={20} />
              ) : (
                <div className="flex items-center py-1">
                  <FaSkull className="mr-4 text-sm" /> {game._isQuit ? 'UnQuit Game' : 'I Quit!'}
                </div>
              )}
            </div>
            <div
              className="flex w-full justify-center items-center p-2 bg-red-700 text-white mb-4 rounded-md cursor-pointer hover:brightness-110"
              onClick={() => handleDelete(game._id)}
            >
              {submittingState._delete ? (
                <BtnSpinner size={20} />
              ) : (
                <div className="flex items-center py-1">
                  <FaTrashAlt className="mr-2" /> Delete from library
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GameDetails;
