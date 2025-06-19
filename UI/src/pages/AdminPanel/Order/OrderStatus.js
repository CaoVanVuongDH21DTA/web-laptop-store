// OrderStatusInput.jsx
import { SelectInput, useRecordContext } from 'react-admin';

const OrderStatus = () => {
  const record = useRecordContext();

  const statusOrder = ['PENDING', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const allChoices = [
    { id: 'PENDING', name: 'Pending' },
    { id: 'IN_PROGRESS', name: 'In Progress' },
    { id: 'SHIPPED', name: 'Shipped' },
    { id: 'DELIVERED', name: 'Delivered' },
    { id: 'CANCELLED', name: 'Cancelled' },
  ];

  const currentStatusIndex = statusOrder.indexOf(record?.orderStatus || 'PENDING');

  const filteredChoices = allChoices.filter(
    choice => statusOrder.indexOf(choice.id) >= currentStatusIndex
  );

  return (
    <SelectInput
      source="orderStatus"
      label="Order Status"
      choices={filteredChoices}
      emptyText={false}
    />
  );
};

export default OrderStatus;
