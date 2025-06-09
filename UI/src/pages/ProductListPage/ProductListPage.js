import React, { useEffect, useState, useMemo } from "react";
import FilterIcon from "../../components/common/FilterIcon";
import PriceFilter from "../../components/Filters/PriceFilter";
import ProductCard from "./ProductCard";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common";
import { useParams, useLocation } from "react-router-dom";
import { fetchCategories} from "../../api/fetchCategories";
import { fetchFilters} from "../../api/fetchFilters";
import MetaDataFilter from "../../components/Filters/MetaDataFilter";
import axios from "axios";
import {
  API_BASE_URL,
  getHeaders
} from "../../api/constant"; // cập nhật đúng đường dẫn của bạn

const ProductListPage = () => {
  const location = useLocation();
  const { filterKey, filterValue } = location.state?.autoFilter || {};
  const { categorySlug } = useParams();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({
    price: { min: 0, max: 999999999 }
  });
  const [availableFilters, setAvailableFilters] = useState({});

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const handleFilterChange = (specType, selectedValues) => {
    setFilters((prev) => ({ ...prev, [specType]: selectedValues }));
  };

  useEffect(() => {
    if (products.length > 0) {
      const prices = products
        .map((p) => Number(p.price))
        .filter((p) => !isNaN(p));
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      setPriceRange({ min, max });

      // Optional: cập nhật filter giá luôn
      setFilters((prev) => ({
        ...prev,
        price: { min, max },
      }));
    }
  }, [products]);

  const slugToCode = (slug) => {
    if (!slug) return "";
    return slug.replace(/-/g, "").toUpperCase();
  };

  //bộ lọc filter product
  const filterProducts = (products, filters) => {
    return products.filter((product) => {
      return Object.entries(filters).every(([key, filterValues]) => {
        if (key === "price") {
          return (
            product.price >= filterValues.min &&
            product.price <= filterValues.max
          );
        }

        if (!Array.isArray(filterValues) || filterValues.length === 0)
          return true;

        if (
          !product.specifications ||
          !Array.isArray(product.specifications)
        )
          return false;

        // ✅ Trường hợp đặc biệt: categoryTypeName hoặc categoryBrandName
        if (key === "Loại sản phẩm") {
          return filterValues.includes(product.categoryTypeName);
        }

        if (key === "Hãng sản phẩm") {
          return filterValues.includes(product.categoryBrandName);
        }

        // ✅ Tìm tất cả `value` có `name` == key
        const specValues = product.specifications
          .filter((spec) => spec.name === key)
          .map((spec) => spec.value);

        // ✅ Kiểm tra xem có ít nhất 1 value người dùng chọn nằm trong specValues
        return filterValues.some((val) => specValues.includes(val));
      });
    });
  };

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [products, filters]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const categories = await fetchCategories();
        const codeFromSlug = slugToCode(categorySlug);
        const foundCategory = categories.find(
          (cat) => cat.code.toUpperCase() === codeFromSlug
        );
        setCategory(foundCategory || null);

        if (foundCategory?.id) {
          const url = `${API_BASE_URL}/api/products?categoryId=${foundCategory.id}`;
          const productsRes = await axios.get(url, {
            headers: getHeaders(),
          });

          const fetchedProducts = productsRes.data || [];
          setProducts(fetchedProducts);

          const filtersFromApi = await fetchFilters(foundCategory.id);

          const filterMap = {};
          const dynamicFilters = {};

          // ✅ 1. Tạo filters từ specifications
          if (filtersFromApi.specifications) {
            for (const spec of filtersFromApi.specifications) {
              const specName = spec.name;
              const specValues = spec.specificationValues.map((val) => ({
                id: val.id,
                name: val.value,
              }));

              filterMap[specName] = specValues;
              dynamicFilters[specName] = [];
            }
          }

          // ✅ 2. Thêm filters cho categoryBrand và categoryType
          const brands = [
            ...new Set(fetchedProducts.map((p) => p.categoryBrandName).filter(Boolean)),
          ];
          const types = [
            ...new Set(fetchedProducts.map((p) => p.categoryTypeName).filter(Boolean)),
          ];

          if (brands.length > 0) {
            filterMap["Hãng sản phẩm"] = brands.map((val, idx) => ({
              id: `brand-${idx}`,
              name: val,
            }));
            dynamicFilters["Hãng sản phẩm"] = [];
          }

          if (types.length > 0) {
            filterMap["Loại sản phẩm"] = types.map((val, idx) => ({
              id: `type-${idx}`,
              name: val,
            }));
            dynamicFilters["Loại sản phẩm"] = [];
          }

          // ✅ 3. Gán vào state
          setAvailableFilters(filterMap);

           // ✅ Nếu có state được truyền từ navigate, thì tự động áp filter
          const newFilters = {
            ...dynamicFilters,
            price: { min: 0, max: 999999999 },
          };

          const findNameByCode = (filterArray, code) => {
            const found = filterArray.find((item) => item.id === code || item.name === code);
            return found?.name || code;
          };

          if (filterKey && filterValue) {
            if (filterKey === "type" && filterMap["Loại sản phẩm"]) {
              const matchedName = findNameByCode(filterMap["Loại sản phẩm"], filterValue);
              newFilters["Loại sản phẩm"] = [matchedName]; // Phải là "Laptop Văn Phòng", không phải "office_laptop"
            } else if (filterKey === "brand" && filterMap["Hãng sản phẩm"]) {
              const matchedName = findNameByCode(filterMap["Hãng sản phẩm"], filterValue);
              newFilters["Hãng sản phẩm"] = [matchedName];
            }
          }

          setFilters(newFilters);
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
  }, [categorySlug, dispatch, location.state]);

  return (
    <div>
      <div className="flex">
        {/* Filter Panel */}
        <div className="w-[20%] p-[10px] border rounded-lg m-[20px]">
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filter</p>
            <FilterIcon />
          </div>

          <button
            className="mt-4 text-blue-500 underline"
            onClick={() =>
              setFilters({
                price: { min: priceRange.min, max: priceRange.max },
                ...Object.fromEntries(
                  Object.keys(availableFilters).map((key) => [key, []])
                )
              })
            }
          >
            Đặt lại bộ lọc
          </button>


          {/* Giá */}
          <PriceFilter
            min={priceRange.min}
            max={priceRange.max}
            onChange={(range) =>
              setFilters((prev) => ({ ...prev, price: range }))
            }
          />
          <hr />

          {Object.entries(availableFilters).map(([specType, values]) => {
            const safeValues = Array.isArray(values) ? values : [];
            return (
              <MetaDataFilter
                key={specType}
                title={specType}
                data={safeValues}
                selectedValues={filters[specType] || []} // ✅ dùng props này
                onChange={(selectedValues) => handleFilterChange(specType, selectedValues)}
              />
            );
          })}
        </div>

        {/* Product List */}
        <div className="p-[15px] w-full">
          <p className="text-black text-lg mb-2">{category?.description}</p>
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