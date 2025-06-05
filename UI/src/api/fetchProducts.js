import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant"
import content from '../data/content.json'; // Đường dẫn đúng tới content.json


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

// export const getAllProducts = async (id, typeId) => {
//   let url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?categoryId=${id}`;
//   if (typeId) {
//     url += `&typeId=${typeId}`;
//   }

//   try {
//     const result = await axios.get(url, {
//       headers: getHeaders(), // nếu cần token, hoặc loại bỏ nếu ko cần
//     });
//     return result?.data;
//   } catch (err) {
//     console.error("Error fetching products:", err.response?.data || err.message);
//   }
// };



// export const getProductBySlug = async (slug)=>{
//     const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;
//     try{
//         const result = await axios(url,{
//             method:"GET",
//         });
//         return result?.data?.[0];
//     }
//     catch(err){
//         console.error(err);
//     }
// }

export const getProductBySlug = async (slug) => {
  try {
    const product = content.products.find((p) => p.slug === slug);
    return product || null;
  } catch (err) {
    console.error("Lỗi tìm sản phẩm theo slug:", err);
    return null;
  }
};
