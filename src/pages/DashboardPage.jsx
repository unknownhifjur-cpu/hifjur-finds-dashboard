import { useState, useEffect } from 'react';
import API from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/dashboard');
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Products</h2>
          <p className="text-3xl">{stats.totalProducts}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;