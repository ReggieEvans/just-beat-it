'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { FaBarsStaggered } from 'react-icons/fa6';

const Nav = ({ handleShowSideNav }) => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <nav className="relative w-full mb-8 pt-8">
      {/* Desktop Navigation */}
      <div className="hidden sm:flex justify-between">
        <Link href="/" className="flex gap-2 flex-center">
          <Image src="/assets/images/flag-g.png" alt="logo" width={25} height={30} priority />
          <p className="font-medium text-2xl text-blue-200">
            <span className="font-thin">just</span> beat it
          </p>
        </Link>
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/my-library" className="blue_btn">
              My Library
            </Link>

            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>

            <div>
              <Image src={session?.user.image} width={37} height={37} className="rounded-full" alt="profile" priority />
            </div>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="black_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex flex-between relative">
        {session?.user ? (
          <div className="text-xl text-slate-300 cursor-pointer" onClick={handleShowSideNav}>
            <FaBarsStaggered />
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <Link href="/" className=" flex items-center font-medium text-xl text-slate-300">
            <Image src="/assets/images/flag-g.png" alt="logo" width={20} height={24} priority />
            <span className="ml-2 font-thin">just</span> beat it
          </Link>
        </div>
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={32}
              height={32}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
              priority
            />

            {toggleDropdown && (
              <div className="dropdown px-4">
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="w-full blue_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers ? (
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="text-slate-400"
                >
                  Sign in
                </button>
              ))
            ) : (
              <div className="w-[75px]"></div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
