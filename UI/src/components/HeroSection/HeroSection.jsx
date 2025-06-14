import React from "react";
import BannerLaptopImg from "../../assets/img/banner_laptop.jpg";
import { NavLink } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div
      className="relative flex items-center bg-cover bg-center text-left 
        min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] w-full"
      style={{ backgroundImage: `url(${BannerLaptopImg})` }}
    >
      {/* Overlay tối để tăng độ tương phản chữ */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <main className="relative z-10 px-4 sm:px-8 lg:px-24 py-12">
        <div className="text-left space-y-4">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl">
            Laptop Gaming Hiệu Năng Cao
          </h2>

          <p className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-[90vw] sm:max-w-xl">
            Đỉnh Cao Trải Nghiệm Game
          </p>

          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl max-w-[90vw] sm:max-w-xl">
            FPS mượt mà • Cấu hình khủng • Thiết kế cực chất
          </p>

          <NavLink to="/laptop">
            <button className="border rounded mt-6 border-white hover:bg-white hover:text-black hover:border-black text-white bg-black w-36 h-10 sm:w-44 sm:h-12 transition">
              Xem Ngay
            </button>
          </NavLink>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;