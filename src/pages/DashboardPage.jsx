// DashboardPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
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

  const cards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'from-indigo-500 to-indigo-600' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'from-green-500 to-green-600' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-light text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-indigo-400" />
          Dashboard
        </h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-xl border border-white/10`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-8 h-8 text-white/80" />
              <span className="text-4xl font-bold text-white">{card.value}</span>
            </div>
            <h2 className="text-lg font-medium text-white/90">{card.title}</h2>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardPage;