import React, { useEffect, useMemo, useState } from "react";
import FilterIcon from "../../components/common/FilterIcon";
import content from "../../data/content.json";
import Categories from "../../components/Filters/Categories";
import PriceFilter from "../../components/Filters/PriceFilter";
import ColorsFilter from "../../components/Filters/ColorsFilter";
import MetaDataFilter from "../../components/Filters/MetaDataFilter";
import ProductCard from "./ProductCard";
import { getAllProducts } from "../../api/fetchProducts";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { filterProducts } from "../../components/Filters/FilterProducts";
const categories = content?.categories;

const ProductListPage = ({ categoryType }) => {
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    brands: [],
    ram: [],
    cpu: [],
    screen_size: [],
    colors: [],
    connectivity: [],
    types: [],
    price: { min: 0, max: 500 },
  });

  const categoryContent = useMemo(() => {
    return categories?.find((category) => category.code === categoryType);
  }, [categoryType]);

  const productListItems = useMemo(() => {
    return content?.products?.filter(
      (product) => product?.category_id === categoryContent?.id
    );
  }, [categoryContent]);

  const category = useMemo(() => {
    return categoryData?.find((element) => element?.code === categoryType);
  }, [categoryData, categoryType]);

  useEffect(() => {
    if (categoryContent) {
      const filtered = filterProducts(
        content.products.filter((p) => p.category_id === categoryContent?.id),
        filters
      );
      setProducts(filtered);
    }
  }, [categoryContent, filters]);

  // useEffect(() => {
  //   dispatch(setLoading(true));
  //   getAllProducts(category?.id)
  //     .then((res) => {
  //       setProducts(res);
  //     })
  //     .catch((err) => {})
  //     .finally(() => {
  //       dispatch(setLoading(false));
  //     });
  // }, [category?.id, dispatch]);

  return (
    <div>
      <div className="flex">
        {/* Filter */}
        <div className="w-[20%] p-[10px] border rounded-lg m-[20px]">
          {/* Filters */}
          <div className="flex justify-between ">
            <p className="text-[16px] text-gray-600">Filter</p>
            <FilterIcon />
          </div>
          <div>
            {/* Product types */}
            <p className="text-[16px] text-black mt-5">Categories</p>
            <Categories
              types={categoryContent?.types}
              selectedTypes={filters.types}
              onChange={(values) =>
                setFilters((prev) => ({ ...prev, types: values }))
              }
            />
            <hr></hr>
          </div>
          {/* Price */}
          <PriceFilter
            onChange={(range) =>
              setFilters((prev) => ({ ...prev, price: range }))
            }
          />
          <hr></hr>
          {/* Colors */}
          {categoryType === "PHUKIEN" && (
            <>
              <ColorsFilter
                colors={categoryContent?.meta_data?.colors}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, colors: values }))
                }
              />
            </>
          )}
          <hr></hr>
          {/* Filter theo loại sản phẩm */}
          {categoryType === "LAPTOP" && (
            <>
              {/* Brands */}
              <MetaDataFilter
                title="Thương hiệu"
                data={categoryContent?.meta_data?.brands}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, brands: values }))
                }
              />
              {/* Sizes Screen */}
              <MetaDataFilter
                title="Kích cỡ màn hình"
                data={categoryContent?.meta_data?.screen_size}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, screen_size: values }))
                }
              />
              {/* RAM */}
              <MetaDataFilter
                title="RAM"
                data={categoryContent?.meta_data?.ram}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, ram: values }))
                }
              />
              {/* CPU */}
              <MetaDataFilter
                title="CPU"
                data={categoryContent?.meta_data?.cpu}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, cpu: values }))
                }
              />
            </>
          )}

          {categoryType === "LINHKIEN" && (
            <>
              {/* Brands */}
              <MetaDataFilter
                title="Thương hiệu"
                data={categoryContent?.meta_data?.brands}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, brands: values }))
                }
              />
              {/* Types */}
              <MetaDataFilter
                title="Loại kết nối"
                data={categoryContent?.meta_data?.types}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, connectivity: values }))
                }
              />
            </>
          )}

          {categoryType === "PHUKIEN" && (
            <>
              {/* Brands */}
              <MetaDataFilter
                title="Thương hiệu"
                data={categoryContent?.meta_data?.brands}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, brands: values }))
                }
              />

              {/* Brands */}
              <MetaDataFilter
                title="Cổng kết nối"
                data={categoryContent?.meta_data?.connectivity}
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, connectivity: values }))
                }
              />
            </>
          )}
        </div>
        {/* Products */}
        <div className="p-[15px]">
          <p className="text-black text-lg">{category?.description}</p>
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {products?.map((item, index) => (
              <ProductCard
                key={item?.id + "_" + index}
                {...item}
                title={item?.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;