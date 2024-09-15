'use client';
import React from "react";
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar = () => {
  const { user, error, isLoading } = useUser();

  return (
    <nav className="flex w-full items-center justify-between px-7 py-3 text-sm fixed top-0 z-50">
      {" "}
      <div className="flex">
        <Link href="/" className="flex items-center">
          <img 
            src="logo.png"
            alt="LeetCoach"
            className="w-10 h-10 object-cover"
          />
          <h1 className="text-xl gradient-text font-extrabold font-roboto text-white">
            LeetCoach
          </h1> 
        </Link>
      </div>
      <div className="flex font-medium text-white/80">
        <Link href="https://github.com/mlekhi/leetcoach2">
          <h1 className="mx-4 pt-3 hover:border-b-2 border-blue-600 hover:text-blue-600">
            GitHub
          </h1>{" "}
        </Link>

        <div className="border-[0.5px] mt-3 h-8 border-white/25"></div>

        <Link href="https://devpost.com/software/leetcoach?ref_content=existing_user_added_to_software_team&ref_feature=portfolio&ref_medium=email&utm_campaign=software&utm_content=added_to_software_team&utm_medium=email&utm_source=transactional">
          <h1 className="mx-4 pt-3 hover:border-b-2 border-blue-600 hover:text-blue-600">
            Devpost
          </h1>{" "}
        </Link>

        
        <ul className="flex items-center justify-center px-4 py- rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 font-semibold shadow-neon-blue hover:shadow-neon-purple transition-all duration-300 ease-in-out transform hover:scale-105">
          {user?.email_verified ? (
            <li className="cursor-pointer">
            <a href="/api/auth/logout">Logout</a>
          </li>          
          ) : (
            <li
            className="cursor-pointer"
          >
            <a href="/api/auth/login">Login</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
