import Image from 'next/image';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';

const SideNav = ({ showSideNav, handleShowSideNav }) => {
  return (
    <>
      {showSideNav && (
        <div className='sm:hidden absolute top-0 left-0 bg-slate-800 h-full w-[350px]'>
          <div className='flex justify-end p-4'>
            <button onClick={handleShowSideNav}>
              <FaTimes />
            </button>
          </div>
          <div className='flex gap-2 flex-center mb-6'>
            <Image
              src='/assets/images/flag-g.png'
              alt='logo'
              width={25}
              height={30}
              priority
            />
            <p className='font-medium text-2xl text-blue-200'>
              <span className='font-thin'>just</span> beat it
            </p>
          </div>
          <div className='flex flex-col text-center text-slate-400 mt-16'>
            <button
              onClick={handleShowSideNav}
              className='text-lg py-2 mb-1 cursor-pointer'
            >
              <Link href='/my-library'>My Library</Link>
            </button>
            <button
              onClick={handleShowSideNav}
              className='text-lg py-2 mb-1 cursor-pointer'
            >
              <Link href='/add-games'>Add Games</Link>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;
