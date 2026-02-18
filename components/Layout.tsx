
import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../constants';
import { Menu, X, Bell, User as UserIcon, LogOut, Users as UsersIcon, History, Wallet } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [config, setConfig] = useState({ logo: '', name: 'Painel da Asim' });

  useEffect(() => {
    const saved = localStorage.getItem('app_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    if (confirm("Deseja sair do sistema?")) {
      localStorage.removeItem('asim_session');
      window.location.reload();
    }
  };

  const visibleMenuItems = MENU_ITEMS.filter(item => {
    if (user.role === 'USER') {
      return !['caixa', 'fornecedores', 'configuracoes'].includes(item.id);
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">{config.name}</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-md">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed md:relative top-0 bottom-0 left-0 w-64 bg-white border-r z-50 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-8 hidden md:block border-b mb-4">
          {config.logo ? <img src={config.logo} alt="Logo" className="max-h-16 w-full object-contain" /> : <h1 className="text-2xl font-bold text-blue-600">{config.name}</h1>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              {item.icon} {item.label}
            </button>
          ))}
          
          {user.role === 'ADMIN' && (
            <>
              <div className="my-4 border-t border-slate-100 pt-4 px-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Administração</p>
              </div>
              <button onClick={() => { setActiveTab('comissoes'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'comissoes' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Wallet size={20} /> Comissões
              </button>
              <button onClick={() => { setActiveTab('usuarios'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'usuarios' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                <UsersIcon size={20} /> Equipe
              </button>
              <button onClick={() => { setActiveTab('auditoria'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'auditoria' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                <History size={20} /> Auditoria / Logs
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t mt-auto space-y-2 bg-white">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              <UserIcon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[9px] font-black uppercase text-blue-500 tracking-widest">{user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'USUÁRIO'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            <LogOut size={16} /> Sair do Painel
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
        <div className="hidden md:flex bg-white border-b h-16 items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            {activeTab === 'comissoes' ? 'Comissões' : activeTab === 'usuarios' ? 'Equipe' : activeTab === 'auditoria' ? 'Auditoria' : MENU_ITEMS.find(item => item.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative"><Bell size={20} /></button>
            <div className="h-8 w-px bg-slate-200"></div>
            <span className="text-sm font-bold text-slate-400">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
