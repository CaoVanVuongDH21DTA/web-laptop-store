import React, {useCallback, useState} from 'react'
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import Rating from '../../components/Rating/Rating';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addItemToCartAction } from "../../store/actions/cartAction";
import { toast } from 'react-hot-toast';

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
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const addItemToCart = useCallback(() => {
      dispatch(
        addItemToCartAction({
          productId: id,
          thumbnail,
          name: title,
          variant: null,
          quantity: 1,
          subTotal: price,
          price: price,
        })
      );
      setError("");
    }, [dispatch, id, thumbnail, title, price]);

  return (
    <div className="relative bg-white border rounded-xl shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition">
      <Link to={`/product/${slug}`} className="block w-full">
        <div className="w-full h-[220px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={thumbnail}
            alt={title}
            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-4 px-2 w-full text-left">
        <h3 className="text-[15px] font-semibold text-gray-800 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[15px] font-semibold text-gray-800">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
          </p>
          <div className="flex">
            <Rating rating={rating} />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          addItemToCart();
          toast.success('Thêm vào giỏ hàng thành công');
        }}
        className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
        aria-label="Thêm vào giỏ hàng"
      >
        <AddShoppingCartIcon />
      </button>
    </div>

  );
};

export default ProductCard;