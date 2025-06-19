import {
  List,
  Datagrid,
  TextField,
  ImageField,
  SelectInput,
  TextInput,
  FunctionField,
} from 'react-admin';

const productFilters = [
  <SelectInput
    source="enabled"
    label="Trạng thái"
    choices={[
      { id: true, name: 'Kích hoạt' },
      { id: false, name: 'Vô hiệu' },
    ]}
    alwaysOn
    emptyText={false}
  />,
  <TextInput
    source="search"
    label="Tìm kiếm theo tên"
    alwaysOn
  />,
];

const ProductList = () => {
  return (
    <List filters={productFilters}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <ImageField source="thumbnail" />
        <TextField source="name" />
        <TextField source="brand" />
        <TextField source="description" />
        <FunctionField
          source="price"
          label="Giá tiền"
          render={record =>
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(record.price)
          }
        />
        <TextField source="slug" />
      </Datagrid>
    </List>
  );
};

export default ProductList;