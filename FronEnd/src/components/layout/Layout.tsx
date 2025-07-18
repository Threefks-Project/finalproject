
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NewsTicker from '../common/NewsTicker';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-municipal-gray-light">
      <Header />
      <div className="hidden sm:block">
        <NewsTicker />
      </div>
      <main className="flex-1 px-2 sm:px-4 lg:px-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
