import '@styles/globals.css';

import Provider from '@components/Provider';
import MainLayout from './main-layout';

export const metadata = {
  title: 'Just Beat It',
  description: 'Track and manage your video game backlog.',
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Provider>
        <div className="main">
          <div className="gradient" />
        </div>

        <main className="app relative w-full text-slate-500">
          <MainLayout>{children}</MainLayout>
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
