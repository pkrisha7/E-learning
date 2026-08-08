import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    axios.get('http://localhost:5000/api/admin/users', authHeaders())
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role }, authHeaders());
    toast.success('Role updated');
    load();
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user account?')) return;
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`, authHeaders());
    toast.success('User account deleted');
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">/ User Directory</span>
        </div>
        <Link to="/admin" className="text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors">
          ← Back to Admin Console
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Registered Users <span className="text-slate-400 font-bold text-lg">({users.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-slate-200 rounded-2xl h-14 animate-pulse"/>)}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-400">No users found</div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[11px] font-extrabold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Account Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={e => changeRole(u._id, e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-rose-500 hover:text-rose-600 text-xs font-bold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}