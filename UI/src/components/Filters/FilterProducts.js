export const filterProducts = (items, filters) => {
  return items.filter((product) => {
    const {
      brands = [],
      ram = [],
      cpu = [],
      screen_size = [],
      colors = [],
      connectivity = [],
      types = [],
      price = { min: 0, max: Infinity },
    } = filters;

    // Brand
    if (brands.length && (!product.brand || !brands.includes(product.brand))) return false;

    // Type
    if (types.length && (!product.type_id || !types.includes(product.type_id))) return false;

    // RAM
    if (ram.length && (!product.ram || !ram.includes(product.ram))) return false;

    // CPU
    if (cpu.length && (!product.cpu || !cpu.includes(product.cpu))) return false;

    // Screen size
    if (screen_size.length && (!product.screen_size || !screen_size.includes(product.screen_size))) return false;

    // Colors (dạng chuỗi phân cách dấu phẩy)
    if (colors.length) {
      const colorList = typeof product.color === 'string'
        ? product.color.split(',').map(c => c.trim())
        : [];
      if (!colors.some(color => colorList.includes(color))) return false;
    }

    // Connectivity
    if (connectivity.length) {
      const connList = typeof product.connectivity === 'string'
        ? product.connectivity.split(',').map(c => c.trim())
        : [];
      if (!connectivity.some(conn => connList.includes(conn))) return false;
    }

    // Price range
    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price);
    if (isNaN(productPrice) || productPrice < price.min || productPrice > price.max) return false;

    return true;
  });
};

export default filterProducts;
