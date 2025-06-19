import { SelectInput} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useCategoryType } from '../../../hook/useCategoryType';

const CategoryTypeInput = () => {
  const categoryId = useWatch({ name: 'categoryId' });
  const categoryTypeId = useWatch({ name: 'categoryTypeId' });

  const {
    categories,
    categoryTypes,
    isLoading,
  } = useCategoryType(categoryId, categoryTypeId);

  return (
    <>
      {/* B1: Chọn Category */}
      <SelectInput
        source="categoryId"
        label="Danh mục"
        choices={categories}
        optionText="name"
        optionValue="id"
        emptyText={false}
        disabled={isLoading}
      />

      {/* B2: Chọn CategoryType nếu đã chọn Category */}
      {categoryId && categoryTypes.length > 0 && (
        <SelectInput
          source="categoryTypeId"
          label="Loại sản phẩm"
          choices={categoryTypes}
          optionText="name"
          optionValue="id"
          disabled={isLoading}
          emptyText={false}
        />
      )}
    </>
  );
};

export default CategoryTypeInput;