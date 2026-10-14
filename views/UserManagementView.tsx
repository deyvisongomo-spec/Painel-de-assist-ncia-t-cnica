
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, X, Check, AlertCircle, Edit3, Key, Save, LogOut, Percent } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface UserManagementViewProps {
  currentUser: UserType;
  onUpdateSelf: (updated: UserType) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ currentUser, onUpdateSelf }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', role: 'USER' as 'USER' | 'ADMIN', commissionRate: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    const list = await api.getUsersList();
    setUsers(list);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await api.addUser(newUser);
    if (result.success) {
      setShowAddForm(false);
      setNewUser({ name: '', username: '', email: '', password: '', role: 'USER', commissionRate: 0 });
      loadUsers();
      setSuccess(result.message || 'Colaborador criado com sucesso!');
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(result.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const updated = await api.updateUser(editingUser.id, editingUser);
      if (editingUser.id === currentUser.id) onUpdateSelf(updated);
      setEditingUser(null);
      loadUsers();
      setSuccess('Usuário atualizado!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar usuário');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remover este acesso permanentemente?')) {
      await api.removeUser(id);
      loadUsers();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Equipe & Acessos</h2>
          <p className="text-slate-500 font-medium">Controle quem opera o sistema e suas respectivas comissões.</p>
        </div>
        {success && <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black animate-bounce flex items-center gap-2"><Check size={14}/> {success}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((u) => (
          <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${u.role === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                {u.role === 'ADMIN' ? <Shield size={32} /> : <UserIcon size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 truncate">{u.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">@{u.username}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    <Percent size={10} /> {u.commissionRate}% Comissão
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingUser(u)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit3 size={20} /></button>
                {u.id !== 'admin-1' && (
                  <button onClick={() => handleDelete(u.id)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={() => { setShowAddForm(true); setEditingUser(null); }}
          className="md:col-span-2 bg-blue-50 border-2 border-dashed border-blue-200 p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-blue-500 hover:bg-blue-100 transition-all"
        >
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
            <UserPlus size={32} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">Adicionar Novo Colaborador</span>
        </button>
      </div>

      {(showAddForm || editingUser) && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={() => { setShowAddForm(false); setEditingUser(null); }} className="p-3 text-slate-400 hover:text-slate-800 rounded-full"><X size={24}/></button>
            </div>
            <form onSubmit={editingUser ? handleUpdate : handleAdd} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nome do Colaborador</label>
                  <input required type="text" value={editingUser ? editingUser.name : newUser.name} onChange={e => editingUser ? setEditingUser({...editingUser, name: e.target.value}) : setNewUser({...newUser, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Usuário (@)</label>
                    <input required type="text" value={editingUser ? editingUser.username : newUser.username} onChange={e => editingUser ? setEditingUser({...editingUser, username: e.target.value}) : setNewUser({...newUser, username: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">% Comissão (MO)</label>
                    <input required type="number" value={editingUser ? editingUser.commissionRate : newUser.commissionRate} onChange={e => editingUser ? setEditingUser({...editingUser, commissionRate: Number(e.target.value)}) : setNewUser({...newUser, commissionRate: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                  </div>
                </div>
                {!editingUser && (
                  <>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">E-mail de acesso</label>
                      <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="colaborador@email.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Senha inicial (mín. 6 caracteres)</label>
                      <input required type="password" minLength={6} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                    </div>
                  </>
                )}
                {editingUser && (
                  <div className="bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold p-4 rounded-2xl leading-relaxed">
                    Para trocar a senha, o próprio colaborador usa a opção "Esqueceu sua senha?" na tela de login. O e-mail de acesso não pode ser alterado por aqui.
                  </div>
                )}
              </div>
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-xl hover:bg-blue-700 transition-all">
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementView;
