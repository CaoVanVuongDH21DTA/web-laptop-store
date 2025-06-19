import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
} from 'react-admin';

const OrderList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <DateField source="orderDate" label="Ngày đặt" />
      <TextField source="orderStatus" label="Trạng thái" />
      <NumberField source="totalAmount" label="Tổng tiền" />
      <TextField source="address.city" label="Thành phố" />
      <TextField source="user.firstName" label="Tên KH" />
    </Datagrid>
  </List>
);

export default OrderList;
