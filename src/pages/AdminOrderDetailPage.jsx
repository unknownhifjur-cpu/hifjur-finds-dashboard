// AdminOrderDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Building2,
  DollarSign,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import API from '../services/api';
import Loader from '../components/Loader';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) return <Loader />;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">Order not found.</p>
          <Link to="/admin/orders" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order header */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-indigo-400" />
                <h1 className="text-2xl font-light text-white">
                  Order #{order._id.slice(-8)}
                </h1>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus || 'Pending'}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Total: ${order.totalPrice?.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Customer Information
            </h2>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                {order.user?.name || 'Guest'}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {order.user?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.name}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.address}
                </p>
                <p className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {order.shippingAddress.area}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              Items ({order.products?.length || 0})
            </h2>
            <div className="space-y-3">
              {order.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-white font-bold">
              <span>Total</span>
              <span>${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;