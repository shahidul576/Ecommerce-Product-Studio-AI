
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            E-commerce Product Studio AI
          </h1>
          <p className="mt-2 text-lg text-teal-600 font-semibold">
            উন্নত মানের ছবি দিয়ে আপনার ব্যবসাকে এগিয়ে নিন
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
