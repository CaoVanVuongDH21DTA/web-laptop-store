import simpleRestProvider from 'ra-data-simple-rest';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8080/api';

const httpClient = async (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  // Add authentication if required
  const token = localStorage.getItem('authToken'); 
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let json;
  try {
    json = await response.json();
  } catch (e) {
    json = {};
  }

  if (!response.ok) {
    const error = new Error(response.statusText || 'Request failed');
    error.status = response.status;
    error.body = json;
    throw error;
  }

  return { json };
};

const dataProviderBase = simpleRestProvider(API_URL, httpClient);

const dataProvider = {
  ...dataProviderBase,

  getList: async (resource, params) => {
    try {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { filter = {}, sort = {} } = params;

      let url = `${API_URL}/${resource}`;
      const query = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
      });

      // Apply filters, handle enabled as boolean
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== '') {
          if (key === 'enabled' && typeof value === 'boolean') {
            query.append(key, value.toString());
          } else {
            query.append(key, value);
          }
        }
      }

      // Apply sorting
      if (sort.field && sort.order) {
        query.append('sort', `${sort.field},${sort.order.toLowerCase()}`);
      }

      const queryString = query.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const { json } = await httpClient(url);

      // Handle response
      let dataArray, total;
      if (Array.isArray(json)) {
        dataArray = json;
        total = dataArray.length;
      } else {
        dataArray = json.data || [];
        total = Number(json.total) || dataArray.length;
      }

      // Map data, ensure valid id
      const mappedData = dataArray.map(item => {
        const id = item.id || item.uuid;
        if (!id) {
          console.warn(`getList-${resource} missing id for item:`, item);
        }
        return {
          ...item,
          id,
          enabled: item.enabled === true || item.enabled === 'true',
        };
      });

      const result = { data: mappedData, total };

      return result;
    } catch (error) {
      toast.error(`Không thể tải danh sách ${resource}!`);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    try {
      const url = `${API_URL}/${resource}/${params.id}`;
      const { json } = await httpClient(url);
      return {
        data: {
          ...json,
          id: json.id || json.uuid,
        },
      };
    } catch (error) {
      toast.error('Không thể tải dữ liệu sản phẩm!');
      throw error;
    }
  },

  create: async (resource, params) => {
    const url = `${API_URL}/${resource}`;
    const data = params.data;

    if (resource === 'products') {
      // Nếu có image dạng File => upload lên Cloudinary trước
      const updatedResources = await Promise.all(
        (data.productResources || []).map(async (r) => {
          // Nếu là File => upload
          if (r.url?.rawFile instanceof File) {
            const formData = new FormData();
            formData.append('file', r.url.rawFile);
            formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET); // ✅ đúng

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
              method: 'POST',
              body: formData,
            });

            if (!res.ok) {
              const errorBody = await res.text(); // hoặc .json() nếu chắc chắn trả về JSON
              console.error('Cloudinary upload failed:', errorBody);
              toast.error('Lỗi upload ảnh lên Cloudinary');
              throw new Error('Upload to Cloudinary failed');
            }

            const result = await res.json();

            return { ...r, url: result.secure_url }; // ✅ Gán lại URL đã upload
          }
          return r; // nếu đã có URL thì giữ nguyên
        })
      );

      const jsonBody = {
        ...data,
        productResources: updatedResources,
      };

      const options = {
        method: 'POST',
        body: JSON.stringify(jsonBody),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }),
      };

      const { json } = await httpClient(url, options);
      return { data: { ...json, id: json.id || json.uuid } };
    }

    // fallback
    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return { data: { ...json, id: json.id || json.uuid } };
  },

  update: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}`;
    const data = params.data;

    try {
      let options;

      if (resource === 'user') {
        const hasFile = data.avatarFile instanceof File;
        if (hasFile) {
          const formData = new FormData();
          formData.append('firstName', data.firstName || '');
          formData.append('lastName', data.lastName || '');
          formData.append('email', data.email || '');
          formData.append('phoneNumber', data.phoneNumber || '');
          formData.append('avatarFile', data.avatarFile);
          formData.append('enabled', data.enabled);
          if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl);
          options = { method: 'PUT', body: formData };
        } else {
          const payload = {
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            email: data.email || null,
            phoneNumber: data.phoneNumber || null,
            avatarUrl: data.avatarUrl || null,
            enabled: data.enabled != null ? data.enabled : true,
          };
          options = {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: new Headers({ 'Content-Type': 'application/json' }),
          };
        }
      } else if (resource === 'products') {
        if (!data.categoryBrandId) {
          throw new Error('categoryBrandId is required');
        }
        if (!data.categoryId) {
          throw new Error('categoryId is required');
        }
        const payload = {
          id: params.id,
          name: data.name,
          description: data.description,
          price: data.price,
          thumbnail: data.thumbnail || null,
          slug: data.slug,
          enabled: data.enabled != null ? !!data.enabled : true,
          newArrival: data.newArrival || false,
          rating: data.rating || 0,
          categoryId: data.categoryId,
          categoryBrandId: data.categoryBrandId,
          categoryTypeId: data.categoryTypeId || null,
        };
        options = {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        };
      } else {
        options = {
          method: 'PUT',
          body: JSON.stringify({ ...params.data, id: params.id }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        };
      }

      const response = await httpClient(url, options);

      return {
        data: {
          ...response.json,
          id: response.json.id || response.json.uuid || params.id,
        },
      };
    } catch (error) {
      console.error(`update-${resource} error:`, {
        message: error.message,
        status: error.status,
        body: error.body,
      });
      toast.error(`Cập nhật ${resource} thất bại: ${error.message || 'Lỗi không xác định'}`);
      throw new Error(`Cập nhật ${resource} thất bại: ${error.message}`);
    }
  },
  
  delete: async (resource, params) => {
    try {
      const url = `${API_URL}/${resource}/${params.id}`;
      const options = {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      };
      await httpClient(url, options);
      toast.success('Xóa thành công!');
      return { data: { id: params.id } };
    } catch (error) {
      const message = error?.body?.error || error?.message || 'Lỗi khi xóa dữ liệu';
      toast.error(message);
      throw new Error(message);
    }
  },

  restore: async (resource, id) => {
    const url = `${API_URL}/${resource}/${id}/restore`;
    const token = localStorage.getItem('authToken');
    const options = {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      }),
    };

    const { json } = await httpClient(url, options);
    return { data: { ...json, id: json.id || json.uuid } };
  },

};

export default dataProvider;
