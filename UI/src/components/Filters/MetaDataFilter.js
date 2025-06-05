import React, { useCallback, useEffect, useState } from "react";

const MetaDataFilter = ({
  title = "Kích cỡ màn hình",
  data = [],
  hideTitle = false,
  multi = true,
  onChange,
}) => {
  const [appliedValues, setAppliedValues] = useState([]);

  const onClickValue = useCallback(
    (item) => {
      setAppliedValues((prev) => {
        if (prev.includes(item)) {
          return prev.filter((v) => v !== item);
        }
        return multi ? [...prev, item] : [item];
      });
    },
    [multi]
  );

  useEffect(() => {
    if (onChange) onChange(appliedValues);
  }, [appliedValues]);

  return (
    <div className={`flex flex-col ${hideTitle ? "" : "mb-4"}`}>
      {!hideTitle && (
        <p className="text-[16px] text-black mt-5 mb-5">{title}</p>
      )}
      <div className="flex flex-wrap px-2">
        {data?.map((item, index) => (
          <div key={index} className="flex flex-col mr-2">
            <div
              className="w-max px-3 py-1 border text-center mb-4 rounded-lg cursor-pointer hover:scale-105 bg-white border-gray-500 text-gray-500"
              style={
                appliedValues.includes(item)
                  ? {
                      background: "black",
                      color: "white",
                    }
                  : {}
              }
              onClick={() => onClickValue(item)}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetaDataFilter;
