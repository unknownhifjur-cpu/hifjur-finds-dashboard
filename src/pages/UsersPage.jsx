import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, User, Mail, Shield, MapPin } from 'lucide-react';
import API from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-900 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl md:text-4xl font-light text-white">Users</h1>
      </div>

      {/* Users Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-700/50 border-b border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Pincode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <motion.tr
                  key={user._id}
                  variants={itemVariants}
                  className="hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white font-mono text-sm">
                    #{user._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4 text-gray-400" />
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {user.address || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.city || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.pincode || 'N/A'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No users found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UsersPage;