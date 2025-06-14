import React from "react";
import SectionHeading from "../SectionsHeading/SectionHeading";
import Card from "../../Card/Card";
import { useNavigate } from "react-router-dom";

const Category = ({ title, data }) => {
  const navigate = useNavigate();

  const normalize = (str) => str?.toLowerCase()?.trim();

  const parentToSlugMap = {
    [normalize("Laptop")]: "laptop",
    [normalize("Phụ kiện")]: "phu-kien",
    [normalize("Linh kiện")]: "linh-kien",
  };

  const handleClickCategoryType = (item) => {
    let parentSlug = "laptop";
    if (item.itemType === "type") {
      const normalizedParent = normalize(item.parentName);
      parentSlug = parentToSlugMap[normalizedParent] || "laptop";
    } else if (item.itemType === "brand") {
      parentSlug = "laptop";
    }

    navigate(`/${parentSlug}`, {
      state: {
        autoFilter: {
          filterKey: item.itemType === "type" ? "type" : "brand",
          filterValue: item.title,
        },
      },
    });
  };

  return (
    <>
      <SectionHeading title={title} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-8">
        {data &&
          data.map((item, index) => (
            <Card
              key={index}
              title={item?.title}
              description={item?.description}
              imagePath={item?.img_category}
              actionArrow={true}
              height={"200px"}
              width={"100%"}
              onClick={() => handleClickCategoryType(item)}
            />
          ))}
      </div>
    </>
  );
};

export default Category;
