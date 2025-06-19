import {
  NumberField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput
} from 'react-admin';
import OrderStatus from './OrderStatus';

const OrderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="user.email" label="Customer Email" disabled />
      <TextInput source="user.firstName" label="First Name" disabled />
      <TextInput source="user.lastName" label="Last Name" disabled />
      <NumberField source="totalAmount" label="Total Amount" />
      <OrderStatus/>
      <DateInput source="expectedDeliveryDate" label="Expected Delivery Date" />
      <TextInput source="address.street" label="Street" />
      <TextInput source="address.city" label="City" />
      <TextInput source="address.state" label="State" />
    </SimpleForm>
  </Edit>
);

export default OrderEdit;