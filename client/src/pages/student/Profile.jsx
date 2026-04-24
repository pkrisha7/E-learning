import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, loginUser } = useAuth();
  const [form, setForm]     = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const updateProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      loginUser(localStorage.getItem('token'), res.data);
      toast.success('Profile updated!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (pwForm.newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', pwForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to change password');
    }
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-purple-600">← Dashboard</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

        {/* Avatar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
              ${user?.role === 'admin' ? 'bg-red-100 text-red-600' : user?.role === 'instructor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Edit Profile</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input className={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
          </div>
          <button onClick={updateProfile} disabled={saving}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input className={inp} type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input className={inp} type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})}/>
          </div>
          <button onClick={changePassword}
            className="bg-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-900 transition">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}