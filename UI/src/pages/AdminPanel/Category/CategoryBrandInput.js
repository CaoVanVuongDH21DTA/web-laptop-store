import React, { useMemo } from 'react';
import { SelectInput, useGetList, required } from 'react-admin';

const CategoryBrandInput = () => {
  const { data: categories = [], isLoading } = useGetList('category');

  const categoryBrands = useMemo(() => {
    return categories.flatMap(cat =>
      (cat.categoryBrands || []).map(brand => ({
        ...brand,
        name: `${cat.name} - ${brand.name}`,
      }))
    );
  }, [categories]);

  if (isLoading) return null;

  return (
    <SelectInput
      source="categoryBrandId"
      label="Thương hiệu"
      choices={categoryBrands}
      optionText="name"
      optionValue="id"
      validate={[required()]}
      format={(val) => val}
    />
  );
};

export default CategoryBrandInput;
