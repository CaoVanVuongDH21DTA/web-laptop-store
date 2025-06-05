import React, { useEffect } from "react";

import HeroSection from "./components/HeroSection/HeroSection";
import Category from "./components/Sections/Categories/Category";
import content from "./data/content.json";
import Footer from "./components/Footer/Footer";
import { fetchCategories } from "./api/fetchCategories";
import { useDispatch, useSelector } from "react-redux";
import { loadCategories } from "./store/features/category";
import { setLoading } from "./store/features/common";

const Shop = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state?.categoryState?.categories || []);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchCategories()
      .then((res) => {
        console.log("Fetched categories:", res);
        if (Array.isArray(res) && res.length > 0) {
          dispatch(loadCategories(res));
        } else {
          console.warn("Empty or invalid category response", res);
        }
      })
      .catch((err) => console.error("Fetch categories error:", err))
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return (
    <>
      <HeroSection />
      {/* ✅ Hiển thị categories từ Redux */}
      {categories?.map((item) => {
        // Ưu tiên categoryTypes, nếu không có thì dùng categoryBrands
        const types =
          item.categoryTypes && item.categoryTypes.length > 0
            ? item.categoryTypes.map((type) => ({
                title: type.name,
                description: type.description,
                img_category: type.img_category,
              }))
            : item.categoryBrands?.map((brand) => ({
                title: brand.name,
                description: brand.description,
                img_category: brand.img_category,
              }));

        // Bỏ qua nếu không có types (cả categoryTypes và categoryBrands đều trống)
        if (!types || types.length === 0) return null;

        return (
          <Category
            key={item.id}
            title={item.name}
            data={types}
          />
        );
      })}

      <Footer content={content?.footer} />
    </>
  );
};

export default Shop;
