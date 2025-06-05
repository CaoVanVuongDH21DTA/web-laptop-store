import React, { useEffect, useState, useMemo } from "react";
import FilterIcon from "../../components/common/FilterIcon";
import Categories from "../../components/Filters/Categories";
import PriceFilter from "../../components/Filters/PriceFilter";
import ColorsFilter from "../../components/Filters/ColorsFilter";
import MetaDataFilter from "../../components/Filters/MetaDataFilter";
import ProductCard from "./ProductCard";
import { getAllProducts } from "../../api/fetchProducts";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import { useParams } from "react-router-dom";
import { fetchCategoriesCode } from "../../api/fetchCategories";
import { filterProducts } from "../../components/Filters/FilterProducts";
import axios from "axios";
import {
  API_BASE_URL,
  API_URLS,
  getHeaders,
} from "../../api/constant"; // cập nhật đúng đường dẫn của bạn

const ProductListPage = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

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

  useEffect(() => {
  const fetchData = async () => {
    dispatch(setLoading(true));
    try {
      // Lấy tất cả categories
      const categories = await fetchCategoriesCode();

      // Tìm category có code trùng với slug
      const foundCategory = categories?.find(
        (cat) => cat.code.toLowerCase() === categorySlug?.toLowerCase()
      );

      setCategory(foundCategory || null);

      if (foundCategory?.id) {
        // Lấy sản phẩm theo categoryId
        const productsRes = await axios.get(
          `${API_BASE_URL}/api/products?categoryId=${foundCategory.id}`,
          { headers: getHeaders() }
        );
        setProducts(productsRes.data || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error loading products by category code:", err);
      setProducts([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  fetchData();
}, [categorySlug, dispatch]);


  const categoryType = category?.code?.toUpperCase();

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [products, filters]);

  return (
    <div>
      <div className="flex">
        {/* Filter */}
        <div className="w-[20%] p-[10px] border rounded-lg m-[20px]">
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filter</p>
            <FilterIcon />
          </div>

          <div>
            <p className="text-[16px] text-black mt-5">Categories</p>
            <Categories
              selectedTypes={filters.types}
              onChange={(values) =>
                setFilters((prev) => ({ ...prev, types: values }))
              }
            />
            <hr />
          </div>

          <PriceFilter
            onChange={(range) =>
              setFilters((prev) => ({ ...prev, price: range }))
            }
          />
          <hr />

          {/* Colors filter only for PHUKIEN */}
          {categoryType === "PHUKIEN" && (
            <>
              <ColorsFilter
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, colors: values }))
                }
              />
              <hr />
            </>
          )}

          {/* LAPTOP filters */}
          {categoryType === "LAPTOP" && (
            <>
              <MetaDataFilter
                title="Thương hiệu"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, brands: values }))
                }
              />
              <MetaDataFilter
                title="Kích cỡ màn hình"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, screen_size: values }))
                }
              />
              <MetaDataFilter
                title="RAM"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, ram: values }))
                }
              />
              <MetaDataFilter
                title="CPU"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, cpu: values }))
                }
              />
              <hr />
            </>
          )}

          {/* LINHKIEN filters */}
          {categoryType === "LINHKIEN" && (
            <>
              <MetaDataFilter
                title="Thương hiệu"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, brands: values }))
                }
              />
              <MetaDataFilter
                title="Loại kết nối"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, connectivity: values }))
                }
              />
              <hr />
            </>
          )}

          {/* PHUKIEN filters */}
          {categoryType === "PHUKIEN" && (
            <>
              <MetaDataFilter
                title="Thương hiệu"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, brands: values }))
                }
              />
              <MetaDataFilter
                title="Cổng kết nối"
                onChange={(values) =>
                  setFilters((prev) => ({ ...prev, connectivity: values }))
                }
              />
              <hr />
            </>
          )}
        </div>

        {/* Products */}
        <div className="p-[15px]">
          <p className="text-black text-lg">{category?.description}</p>
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {filteredProducts?.map((item, index) => (
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
