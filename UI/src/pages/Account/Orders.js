import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../store/features/common';
import { cancelOrderAPI, fetchOrderAPI } from '../../api/userInfo';
import { cancelOrder, loadOrders, selectAllOrders } from '../../store/features/user';
import moment from 'moment';
import Timeline from '../../components/Timeline/Timeline';
import { getStepCount } from '../../utils/order-util';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);
  const [selectedFilter, setSelectedFilter] = useState('ACTIVE');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

  useEffect(() => {
    dispatch(setLoading(true));
    fetchOrderAPI()
      .then(res => dispatch(loadOrders(res)))
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  useEffect(() => {
    const displayOrders = allOrders?.map(order => ({
      id: order?.id,
      orderDate: order?.orderDate,
      orderStatus: order?.orderStatus,
      status:
        ['PENDING', 'IN_PROGRESS', 'SHIPPED'].includes(order?.orderStatus) ? 'ACTIVE'
          : order?.orderStatus === 'DELIVERED' ? 'COMPLETED'
            : order?.orderStatus,
      items: order?.orderItemList?.map(item => ({
        id: item?.id,
        name: item?.product?.name,
        price: item?.product?.price,
        quantity: item?.quantity,
        url: item?.product?.resources?.[0]?.url,
        slug: item?.product?.slug,
      })),
      totalAmount: order?.totalAmount,
    }));
    setOrders(displayOrders);
  }, [allOrders]);

  const handleOnChange = useCallback((evt) => {
    setSelectedFilter(evt?.target?.value);
  }, []);

  const onCancelOrder = useCallback((id) => {
    dispatch(setLoading(true));
    cancelOrderAPI(id)
      .then(() => dispatch(cancelOrder(id)))
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  return (
    <div className='w-full md:w-[70%] mx-auto px-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold'>My Orders</h1>
        <select
          className='border border-gray-300 rounded-lg p-2'
          value={selectedFilter}
          onChange={handleOnChange}
        >
          <option value='ACTIVE'>Active</option>
          <option value='CANCELLED'>Cancelled</option>
          <option value='COMPLETED'>Completed</option>
        </select>
      </div>

      {orders.filter(order => order.status === selectedFilter).length === 0 ? (
        <p className='text-center text-gray-500 mt-10 text-lg italic'>
          {selectedFilter === 'ACTIVE'
            ? 'Bạn chưa có đơn hàng đang xử lý.'
            : selectedFilter === 'CANCELLED'
            ? 'Bạn chưa có đơn hàng bị hủy.'
            : 'Bạn chưa có đơn hàng đã hoàn thành.'}
        </p>
      ) : (
        orders
          .filter(order => order.status === selectedFilter)
          .map(order => {
            const isSelected = selectedOrder === order.id;
            return (
              <motion.div
                key={order.id}
                className='bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200'
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className='flex justify-between'>
                  <div>
                    <p className='text-lg font-bold text-gray-800'>Order #{order.id}</p>
                    <p className='text-sm text-gray-500'>
                      Order Date: {moment(order.orderDate).format('MMMM DD YYYY')}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Expected Delivery: {moment(order.orderDate).add(3, 'days').format('MMMM DD YYYY')}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-500'>
                      Status: <span className='font-medium'>{order.orderStatus}</span>
                    </p>
                    <button
                      onClick={() => setSelectedOrder(isSelected ? '' : order.id)}
                      className='text-blue-700 underline mt-1 text-sm'
                    >
                      {isSelected ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className='mt-4 overflow-hidden'
                    >
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mb-4"
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded border"
                          />
                          <div className="text-sm text-gray-700 flex-1">
                            <p className="text-base font-medium">{item.name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>
                              Price:{' '}
                              {item.price?.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 mb-4 text-sm font-semibold gap-2">
                        <p>
                          Total:{' '}
                          {order.totalAmount?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </p>
                      </div>

                      {order.orderStatus !== 'CANCELLED' && (
                        <div className="space-y-4">
                          <Timeline stepCount={getStepCount[order.orderStatus]} />
                          {getStepCount[order.orderStatus] <= 2 && (
                            <button
                              onClick={() => onCancelOrder(order.id)}
                              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition w-full sm:w-auto"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
      )}
    </div>
  );
};

export default Orders;