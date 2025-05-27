import React from "react";
import BannerLaptopImg from "../../assets/img/banner_laptop.jpg";
import { NavLink } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div
      className="relative flex items-center bg-cover flext-start bg-center text-left h-svh w-full"
      style={{ backgroundImage: `url(${BannerLaptopImg})` }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0"></div>
      <main className="px-10 lg:pl-24 lg:pr-0 z-10">
        <div className="text-left">
          <h2 className="text-2xl text-white">Laptop Gaming Hiệu Năng Cao</h2>
        </div>

        <p className="mt-3 text-white sm:mt-5 sm:max-w-xl text-6xl whitespace-nowrap">
          Đỉnh Cao Trải Nghiệm Game
        </p>

        <p className="mt-3 text-white sm:mt-5 sm:max-w-xl text-2xl whitespace-nowrap">
          FPS mượt mà • Cấu hình khủng • Thiết kế cực chất
        </p>

        <NavLink to="/laptop">
          <button className="border rounded mt-6 border-black hover:bg-white hover:text-black hover:border-black text-white bg-black w-44 h-12">
            Xem Ngay
          </button>
        </NavLink>
      </main>
    </div>
  );
};

export default HeroSection;
