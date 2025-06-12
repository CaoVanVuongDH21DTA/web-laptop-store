import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, clearCart } from "../../store/features/cart";
import { fetchUserDetails } from "../../api/userInfo";
import { setLoading } from "../../store/features/common";
import { useNavigate, NavLink } from "react-router-dom";
import PaymentPage from "../PaymentPage/PaymentPage";
import { format, addDays  } from "date-fns";
import { AddressDropdown } from "../Address/AddressDropdown";
import toast from 'react-hot-toast';
import { fetchShippingProviders, placeOrderAPI } from "../../api/order";
import { createOrderRequest } from "../../utils/order-util";

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState([]);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingProviders, setShippingProviders] = useState([]);
  const [shippingPartner, setShippingPartner] = useState(null);

  // thời gian giao hàng dự kiến
  const deliveryStartDate = addDays(new Date(), 2); // giao sớm nhất
  const deliveryEndDate = addDays(new Date(), 4);   // giao trễ nhất

  const formattedDeliveryRange = `${format(deliveryStartDate, "dd")} - ${format(deliveryEndDate, "dd")} tháng ${format(deliveryEndDate, "M")}`;

  const subTotal = useMemo(() => {
    let value = 0;
    cartItems?.forEach((element) => {
      value += element?.subTotal;
    });
    return value?.toFixed(2);
  }, [cartItems]);


  useEffect(() => {
    // Load user info
    const loadUser = async () => {
      try {
        dispatch(setLoading(true));
        const res = await fetchUserDetails();
        setUserInfo(res);
        if (res?.addressList?.length > 0) {
          setSelectedAddressId(res.addressList[0].id);
        }
      } catch (err) {
        toast.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    // Load shipping providers
    const loadShippingProviders = async () => {
      try {
        dispatch(setLoading(true));
        const data = await fetchShippingProviders(); 
        setShippingProviders(data);
        if (data.length > 0) {
          setShippingPartner(data[0].id); 
        }
      } catch (err) {
        console.error("Shipping providers error:", err);
        toast.error("Không tải được nhà vận chuyển");
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadShippingProviders();
    loadUser();
  }, [dispatch]);

  const handleCODPayment = async () => {
    try {
      dispatch(setLoading(true));

      const orderRequest = createOrderRequest(
        cartItems,
        userInfo?.id,
        selectedAddressId,
        shippingPartner,
        paymentMethod
      );

      const res = await placeOrderAPI(orderRequest);
      // Giả sử server trả về success khi đơn được tạo
      if (res?.orderId) {
        localStorage.removeItem("cart");
        dispatch(clearCart());
        toast.success("Đặt hàng thành công!");
        navigate("/");
      } else {
        throw new Error("Không thể tạo đơn hàng với COD");
      }
    } catch (err) {
      toast.error(err?.message || "Thanh toán thất bại!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="p-8 flex">
      <div className="w-[70%]">
        <div className="flex gap-8">
          {/* Address */}
          <p className="font-bold">Delivery address</p>
          {userInfo?.addressList && userInfo.addressList.length > 0 ? (
            <AddressDropdown
              addresses={userInfo.addressList}
              selectedAddressId={selectedAddressId}
              onChange={setSelectedAddressId}
            />
          ) : (
            <NavLink
              to="/account-details/profile"
              className="inline-block border px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Thêm địa chỉ giao hàng
            </NavLink>
          )}
        </div>
        <hr className="h-[2px] bg-slate-200 w-[90%] my-4"></hr>
        <div className="flex gap-8 flex-col">
          <div className="mt-6">
            <p className="font-semibold">Choose delivery</p>
            <div className="flex flex-row gap-2 mt-2 flex-wrap">
              {shippingProviders.map((sp) => (
                <label
                  key={sp.id}
                  className={`flex items-center gap-3 cursor-pointer border p-2 rounded hover:bg-gray-100 ${
                    shippingPartner === sp.id ? 'bg-gray-100 border-black' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping_partner"
                    value={sp.id}
                    checked={shippingPartner === sp.id}
                    onChange={() => setShippingPartner(sp.id)}
                  />
                  {/* Hiển thị logo nếu có */}
                  {sp.imgShip && (
                    <img
                      src={sp.imgShip}
                      alt={sp.name}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <span>{sp.name}</span>
                </label>
              ))}
            </div>

          </div>
          <div>
            <p className="font-semibold">Thời gian giao hàng dự kiến</p>
            <p className="mt-2 text-gray-700">
              {formattedDeliveryRange}
            </p>
          </div>
        </div>
        <hr className="h-[2px] bg-slate-200 w-[90%] my-4"></hr>
        <div className="flex flex-col gap-2">
          <p className="font-bold">Payment Method</p>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="radio"
                name="payment_method"
                value={"CARD"}
                onChange={() => setPaymentMethod("CARD")}
              />
              <p> Credit/Debit Card</p>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="payment_method"
                value={"COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <p> Cash on delivery</p>
            </div>
          </div>
        </div>
        {paymentMethod === "CARD" && (
          <PaymentPage
            userId={userInfo?.id}
            addressId={selectedAddressId}
            shippingPartner={shippingPartner}
            paymentMethod={paymentMethod}
          />
        )}

        {paymentMethod == "COD" && (
          <button
            className="w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800"
            onClick={handleCODPayment}
          >
            Pay Now
          </button>
        )}
      </div>
      <div className="w-[30%] h-[30%] border rounded-lg border-gray-500 p-4 flex flex-col gap-4">
        <p>Order Summary</p>
        <p>Items Count = {cartItems?.length}</p>
        <p>SubTotal = {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subTotal)}</p>
        <p>Shipping = FREE SHIP</p>
        <hr className="h-[2px] bg-gray-400"></hr>
        <p>Total Amount = {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subTotal)}</p>
      </div>
    </div>
  );
};

export default Checkout;
