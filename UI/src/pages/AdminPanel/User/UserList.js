import {
  List,
  Datagrid,
  TextField,
  EmailField,
  SelectInput,
  TextInput
} from 'react-admin';

const userFilters = [
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

const UserList = () => (
  <List filters={userFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="firstName" label="Tên" />
      <TextField source="lastName" label="Họ" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);
export default UserList;