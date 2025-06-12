import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const placeOrderAPI = async (data) => {
  const url = API_BASE_URL + `/api/order`;
  try {
    const response = await axios.post(url, data, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error("placeOrderAPI error:", err.response || err);
    throw err;
  }
};

export const confirmPaymentAPI = async (data)=>{
    const url = API_BASE_URL + '/api/order/update-payment';
    try{
        const response = await axios(url,{
            method:"POST",
            data:data,
            headers:getHeaders()
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const fetchShippingProviders = async () => {
  const url = API_BASE_URL + '/api/order/shipping-providers';
  try {
    const response = await axios(url, {
      method: "GET",
      headers: getHeaders()
    });
    return response.data; 
  } catch (err) {
    throw new Error(err?.message || "Lỗi không xác định");
  }
};
