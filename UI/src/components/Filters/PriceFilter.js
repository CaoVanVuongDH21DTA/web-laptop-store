import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./PriceFilter.css";

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN") + " ₫";

const PriceFilter = ({ min = 0, max = 1000, onChange }) => {
  const [range, setRange] = useState({ min, max });

  useEffect(() => {
    setRange({ min, max });
  }, [min, max]);

  const handleChange = (values) => {
    const newRange = { min: values[0], max: values[1] };
    setRange(newRange);
    onChange && onChange(newRange);
  };

  return (
    <div className="flex flex-col mb-4">
      <p className="text-[16px] text-black mt-5 mb-5">Giá (VNĐ)</p>
      <RangeSlider
        className="custom-range-slider"
        min={min}
        max={max}
        defaultValue={[range.min, range.max]}
        onInput={handleChange}
      />

      <div className="flex justify-between">
        <div className="border rounded-lg h-8 mt-4 max-w-[50%] w-[40%] flex items-center px-2 text-gray-600">
          <input
            type="text"
            value={formatCurrency(range.min)}
            className="outline-none w-full text-right"
            disabled
          />
        </div>
        <div className="border rounded-lg h-8 mt-4 max-w-[50%] w-[40%] flex items-center px-2 text-gray-600">
          <input
            type="text"
            value={formatCurrency(range.max)}
            className="outline-none w-full text-right"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;