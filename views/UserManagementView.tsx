
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, X, Check, AlertCircle, Edit3, Key, Save, LogOut } from 'lucide-react';
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
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'USER' as 'USER' | 'ADMIN' });
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
      setNewUser({ name: '', username: '', password: '', role: 'USER' });
      loadUsers();
      setSuccess('Usuário cadastrado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      const updated = await api.updateUser(editingUser.id, editingUser);
      if (editingUser.id === currentUser.id) {
        onUpdateSelf(updated);
      }
      setEditingUser(null);
      loadUsers();
      setSuccess('Credenciais atualizadas!');
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

  const handleSwitchUser = () => {
    if (confirm("Deseja sair para entrar com outro usuário?")) {
      localStorage.removeItem('asim_session');
      window.location.reload();
    }
  };

  const limitReached = users.length >= 3;

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Equipe & Acessos</h2>
          <p className="text-slate-500 font-medium">Controle quem pode operar o sistema da sua loja.</p>
        </div>
        <div className="flex items-center gap-4">
            {success && <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black animate-bounce flex items-center gap-2"><Check size={14}/> {success}</div>}
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acessos Extras: <span className="text-slate-800">{users.length-1} / 2</span></span>
            </div>
        </div>
      </div>

      <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 flex-shrink-0">
                <Shield size={48} />
            </div>
            <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2 justify-center lg:justify-start">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{currentUser.name}</h3>
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Master do Painel</span>
                </div>
                <p className="text-slate-400 font-bold text-sm">Este é o seu perfil administrativo. Personalize seu login aqui.</p>
                <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400">Login: <span className="text-white">@{currentUser.username}</span></div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button 
                    onClick={() => setEditingUser(users.find(u => u.id === currentUser.id) || null)}
                    className="flex-1 lg:flex-none px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                    <Edit3 size={18} /> Editar Meu Perfil
                </button>
                <button 
                    onClick={handleSwitchUser}
                    className="flex-1 lg:flex-none px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                >
                    <LogOut size={18} /> Trocar Conta
                </button>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em]">Colaboradores e Usuários</h3>
        </div>

        {users.filter(u => u.id !== currentUser.id).map((u) => (
          <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${u.role === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                {u.role === 'ADMIN' ? <Shield size={32} /> : <UserIcon size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 truncate">{u.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">@{u.username} • {u.role === 'ADMIN' ? 'ADMIN' : 'USUÁRIO'}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingUser(u)}
                  className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                >
                  <Edit3 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!limitReached ? (
          <button 
            onClick={() => { setShowAddForm(true); setEditingUser(null); }}
            className="md:col-span-2 bg-blue-50 border-2 border-dashed border-blue-200 p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-blue-500 hover:bg-blue-100 hover:border-blue-300 transition-all group"
          >
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <UserPlus size={32} />
            </div>
            <div className="text-center">
                <span className="font-black text-sm uppercase tracking-widest block">Adicionar Novo Usuário</span>
                <p className="text-[10px] font-bold text-blue-400 uppercase mt-1">Crie um acesso para um colaborador</p>
            </div>
          </button>
        ) : (
          <div className="md:col-span-2 border-4 border-dashed border-slate-100 p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-200 opacity-50 grayscale">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
              <Shield size={32} />
            </div>
            <span className="font-black text-[9px] uppercase tracking-[0.2em] text-center">Limite de Acessos Atingido</span>
          </div>
        )}
      </div>

      {(showAddForm || editingUser) && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase tracking-tight">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button onClick={() => { setShowAddForm(false); setEditingUser(null); }} className="p-3 text-slate-400 hover:text-slate-800 rounded-full"><X size={24}/></button>
            </div>
            <form onSubmit={editingUser ? handleUpdate : handleAdd} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nome do Colaborador</label>
                  <input required type="text" value={editingUser ? editingUser.name : newUser.name} onChange={e => editingUser ? setEditingUser({...editingUser, name: e.target.value}) : setNewUser({...newUser, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Nome completo" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Login / Usuário (@)</label>
                  <input required type="text" value={editingUser ? editingUser.username : newUser.username} onChange={e => editingUser ? setEditingUser({...editingUser, username: e.target.value}) : setNewUser({...newUser, username: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="ex: joao.recepcao" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Senha de Acesso</label>
                  <input required={!editingUser} type="password" value={editingUser ? editingUser.password : newUser.password} onChange={e => editingUser ? setEditingUser({...editingUser, password: e.target.value}) : setNewUser({...newUser, password: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Senha segura" />
                </div>
                {!editingUser && (
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nível de Permissão</label>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
                      <option value="USER">USUÁRIO (Operacional)</option>
                      <option value="ADMIN">ADMINISTRADOR (Acesso Total)</option>
                    </select>
                  </div>
                )}
              </div>
              {error && <div className="text-rose-500 text-xs font-bold p-3 bg-rose-50 rounded-xl flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                {editingUser ? 'Salvar Alterações' : 'Criar Acesso'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementView;
