import React, {useState, useEffect, useRef} from "react";
import { Wishlist } from "../common/Wishlist";
import { AccountIcon } from "../common/AccountIcon";
import { CartIcon } from "../common/CartIcon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { selectTotalQuantity } from "../../store/features/cart"; 
import { getProductBySearch } from "../../api/fetchProducts";

const Navigation = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const totalQuantity = useSelector(selectTotalQuantity);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchBoxRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProductClick = (slug) => {
    setSearchTerm("");
    setFilteredProducts([]);
    navigate(`/product/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setFilteredProducts([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        getProductBySearch(searchTerm)
          .then((data) => {
            setFilteredProducts(data);
          })
          .catch((err) => {
            console.error("Lỗi khi tìm kiếm:", err);
            setFilteredProducts([]);
          });
      } else {
        setFilteredProducts([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center py-4 px-4 md:px-16 justify-between gap-4 md:gap-20 custom-nav">
      {/* Logo */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <a className="text-3xl text-black font-bold gap-8" href="/">
          LaptopStore
        </a>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Search Icon */}
          <button onClick={() => setShowSearchInput(!showSearchInput)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </button>

          {/* Menu Icon */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav Links */}
      {variant === "default" && (
        <div className={`${showMobileMenu ? "block" : "hidden"} w-full md:flex md:w-auto md:flex-wrap items-center gap-10`}>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-14 text-gray-600 hover:text-black">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Trang Chủ</NavLink>
            </li>
            <li>
              <NavLink to="/laptop" className={({ isActive }) => (isActive ? "active-link" : "")}>Laptop</NavLink>
            </li>
            <li>
              <NavLink to="/linh-kien" className={({ isActive }) => (isActive ? "active-link" : "")}>Linh Kiện Laptop</NavLink>
            </li>
            <li>
              <NavLink to="/phu-kien" className={({ isActive }) => (isActive ? "active-link" : "")}>Phụ Kiện Laptop</NavLink>
            </li>
          </ul>

          {/* Thêm icons/đăng nhập chung menu mobile */}
          <div className="flex flex-col md:hidden gap-4 pt-4 border-t border-gray-200 w-full">
            <div className="flex gap-6">
              <button><Wishlist /></button>
              <button onClick={() => navigate("/account-details/profile")}><AccountIcon /></button>
              <Link to="/cart-items" className="relative">
                <CartIcon />
                {totalQuantity > 0 && (
                  <div className="absolute -right-2 -top-2 inline-flex items-center justify-center h-4 w-4 bg-black text-white rounded-full text-xs">
                    {totalQuantity}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Box */}
      {variant === "default" && (
        <div className={`relative w-full md:w-[300px] ${showSearchInput || window.innerWidth >= 768 ? "block" : "hidden"}`} ref={searchBoxRef}>
          <div className="border rounded flex overflow-hidden w-full">
            <div className="flex items-center justify-center px-4 border-1 w-full">
              <svg className="h-4 w-4 text-grey-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 outline-none w-full"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>
          </div>

          {searchTerm && filteredProducts.length > 0 && (
            <ul className="absolute top-full left-0 bg-white shadow-lg mt-1 rounded w-full max-h-80 overflow-y-auto z-30 border border-gray-200">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <img
                    src={product.thumbnail || "/default-image.jpg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.price.toLocaleString()}₫</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Icons */}
      <div className="hidden md:flex flex-wrap items-center gap-4">
        {variant === "default" && (
          <ul className="flex gap-8">
            <li><button><Wishlist /></button></li>
            <li><button onClick={() => navigate("/account-details/profile")}><AccountIcon /></button></li>
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
              <NavLink to={"/v1/login"} className={({ isActive }) => (isActive ? "active-link" : "")}>Login</NavLink>
            </li>
            <li className="text-black border border-black hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">
              <NavLink to="/v1/register" className={({ isActive }) => (isActive ? "active-link" : "")}>Signup</NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;