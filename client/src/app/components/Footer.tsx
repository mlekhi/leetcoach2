import React from "react";

function Footer() {
  return (
    <footer className="text-white py-6 flex flex-col items-center">
      <div className="footer-links flex space-x-6 mb-4">
        {/* Uncomment these when you have the sections */}
        {/* <a href="#about" className="hover:text-gray-400">About</a>
        <a href="#terms" className="hover:text-gray-400">Terms of Service</a>
        <a href="#privacy" className="hover:text-gray-400">Privacy Policy</a> */}
      </div>
      <p className="text-gray-500">
        &copy; {new Date().getFullYear()} LeetCoach. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
