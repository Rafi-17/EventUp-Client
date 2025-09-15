import React from "react";
import logo from '../../../../src/assets/favicon.png'
import { Link, NavLink, useLocation } from "react-router-dom";
import { ImMenu } from "react-icons/im";
import useAuth from "../../../hooks/useAuth";
import { span } from "motion/react-client";
import UserDropdown from "./UserDropdown";
import useRole from "../../../hooks/useRole";

const Navbar = () => {
  const {user} = useAuth();
  const [role] = useRole();
    const location = useLocation();

    const navLinks=<>
            <li><NavLink className={({ isActive, isPending }) =>`bitter  ${isPending ? "pending" : ""} ${isActive ? "text-[#FF6B00]" : ""}`} to="/">Home</NavLink> </li>
            <li><NavLink className={({ isActive, isPending }) =>` ${isPending ? "pending" : ""} ${isActive ? "text-[#FF6B00]" : ""}`} to="/events">Events</NavLink> </li>
            <li><NavLink className={({ isActive, isPending }) =>` ${isPending ? "pending" : ""} ${isActive ? "text-[#FF6B00]" : ""}`} to="/about">About</NavLink> </li>
            <li><NavLink className={({ isActive, isPending }) =>` ${isPending ? "pending" : ""} ${isActive ? "text-[#FF6B00]" : ""}`} to="/contact">Contact</NavLink> </li>
            {(role ==='organizer' || role === 'admin') && <li><NavLink className={({ isActive, isPending }) =>` ${isPending ? "pending" : ""} ${isActive ? "text-[#FF6B00]" : ""}`} to="/dashboard/addEvent">Add Event</NavLink> </li>}
    
    </>

  return (
    <div className={`${location.pathname=='/'? 'absolute top-0 z-10 bg-transparent':'bg-gray-900 relative'} navbar  max-w-screen-xl mx-auto`}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="mr-2 btn-ghost text-white lg:hidden">
            <ImMenu className="h-5 w-5 "></ImMenu>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content text-white bg-[#151515] bg-opacity-70 rounded-box z-[1] mt-3 w-44 p-2 shadow-lg text-sm"
          >
            {navLinks}
          </ul>
        </div>
            <div className="hidden lg:flex items-center">
                    <img className="h-8 w-8 mr-2" src={logo} alt="" />
                    <p className="text-lg text-white font-bold">EventUp</p>
            </div>
      </div>
      <div className="navbar-center flex justify-center lg:hidden">
                <div className="flex items-center">
                    <img className="h-8 w-8 md:mr-2" src={logo} alt="" />
                    <p className="text-xl text-white font-bold">EventUp</p>
                </div>
            </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal font-bold text-base text-white px-1">
          {navLinks}
        </ul>
      </div>
      <div className="navbar-end">
        {
          user && user?.email ? <>
            <UserDropdown></UserDropdown>
          </> :

        <Link to={'/login'} className="text-white bg-[#FF6B00] text-sm px-3 py-2 font-bold md:mr-3 rounded-sm">Login</Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
