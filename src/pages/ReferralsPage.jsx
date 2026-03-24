import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Ticket, Calendar, Users, Copy, Trash2 } from 'lucide-react';
import API from '../services/api';
import Loader from '../components/Loader';

const ReferralsPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountPercent: 10,
    maxDiscount: 100,
    expiresAt: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const { data } = await API.get('/admin/referrals');
      setReferrals(data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code || !form.expiresAt) {
      alert('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/admin/referrals', form);
      setForm({ code: '', discountPercent: 10, maxDiscount: 100, expiresAt: '' });
      setShowForm(false);
      fetchReferrals();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create referral');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="w-6 h-6 text-indigo-400" />
          Referral Codes
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          New Code
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Create New Referral Code</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="SUMMER10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={form.discountPercent}
                  onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                  min="1"
                  max="100"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Max Discount (₹)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                  min="0"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Expires At</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Referrals Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Max Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Used By</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No referral codes created yet.
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref._id} className="hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-white">{ref.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ref.discountPercent}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">₹{ref.maxDiscount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(ref.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ref.usageCount}</td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="text-xs">
                        {ref.usedByPhone.length > 0 ? ref.usedByPhone.join(', ') : 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => copyCode(ref.code)}
                        className="text-indigo-400 hover:text-indigo-300 transition p-1"
                        title="Copy code"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;