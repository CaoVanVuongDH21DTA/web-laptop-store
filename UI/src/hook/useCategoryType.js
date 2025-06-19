// hooks/useCategoryType.js
import { useMemo, useEffect } from 'react';
import { useGetList } from 'react-admin';

export const useCategoryType = (categoryId) => {
  const { data: rawCategories = [], isLoading } = useGetList('category');

  // Lọc bỏ category không hợp lệ hoặc không có categoryTypes
  const categories = useMemo(() => {
    return rawCategories.filter(
      c =>
        c?.id &&
        c?.name &&
        Array.isArray(c.categoryTypes) &&
        c.categoryTypes.length > 0
    );
  }, [rawCategories]);

  // Lấy danh sách categoryTypes thuộc category đã chọn
  const categoryTypes = useMemo(() => {
    const selectedCategory = categories.find(c => String(c.id) === String(categoryId));
    return (selectedCategory?.categoryTypes || []).filter(ct => ct?.id && ct?.name);
  }, [categories, categoryId]);

  // Debug log
  useEffect(() => {
    console.log("🟢 Debug useCategoryType", {
      categoryId,
      categoryTypes
    });
  }, [categoryId, categoryTypes]);

  return { isLoading, categories, categoryTypes };
};
