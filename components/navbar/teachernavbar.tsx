"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility on mobile
  const { data: session, status } = useSession(); // Fetch session data

  // Helper function to check the roles of the user
  const isAdmin = session?.user?.isAdmin;
  const isTeacher = session?.user?.isTeacher;
  const isStudent = session?.user?.isStudent;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu state
  };

  // Render Admin Fields
  const renderAdminFields = () => (
    <>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Add Announcement
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Upload Marks
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Show Marks
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Subjects
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Admin
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Make Admin
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Make Teacher
        </a>
      </li>
    </>
  );

  // Render Teacher Fields
  const renderTeacherFields = () => (
    <>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Announcements
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Add Announcement
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Upload Marks
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Show Marks
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Subjects
        </a>
      </li>
    </>
  );

  // Render Common Fields
  const renderCommonFields = () => (
    <>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Clubs
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Add Club
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Student Subjects
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-blue-400 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:text-white active:text-gray-600"
        >
          Teacher Subjects
        </a>
      </li>
    </>
  );

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-3 sticky top-0 left-0 w-full z-10">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
        <Logo />
        <UserMenu />

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menu */}
      <div className={`mt-4 space-y-4 ${isMenuOpen ? "block" : "hidden"} md:block`}>
        <ul className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0">
          {isTeacher && renderAdminFields()}
          {!isTeacher && isAdmin && renderTeacherFields()} 
          {isStudent && !isAdmin && !isTeacher && renderCommonFields()} {/* Render common fields for students only */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
