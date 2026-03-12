import { useState, useEffect } from 'react';
import API from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}`, { orderStatus: status });
      fetchOrders();
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.user?.name}</td>
                <td className="px-4 py-2">${order.totalPrice}</td>
                <td className="px-4 py-2">{order.orderStatus}</td>
                <td className="px-4 py-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;