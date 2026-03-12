import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await API.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="/admin/products/add" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="px-4 py-2">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200"></div>
                  )}
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">${product.price}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">
                  <Link to={`/admin/products/edit/${product._id}`} className="text-blue-500 mr-2 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;