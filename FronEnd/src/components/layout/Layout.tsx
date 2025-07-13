
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
      <NewsTicker />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
