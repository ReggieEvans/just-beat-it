import Spinner from '@components/Spinner';
import Image from 'next/image';
import { FaXmark } from 'react-icons/fa6';

const AddHours = ({
  setShowAddHours,
  hourOptions,
  isLoadingHourOptions,
  handleAddCompletionHours,
  gameId,
}) => {
  console.log(hourOptions);

  return (
    <section className='absolute top-0 left-0 h-auto w-full bg-slate-800 rounded-md shadow-lg py-2 px-4 z-50'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='head_text_second text-left mb-4'>
            <span className='slate_gradient'>ADD HOURS</span>
          </h1>
        </div>
        <button onClick={() => setShowAddHours(false)}>
          <FaXmark />
        </button>
      </div>

      {isLoadingHourOptions && <Spinner size={30} message={'Loading...'} />}

      {hourOptions.map((h) => (
        <div className='flex mb-8 bg-slate-900 p-3 rounded-md ' key={h.id}>
          <div className='min-w-[76px]'>
            <Image src={h.imageUrl} width={76} height={115} />
          </div>
          <div className='flex flex-col px-4 grow'>
            <div className='text-lg text-slate-200'>{h.name}</div>
            <div className='flex text-xs text-slate-400 pb-2'>
              <div className='pr-2'>M: {h.gameplayMain}</div>
              <div className='pr-2'>M+: {h.gameplayMainExtra}</div>
              <div className='pr-2'>CMP: {h.gameplayCompletionist}</div>
            </div>
            <div className='mt-auto'>
              <button
                className='p-1 w-full bg-purple-600 text-slate-200 text-sm rounded-sm font-bold'
                onClick={() => handleAddCompletionHours(gameId, h)}
              >
                ADD +
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AddHours;
