import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from 'react-admin';

const CategoryEdit = () => {
  return (
    <Edit hasDelete>
      <SimpleForm >
        <TextInput source='name' />
        <TextInput source='code' />
        <TextInput source='description' />
        
        <ArrayInput source="categoryTypes" label="Loại sản phẩm">
          <SimpleFormIterator getItemLabel={() => ''} getSource={(source) => `${source}`}>
            <TextInput source="imgCategory" label="Ảnh loại" />
            <TextInput source="name" label="Tên loại" validate={required()} />
            <TextInput source="code" label="Mã loại" validate={required()} />
            <TextInput source="description" label="Mô tả" />
          </SimpleFormIterator>
        </ArrayInput>


        <ArrayInput source="categoryBrands" label="Thương hiệu">
          <SimpleFormIterator getItemLabel={() => ''} getSource={(source) => `${source}`}>
            <TextInput source="imgCategory" label="Ảnh thương hiệu" />
            <TextInput source="name" label="Tên thương hiệu" validate={required()} />
            <TextInput source="code" label="Mã thương hiệu" validate={required()} />
            <TextInput source="description" label="Mô tả" />
          </SimpleFormIterator>
        </ArrayInput>

      </SimpleForm>
    </Edit>
  );
};

export default CategoryEdit;
