import React from 'react';
import { ReactNode } from 'react'; 
import './globals.css'; 

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Your Site Title</title>
      </head>
      <body>
        <header>
          <h1>Lichen Subscrip</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;