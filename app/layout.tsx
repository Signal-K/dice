import React from 'react';
import { ReactNode } from 'react'; 
import './globals.css'; 

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en"> {/* Add the html tag */}
      <head>
        {/* You can add custom head tags like meta, title, and more */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Site Title</title>
      </head>
      <body> {/* Add the body tag */}
        <header>
          <h1>Lichen Subscrip</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;