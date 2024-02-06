import '@styles/globals.css';

import Provider from '@components/Provider';
import MainLayout from './main-layout';
import ToastProvider from '@utils/toast.provider';

export const metadata = {
  title: 'Just Beat It',
  description: 'Track and manage your video game backlog.',
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <ToastProvider>
        <Provider>
          <div className='main'>
            <div className='gradient' />
          </div>

          <main className='app relative w-full text-slate-500'>
            <MainLayout>{children}</MainLayout>
          </main>
        </Provider>
      </ToastProvider>
    </body>
  </html>
);

export default RootLayout;
