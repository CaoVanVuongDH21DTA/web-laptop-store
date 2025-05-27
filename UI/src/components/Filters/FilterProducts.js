// components/Filters/FilterProducts.js
export const filterProducts = (items, filters) => {
  return items.filter((product) => {
    const {
      brands, ram, cpu, screen_size,
      colors, connectivity, types, price
    } = filters;

    if (brands.length && !brands.includes(product.brand)) return false;
    if (types.length && !types.includes(product.type_id)) return false;
    if (ram.length && !ram.includes(product.ram)) return false;
    if (cpu.length && !cpu.includes(product.cpu)) return false;
    if (screen_size.length && !screen_size.includes(product.screen_size)) return false;

    if (colors.length && product.color) {
      const colorList = product.color.split(',').map(c => c.trim());
      if (!colors.some(color => colorList.includes(color))) return false;
    }

    if (connectivity.length && product.connectivity) {
      const connList = product.connectivity.split(',').map(c => c.trim());
      if (!connectivity.some(conn => connList.includes(conn))) return false;
    }

    if (
      typeof product.price !== 'number' ||
      product.price < price.min ||
      product.price > price.max
    ) return false;

    return true;
  });
};

// Thêm dòng này để export hàm
export default filterProducts;