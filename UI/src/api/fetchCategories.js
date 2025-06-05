import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant"


export const fetchCategories = async () => {
  const url = API_BASE_URL + API_URLS.GET_CATEGORIES;

  try {
    const result = await axios.get(url, { headers: getHeaders() });
    return result.data; // hoặc result.data.categories tùy API
  } catch (e) {
    console.error('Fetch categories error:', e);
  }
};

export const fetchCategoriesCode = async () => {
  const url = API_BASE_URL + API_URLS.GET_CATEGORIES_CODE;

  try {
    const result = await axios.get(url, { headers: getHeaders() });
    return result.data; // hoặc result.data.categories tùy API
  } catch (e) {
    console.error('Fetch categories error:', e);
  }
};