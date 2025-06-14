import React from "react";
import ArrowIcon from "../common/ArrowIcon";

const Card = ({
  imagePath,
  title,
  description,
  actionArrow,
  height,
  width,
  onClick
}) => {
  return (
    <div className="flex flex-col p-3 sm:p-4 md:p-6">
      <div className="flex justify-center items-center h-[200px] cursor-pointer" onClick={onClick}>
        <img
          className="object-contain rounded-lg hover:scale-105 transition duration-200 w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] h-auto"
          src={imagePath}
          alt={title}
          style={{
            maxHeight: height || "200px",
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <p className="text-base sm:text-lg font-medium p-1">{title}</p>
          {description && (
            <p className="text-sm px-1 text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
        {actionArrow && (
          <span className="cursor-pointer pr-2 items-center">
            <ArrowIcon />
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;