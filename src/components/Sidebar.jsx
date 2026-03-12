import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link to="/admin" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/products" className="block p-2 hover:bg-gray-700 rounded">Products</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/orders" className="block p-2 hover:bg-gray-700 rounded">Orders</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">Users</Link>
          </li>
        </ul>
      </nav>
      <button onClick={logout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;