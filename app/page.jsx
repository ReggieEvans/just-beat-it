'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const { data: session } = useSession();

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Track & Manage <br className="max-md:hidden" />{' '}
        <span className="orange_gradient text-center">Your Video Game Backlog</span>
      </h1>
      <p className="desc text-center">
        Just Beat It is a visual tracking tool for managing, organizing and completing your pile of shame.
      </p>

      <div className="sm:hidden flex py-6">
        {session?.user && (
          <Link href="/my-library" className="black_btn">
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
