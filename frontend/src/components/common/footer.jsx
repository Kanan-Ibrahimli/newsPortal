import React from 'react';
const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} news sphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
