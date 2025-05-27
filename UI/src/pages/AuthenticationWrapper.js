import React from "react";
import Navigation from "../components/Navigation/Navigation";
import { Outlet, useLocation } from "react-router-dom";
import BckgImage from "../assets/img/bg-1.png";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner/Spinner";
import { motion } from "framer-motion";

const AuthenticationWrapper = () => {
  const location = useLocation();
  const isLoading = useSelector((state) => state?.commonState?.loading);
  return (
    <div>
      <Navigation variant="auth" />
      <div className="flex w-full items-center justify-center px-4">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl">
          {/* Hình ảnh */}
          <div className="hidden md:block md:w-1/2 lg:w-2/3 p-2">
            <img
              src={BckgImage}
              alt="gamingimage"
              className="w-full h-auto object-cover rounded-xl shadow"
            />
          </div>

          {/* Nội dung (form, outlet, v.v.) */}
          <motion.div
            key={location.pathname}
            className="w-full md:w-1/2 lg:w-1/3 p-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20}}
          >
            <Outlet />
          </motion.div>
        </div>

        {isLoading && <Spinner />}
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
