import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

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
    if (pwForm.newPassword.length < 6) { toast.error('Minimum 6 characters required'); return; }
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', pwForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to change password');
    }
  };

  const inputStyle = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50 focus:bg-white transition-all';

  return (
    <div className="min-h-screen page-theme-bg text-slate-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Logo size="md" />
        <Link to="/dashboard" className="text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900">Account Settings</h2>

        {/* User Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-indigo-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md shadow-sky-500/20 shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-xl">{user?.name}</p>
            <p className="text-slate-500 text-xs font-medium">{user?.email}</p>
            <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full mt-2 inline-block capitalize ${
              user?.role === 'admin'
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : user?.role === 'instructor'
                ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              Role: {user?.role}
            </span>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 space-y-5">
          <h3 className="font-extrabold text-slate-900 text-lg">Personal Information</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input className={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input className={inputStyle} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
          </div>
          <button
            onClick={updateProfile}
            disabled={saving}
            className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white px-7 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 space-y-5">
          <h3 className="font-extrabold text-slate-900 text-lg">Security & Password</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current Password</label>
            <input className={inputStyle} type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})}/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">New Password</label>
            <input className={inputStyle} type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})}/>
          </div>
          <button
            onClick={changePassword}
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-xl font-bold text-sm transition-all"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}