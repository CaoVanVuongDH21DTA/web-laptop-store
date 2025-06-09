import React from 'react'
import { Link } from 'react-router-dom'
import Rating from '../../components/Rating/Rating';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({
  id,
  title,
  description,
  price,
  discount,
  rating = 0,
  brand,
  thumbnail,
  slug
}) => {
  return (
    <div className="relative bg-white border rounded-xl shadow-sm p-4 flex flex-col items-center text-center">
      {/* Hình ảnh */}
      <Link to={`/product/${slug}`} className="block w-full">
        <img
          className="h-[250px] w-full object-contain rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
          src={thumbnail}
          alt={title}
        />
      </Link>

      {/* Nội dung */}
      <div className="mt-4 px-2 w-full text-left">
        <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
        <div className='flex justify-between '>
          <p className="text-[15px] font-semibold text-gray-800 mt-1">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
          </p>

          {/* Rating luôn hiển thị */}
          <div className="mt-1 flex justify-center">
            <Rating rating={rating} />
          </div>
        </div>

      </div>

      {/* Nút thêm vào giỏ hàng */}
      <button
        onClick={() => console.log("Thêm vào giỏ hàng")}
        className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
        aria-label="Thêm vào giỏ hàng"
      >
        <AddShoppingCartIcon />
      </button>
    </div>
  );
};

export default ProductCard;