'use client';

import { useState, useEffect } from 'react';
import { deleteUser } from '@/actions/users';
import { useToast } from '@/components/ui/ToastProvider';
import { Trash2, Loader2, ShieldAlert, X } from 'lucide-react';

export default function UserList({ initialUsers, currentUserId }) {
  const [users, setUsers] = useState(initialUsers);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!showModal) return;
    
    setDeletingId(showModal._id);
    const res = await deleteUser(showModal._id);
    setDeletingId(null);

    if (res.error) {
      addToast(res.error, 'error');
    } else {
      addToast(res.success, 'success');
      setUsers(users.filter(u => u._id !== showModal._id));
    }
    setShowModal(null);
  };

  return (
    <>
      <div className="bg-surface-800 border border-surface-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] md:min-w-full">
            <thead className="bg-surface-900/50 text-slate-400 text-xs md:text-sm">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium">Name</th>
                <th className="px-4 md:px-6 py-3 font-medium">Email</th>
                <th className="px-4 md:px-6 py-3 font-medium">Role</th>
                <th className="px-4 md:px-6 py-3 font-medium">Status</th>
                <th className="px-4 md:px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {users.map(u => {
                const isOwner = u.role === 'owner';
                const isSelf = u._id === currentUserId;
                const canDelete = !isOwner && !isSelf;

                return (
                  <tr key={u._id} className="hover:bg-surface-700/50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-slate-200 font-medium text-sm md:text-base">{u.name}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-xs md:text-sm">{u.email}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-[10px] md:text-xs font-medium px-2 py-1 bg-brand-500/10 text-brand-500 rounded capitalize">{u.role}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-[10px] md:text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded">Active</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      {canDelete ? (
                        <button 
                          onClick={() => setShowModal(u)}
                          disabled={deletingId === u._id}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          {deletingId === u._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-800 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-red-500/10 p-5 flex justify-between items-start border-b border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-full"><ShieldAlert className="w-6 h-6 text-red-500" /></div>
                <h2 className="text-xl font-bold text-white">Delete User</h2>
              </div>
              <button onClick={() => setShowModal(null)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-300">
                Are you sure you want to delete <strong className="text-white">{showModal.name}</strong> ({showModal.email})? 
                All their data including orders will be permanently removed. This action cannot be undone.
              </p>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 bg-surface-700 hover:bg-surface-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deletingId === showModal._id} className="flex-1 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
                  {deletingId === showModal._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
