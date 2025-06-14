import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../store/features/cart";
import { NumberInput } from "../../components/NumberInput/NumberInput";
import {
  delteItemFromCartAction,
  updateItemToCartAction,
} from "../../store/actions/cartAction";
import DeleteIcon from "../../components/common/DeleteIcon";
import Modal from "react-modal";
import { customStyles } from "../../styles/modal";
import { isTokenValid } from "../../utils/jwt-helper";
import { Link, useNavigate } from "react-router-dom";
import EmptyCart from "../../assets/img/empty_cart.png";

const headers = [
  "Product Details",
  "Price",
  "Quantity",
  "Shipping",
  "SubTotal",
  "Action",
];

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const navigate = useNavigate();

  const onChangeQuantity = useCallback(
    (value, productId, variantId) => {
      dispatch(
        updateItemToCartAction({
          productId,
          variant_id: variantId,
          quantity: value,
        })
      );
    },
    [dispatch]
  );

  const onDeleteProduct = useCallback((productId, variantId) => {
    setModalIsOpen(true);
    setDeleteItem({
      productId: productId,
      variantId: variantId,
    });
  }, []);

  const onCloseModal = useCallback(() => {
    setDeleteItem({});
    setModalIsOpen(false);
  }, []);

  const onDeleteItem = useCallback(() => {
    dispatch(delteItemFromCartAction(deleteItem));
    setModalIsOpen(false);
  }, [deleteItem, dispatch]);

  const subTotal = useMemo(() => {
    let value = 0;
    cartItems?.forEach((element) => {
      value += element?.subTotal;
    });
    return value?.toFixed(2);
  }, [cartItems]);

  const isLoggedIn = useMemo(() => {
    return isTokenValid();
  }, []);

  return (
    <>
      <div className="p-4">
        {cartItems?.length > 0 && (
          <>
            <p className="text-xl text-black p-4">Shopping Bag</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    {headers?.map((header) => (
                      <th key={header} className="px-4 py-2 text-left whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cartItems?.map((item, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-4 py-4">
                        <div className="flex gap-4 items-center">
                          <img
                            src={item?.thumbnail}
                            alt={`product-${index}`}
                            className="w-20 h-20 object-cover"
                          />
                          <div className="text-gray-600">
                            <p>{item?.name || "Name"}</p>
                            <p className="text-sm">Color {item?.variant?.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item?.price)}
                      </td>
                      <td className="px-4 py-4">
                        <NumberInput
                          max={item?.stock}
                          quantity={item?.quantity}
                          onChangeQuantity={(value) =>
                            onChangeQuantity(value, item?.productId, item?.variant?.id)
                          }
                        />
                      </td>
                      <td className="px-4 py-4">FREE</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item?.subTotal)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => onDeleteProduct(item?.productId, item?.variant?.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col lg:flex-row justify-between bg-gray-200 p-4 gap-8 mt-6">
              <div className="flex-1">
                <p className="text-lg font-bold">Discount Coupon</p>
                <p className="text-sm text-gray-600">Enter your coupon code</p>
                <form className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-500 p-2 rounded"
                    placeholder="Enter code"
                  />
                  <button className="px-4 bg-black text-white rounded">Apply</button>
                </form>
              </div>
              <div className="flex-1 lg:max-w-md">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <p>SubTotal</p>
                    <p>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subTotal)}</p>
                  </div>
                  <div className="flex justify-between text-lg">
                    <p>Shipping</p>
                    <p>Free Ship</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <p>Grand Total</p>
                    <p>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subTotal)}</p>
                  </div>
                </div>
                <hr className="my-2" />
                {isLoggedIn ? (
                  <button
                    className="w-full h-12 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </button>
                ) : (
                  <Link
                    to="/v1/login"
                    className="block text-center w-full h-12 bg-black text-white rounded hover:bg-gray-800 pt-3"
                  >
                    Login to Checkout
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
        {!cartItems?.length && (
          <div className="w-full flex flex-col items-center text-center mt-10">
            <img src={EmptyCart} className="w-48 h-48" alt="empty-cart" />
            <p className="text-2xl font-bold mt-4">Your cart is empty</p>
            <Link
              to="/"
              className="mt-4 px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        contentLabel="Remove Item"
      >
        <p>Are you sure you want to remove this item?</p>
        <div className="flex justify-between p-4">
          <button className="h-12 px-4 border rounded" onClick={onCloseModal}>
            Cancel
          </button>
          <button
            className="h-12 px-4 bg-black text-white rounded"
            onClick={onDeleteItem}
          >
            Remove
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Cart;

