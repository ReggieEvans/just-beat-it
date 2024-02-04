'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const { data: session } = useSession();

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center blue_gradient pb-4">
        Track & Manage <br className="max-md:hidden" /> <span className="text-center">Your Video Game Backlog</span>
      </h1>
      <p className="text-center text-lg py-8 px-2 text-slate-400">
        <span className="italic">Just Beat It</span> is a visual tracking tool for managing, organizing and completing
        your pile of shame.
      </p>

      <div className="sm:hidden flex py-6">
        {session?.user && (
          <Link href="/my-library" className="blue_btn">
            My Library
          </Link>
        )}
      </div>

      <div>
        <Image
          src="/assets/images/collage.png"
          width={1920}
          height={1020}
          alt="Picture of video games"
          className="image-test"
        />
      </div>
    </section>
  );
};

export default Home;
