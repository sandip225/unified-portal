import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Lock, Unlock } from 'lucide-react';
import axios from '../../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) {
        console.error('No admin token found');
        return;
      }
      
      const response = await axios.get('/admin/users', {
        params: { status: statusFilter !== 'all' ? statusFilter : null },
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        alert('Admin session expired. Please login again.');
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!confirm('Are you sure you want to block/unblock this user?')) return;
    
    try {
      const adminToken = localStorage.getItem('admin_token');
      await axios.put(`/admin/users/${userId}/block`, {}, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to update user status');
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const response = await axios.get(`/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Go back to dashboard"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-500 to-red-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? '✓ Active' : '✕ Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2 flex items-center">
                    <button
                      onClick={() => viewUserDetails(user.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                      title="View user details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md text-white font-medium ${
                        user.is_active 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      }`}
                      title={user.is_active ? 'Block this user' : 'Unblock this user'}
                    >
                      {user.is_active ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="hidden sm:inline">Block</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span className="hidden sm:inline">Unblock</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.user.full_name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.user.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Total Applications</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.applications.length}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="text-sm font-medium text-blue-600">Total Spent</label>
                <p className="text-2xl font-bold text-blue-900">₹{selectedUser.total_spent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
