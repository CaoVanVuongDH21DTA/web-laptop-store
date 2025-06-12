import React from "react";
import { Wishlist } from "../common/Wishlist";
import { AccountIcon } from "../common/AccountIcon";
import { CartIcon } from "../common/CartIcon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { countCartItems } from "../../store/features/cart";
import { selectTotalQuantity } from "../../store/features/cart"; 

const Navigation = ({ variant = "default" }) => {
  const cartLength = useSelector(countCartItems);
  const navigate = useNavigate();
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <nav className="flex items-center py-6 px-16 justify-between gap-20 custom-nav">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <a className="text-3xl text-black font-bold gap-8" href="/">
          LaptopStore
        </a>
      </div>
      {variant === "default" && (
        <div className="flex flex-wrap items-center gap-10">
          {/* Nav items */}
          <ul className="flex gap-14 text-gray-600 hover:text-black">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Trang Chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/laptop"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Laptop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/linh-kien"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Linh Kiện Laptop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/phu-kien"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Phụ Kiện Laptop
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {variant === "default" && (
        <div className="flex justify-center">
          {/* Search bar */}
          <div className="border rounded flex overflow-hidden">
            <div className="flex items-center justify-center px-4 border-1">
              <svg
                className="h-4 w-4 text-grey-dark"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
              <input
                type="text"
                className="px-4 py-2 outline-none"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {/* Action Items - icons */}
        {variant === "default" && (
          <ul className="flex gap-8 ">
            <li>
              <button>
                <Wishlist />
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/account-details/profile")}>
                <AccountIcon />
              </button>
            </li>
            <li>
              <Link to="/cart-items" className="flex flex-wrap relative">
                <CartIcon />
                {totalQuantity > 0 && (
                  <div className="absolute ml-6 mt-0 inline-flex items-center justify-center h-5 w-5 bg-black text-white rounded-full border-2 text-xs border-white">
                    {totalQuantity}
                  </div>
                )}
              </Link>
            </li>
          </ul>
        )}
        {variant === "auth" && (
          <ul className="flex gap-8">
            <li className="text-black border border-black hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">
              <NavLink
                to={"/v1/login"}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Login
              </NavLink>
            </li>
            <li className="text-black border border-black hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">
              <NavLink
                to="/v1/register"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Signup
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
