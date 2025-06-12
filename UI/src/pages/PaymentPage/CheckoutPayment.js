import React, { useCallback, useState } from 'react';
import { PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { placeOrderAPI } from '../../api/order';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { createOrderRequest } from '../../utils/order-util';
import { setLoading } from '../../store/features/common';
import { confirmPaymentAPI } from '../../api/order';
import toast from 'react-hot-toast';
import { clearCart } from '../../store/features/cart';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/jwt-helper';

const CheckoutForm = ({ userId, addressId , shippingPartner, paymentMethod}) => {
  const stripe = useStripe();
  const elements = useElements();
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const nav = useNavigate();

  const handleSubmit = useCallback(async (event) => {
    event?.preventDefault();
    dispatch(setLoading(true));
    setError('');
    setOrderResponse(null);

    const orderRequest = createOrderRequest(cartItems, userId, addressId, shippingPartner, paymentMethod);
    console.log('Order Request', orderRequest);

    // Submit Stripe form fields (e.g. Card Element)
    const { error: stripeError } = await elements.submit();
    if (stripeError?.message) {
      setError(stripeError.message);
      dispatch(setLoading(false));
      return;
    }

    try {
      // 1. Create order on server
      const res = await placeOrderAPI(orderRequest);
      console.log("res: " + res)
      const clientSecret = res?.credentials?.client_secret;
      setOrderResponse(res);

      if (!clientSecret) {
        throw new Error("Không nhận được client_secret từ server");
      }

      // 2. Confirm payment with Stripe
      const paymentResult = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'http://localhost:3000/confirmPayment',
        },
        redirect: 'if_required'
      });

      console.log("Stripe Payment Result", paymentResult);

      if (paymentResult?.error) {
        throw new Error(paymentResult.error.message);
      }

      // 3. If payment success, update server-side order/payment status
      if (paymentResult.paymentIntent?.status === 'succeeded') {
        await confirmPaymentAPI({
          paymentIntent: paymentResult.paymentIntent.id,
          status: paymentResult.paymentIntent.status,
        });

        // ✅ Xóa giỏ hàng khỏi localStorage
        localStorage.removeItem("cart");

        // ✅ Nếu bạn đang dùng Redux, reset lại giỏ hàng
        dispatch(clearCart());

        setPaymentSuccess(true);
        toast.success("Thanh toán thành công!");

        nav("/");
      }else{
        toast.warning("Thanh toán chưa hoàn tất hoặc bị hủy!");
      }

    } catch (err) {
      const msg = err?.message || 'Thanh toán thất bại!';
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  }, [addressId, cartItems, dispatch, elements, stripe, userId]);

  return (
    <form className='items-center p-2 mt-4 w-[320px] h-[320px]' onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type='submit'
        disabled={!stripe}
        className='w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800'
      >
        Pay Now
      </button>
    </form>
  );
};

export default CheckoutForm;