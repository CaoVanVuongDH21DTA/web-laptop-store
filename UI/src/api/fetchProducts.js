import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant"


export const getAllProducts = async (id,typeId)=>{
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?categoryId=${id}`;
    if(typeId){
        url = url + `&typeId=${typeId}`;
    }

    try{
        const result = await axios(url,{
            method:"GET"
        });
        return result?.data;
    }
    catch(err){
        console.error(err);
    }
}

export const getProductBySlug = async (slug) => {
  const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
  const result = await axios.get(url);
  return result?.data?.[0]; // Nếu API trả về mảng
};

export const getProductBySearch = async (searchTerm) => {
  try {
    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?search=${encodeURIComponent(searchTerm)}`;
    const result = await axios.get(url);
    return result?.data; // Trả về mảng sản phẩm
  } catch (err) {
    console.error("Lỗi khi gọi API getProductBySearch:", err);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};
