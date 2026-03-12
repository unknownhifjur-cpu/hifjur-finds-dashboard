import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
        });
        setExistingImages(data.images || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(image => data.append('images', image));

    try {
      await API.put(`/admin/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/products');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating product');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Current Images</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {existingImages.map((url, idx) => (
              <img key={idx} src={url} alt={`Existing ${idx}`} className="w-20 h-20 object-cover" />
            ))}
          </div>
          <label className="block mb-1">Upload New Images (will replace existing)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
        </div>
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previews.map((url, idx) => (
              <img key={idx} src={url} alt={`Preview ${idx}`} className="w-20 h-20 object-cover" />
            ))}
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductPage;