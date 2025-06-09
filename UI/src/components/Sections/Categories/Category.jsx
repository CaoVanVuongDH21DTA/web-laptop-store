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
    let parentSlug = "laptop"; // default
    if (item.itemType === "type") {
      // Nếu là categoryType, thì map theo parentName
      const normalizedParent = normalize(item.parentName);
      parentSlug = parentToSlugMap[normalizedParent] || "laptop";
    } else if (item.itemType === "brand") {
      // Nếu là categoryBrand, thì luôn đi về laptop
      parentSlug = "laptop";
    }

    navigate(`/${parentSlug}`, {
      state: {
        autoFilter: {
          filterKey: item.itemType === "type" ? "type" : "brand",
          filterValue: item.title, // Ưu tiên code
        },
      },
    });
  };

  return (
    <>
      <SectionHeading title={title} />
      <div className="flex items-center px-8 flex-wrap">
        {data &&
          data?.map((item, index) => {
            return (
              <Card
                key={index}
                title={item?.title}
                description={item?.description}
                imagePath={item?.img_category}
                actionArrow={true}
                height={"240px"}
                width={"200px"}
                onClick={() => handleClickCategoryType(item)}
              />
            );
          })}
      </div>
    </>
  );
};

export default Category;
