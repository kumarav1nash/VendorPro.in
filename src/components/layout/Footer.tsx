import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} VendorPro. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 