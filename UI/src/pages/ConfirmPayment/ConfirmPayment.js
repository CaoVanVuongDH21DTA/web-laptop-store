// src/pages/ConfirmPayment.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { clearCart } from '../../store/features/cart';
import { confirmPaymentAPI } from '../../api/order';
// import Spinner from '../components/Spinner';

const ConfirmPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((s) => s.commonState.loading);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function handleRedirect() {
      const params = new URLSearchParams(location.search);
      const clientSecret = params.get('payment_intent_client_secret');
      const status = params.get('redirect_status');
      const paymentIntent = params.get('payment_intent');

      if (status === 'succeeded' && paymentIntent) {
        dispatch(setLoading(true));
        try {
          await confirmPaymentAPI({ paymentIntent, status });
          dispatch(clearCart());
          navigate('/orderConfirmed');
        } catch (err) {
          setErrorMsg('Xác nhận thanh toán thất bại.');
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        setErrorMsg(`Thanh toán không thành công: ${status}`);
      }
    }
    handleRedirect();
  }, [location.search, dispatch, navigate]);

  return (
    <div className="p-4 text-center">
      {/* {isLoading && <Spinner />} */}
      {!isLoading && errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {!isLoading && !errorMsg && <p>Processing...</p>}
    </div>
  );
};

export default ConfirmPayment;
