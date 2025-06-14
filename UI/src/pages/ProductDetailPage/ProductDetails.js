import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Rating from "../../components/Rating/Rating";
import ProductColors from "./ProductColors";
import SvgCreditCard from "../../components/common/SvgCreditCard";
import SvgShipping from "../../components/common/SvgShipping";
import SvgReturn from "../../components/common/SvgReturn";
import SectionHeading from "../../components/Sections/SectionsHeading/SectionHeading";
import ProductCard from "../ProductListPage/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { getAllProducts } from "../../api/fetchProducts";
import { addItemToCartAction } from "../../store/actions/cartAction";

const extraSections = [
  {
    icon: <SvgCreditCard />,
    label: "Secure payment",
  },
  {
    icon: <SvgShipping />,
    label: "Free shipping",
  },
  {
    icon: <SvgReturn />,
    label: "Free Shipping & Returns",
  },
];

const ProductDetails = () => {
  const { product } = useLoaderData();
  const [image, setImage] = useState(product?.thumbnail || "");
  const [breadCrumbLinks, setBreadCrumbLink] = useState([]);
  const [similarProduct, setSimilarProducts] = useState([]);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoryState?.categories);

  const productCategory = useMemo(() => {
    return categories?.find((cat) => cat?.id === product?.categoryId);
  }, [product, categories]);

  const productType = useMemo(() => {
    return productCategory?.categoryTypes?.find(
      (type) => type?.id === product?.categoryTypeId
    );
  }, [productCategory, product]);

  const colors = useMemo(() => {
    return _.uniq(_.map(product?.variants, "color"));
  }, [product]);

  useEffect(() => {
    if (product?.categoryId && product?.categoryTypeId) {
      getAllProducts(product.categoryId, product.categoryTypeId)
        .then((res) => {
          const filtered = res?.filter((item) => item?.id !== product?.id);
          setSimilarProducts(filtered || []);
        })
        .catch(() => setSimilarProducts([]));
    }
  }, [product?.categoryId, product?.categoryTypeId, product?.id]);

  useEffect(() => {
    const links = [
      { title: "Shop", path: "/" },
      productCategory && { title: productCategory.name, path: `/${productCategory.name}` },
      productType && { title: productType.name, path: `/${productCategory?.name}/${productType.name}` },
    ].filter(Boolean);

    setBreadCrumbLink(links);
  }, [productCategory, productType]);

  const addItemToCart = useCallback(() => {
    if (!product) return;
    dispatch(
      addItemToCartAction({
        productId: product.id,
        thumbnail: product.thumbnail,
        name: product.name,
        variant: null,
        quantity: 1,
        subTotal: product.price,
        price: product.price,
      })
    );
    setError("");
  }, [dispatch, product]);

  if (!product) {
    return <div className="text-center py-10 text-red-600">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <>
      <div className="flex flex-col xl:flex-row px-4 md:px-8 lg:px-10 gap-6">
        <div className="w-full xl:w-1/2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:h-[420px]">
              {product?.productResources?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item?.url)}
                  className="rounded-lg border p-1 hover:scale-105 transition"
                >
                  <img
                    src={item?.url}
                    className="h-16 w-16 object-cover rounded-lg"
                    alt={"sample-" + index}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-center items-center w-full">
              <img
                src={image}
                className="w-full max-h-[500px] object-contain border rounded-xl"
                alt={product?.name}
              />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-1/2 space-y-4">
          <Breadcrumb links={breadCrumbLinks} />
          <p className="text-2xl md:text-3xl font-semibold">{product?.name}</p>
          <Rating rating={product?.rating} />
          <p className="text-xl font-bold text-gray-900">
            {product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>

          <div>
            <p className="text-lg font-medium">Màu sắc:</p>
            <ProductColors colors={colors} />
          </div>

          <div className="pt-4">
            <button
              onClick={addItemToCart}
              className="bg-black hover:bg-gray-800 text-white w-full md:w-1/2 h-11 rounded-lg flex items-center justify-center gap-2"
            >
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.33325H2.00526C2.85578 1.33325 3.56986 1.97367 3.6621 2.81917L4.3379 9.014C4.43014 9.8595 5.14422 10.4999 5.99474 10.4999H13.205C13.9669 10.4999 14.6317 9.98332 14.82 9.2451L15.9699 4.73584C16.2387 3.68204 15.4425 2.65733 14.355 2.65733H4.5M4.52063 13.5207H5.14563M4.52063 14.1457H5.14563M13.6873 13.5207H14.3123M13.6873 14.1457H14.3123M5.66667 13.8333C5.66667 14.2935 5.29357 14.6666 4.83333 14.6666C4.3731 14.6666 4 14.2935 4 13.8333C4 13.373 4.3731 12.9999 4.83333 12.9999C5.29357 12.9999 5.66667 13.373 5.66667 13.8333ZM14.8333 13.8333C14.8333 14.2935 14.4602 14.6666 14 14.6666C13.5398 14.6666 13.1667 14.2935 13.1667 13.8333C13.1667 13.373 13.5398 12.9999 14 12.9999C14.4602 12.9999 14.8333 13.373 14.8333 13.8333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Thêm vào giỏ hàng
            </button>
          </div>

          {error && <p className="text-lg text-red-600">{error}</p>}

          <div className="grid md:grid-cols-2 gap-4 pt-4">
            {extraSections?.map((section, index) => (
              <div key={index} className="flex items-center gap-2">
                {section?.icon}
                <p>{section?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionHeading title={"Mô tả sản phẩm"} />
      <div className="w-full md:w-[80%] mx-auto px-4 md:px-8 py-2">
        <p>{product?.description}</p>
      </div>

      <SectionHeading title={"Sản phẩm tương tự"} />
      <div className="w-full px-4 md:px-10">
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
          {similarProduct?.map((item, index) => (
            <ProductCard key={index} {...item} />
          ))}
          {!similarProduct?.length && <p className="text-center col-span-full">Không có sản phẩm tương tự!</p>}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
