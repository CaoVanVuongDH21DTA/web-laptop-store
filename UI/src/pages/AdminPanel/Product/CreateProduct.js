import React, {useEffect} from 'react';
import {
  ArrayInput,
  BooleanInput,
  Create,
  ImageField,
  ImageInput,
  NumberInput,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from 'react-admin';
import CategoryTypeInput from '../Category/CategoryTypeInput';
import CategoryBrandInput from '../Category/CategoryBrandInput';
import { colorSelector } from '../../../components/Filters/ColorsFilter';
import { useFormContext, useWatch } from 'react-hook-form';
import SpecificationInput from './SpecificationInput';

const PrimaryImageValidator = () => {
  const { setValue } = useFormContext();
  const resources = useWatch({ name: 'productResources' }) || [];

  useEffect(() => {
    const primaryImages = resources.filter(r => r?.isPrimary);
    if (primaryImages.length > 1) {
      const firstPrimaryIndex = resources.findIndex(r => r?.isPrimary);
      const updated = resources.map((r, i) => ({
        ...r,
        isPrimary: i === firstPrimaryIndex,
      }));
      setValue('productResources', updated);
    }
  }, [resources, setValue]);

  return null;
};


const CreateProduct = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" validate={[required()]} />
        <TextInput source="slug" validate={[required()]} />
        <TextInput source="description" validate={[required()]} />
        <NumberInput source="price" validate={[required()]} />

        {/* Type, Brand */}
        <CategoryTypeInput validate={[required()]} />
        <CategoryBrandInput validate={[required()]} />

        {/* Variants */}
        <ArrayInput source="variants">
          <SimpleFormIterator inline>
            <SelectInput
              source="color"
              choices={Object.keys(colorSelector).map((k) => ({ id: k, name: k }))}
              resettable
            />
            <NumberInput source="stockQuantity" />
          </SimpleFormIterator>
        </ArrayInput>

        {/* Product Resources */}
        <ArrayInput source="productResources">
          <SimpleFormIterator inline>
            <TextInput source="name" validate={[required()]} />
            <ImageInput source="url" label="Product Image" accept="image/*">
              <ImageField source="src" title="title" />
            </ImageInput>
            <SelectInput
              source="type"
              choices={[{ id: 'image', name: 'image' }]}
              defaultValue="image"
              validate={[required()]}
            />
            <BooleanInput source="isPrimary" label="Set as Primary Image" />
          </SimpleFormIterator>
        </ArrayInput>
        <PrimaryImageValidator />

        {/* Specifications */}
        <SpecificationInput/>

        <NumberInput source="rating" defaultValue={0} />
        <BooleanInput source="newArrival" label="New Arrival" defaultValue={false} />
      </SimpleForm>
    </Create>
  );
};

export default CreateProduct;