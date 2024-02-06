'use client';

import { useState } from 'react';
import SideNav from '@components/SideNav';
import Nav from '@components/Nav';
import Footer from '@components/Footer';

const MainLayout = ({ children }) => {
  const [showSideNav, setShowSideNav] = useState(false);

  const handleShowSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  return (
    <div className='flex flex-col h-screen w-full'>
      <Nav handleShowSideNav={handleShowSideNav} />
      {children}
      <Footer />
      <SideNav
        showSideNav={showSideNav}
        handleShowSideNav={handleShowSideNav}
      />
    </div>
  );
};

export default MainLayout;
